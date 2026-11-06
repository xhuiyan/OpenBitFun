import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isRunnerAcquisitionAnnotation,
  planRunnerFaultRetry,
  selectFailedJobs,
} from './desktop-package-retry.mjs';

// Shaped after a real Desktop Package run (2026-11-05): the macOS arm64 job was
// cancelled after waiting in the hosted-runner queue without running one step.
const acquisitionAnnotation = {
  message: 'The job was not acquired by Runner of type hosted even after multiple attempts',
};
const capacityAnnotation = {
  message: 'Due to capacity constraints, jobs targeting macOS arm64 runners may experience longer queue times.',
};

function job(name, conclusion, stepCount) {
  return {
    id: name.length,
    name,
    conclusion,
    steps: Array.from({ length: stepCount }, (_, index) => ({ name: `step-${index}`, conclusion: 'success' })),
  };
}

const runnerFaultMacJob = { ...job('Package (macos-arm64)', 'cancelled', 0), id: 101 };
const executedMacJob = { ...job('Package (macos-arm64)', 'failure', 34), id: 102 };
const executedWindowsJob = { ...job('Package (windows-x64)', 'failure', 34), id: 103 };
const successfulWindowsJob = { ...job('Package (windows-x64)', 'success', 34), id: 104 };
const prepareJob = job('Prepare', 'success', 6);
const skippedJob = job('Upload Release Assets', 'skipped', 0);

describe('desktop package runner-fault retry', () => {
  it('retries a run whose only failure never acquired a runner', () => {
    const plan = planRunnerFaultRetry({
      runAttempt: 1,
      failedJobs: [prepareJob, successfulWindowsJob, runnerFaultMacJob, skippedJob],
      annotationsByJobId: { [runnerFaultMacJob.id]: [acquisitionAnnotation] },
    });

    assert.equal(plan.retry, true);
    assert.deepEqual(plan.runnerFaultJobs, [{
      id: runnerFaultMacJob.id,
      name: 'Package (macos-arm64)',
      conclusion: 'cancelled',
      executedSteps: 0,
    }]);
  });

  it('does not retry a job that ran steps, even with a runner annotation present', () => {
    const plan = planRunnerFaultRetry({
      runAttempt: 1,
      failedJobs: [executedMacJob],
      annotationsByJobId: { [executedMacJob.id]: [acquisitionAnnotation] },
    });

    assert.equal(plan.retry, false);
    assert.match(plan.reason, /actually ran/);
  });

  it('does not retry a cancelled stepless job with no runner annotation', () => {
    const plan = planRunnerFaultRetry({
      runAttempt: 1,
      failedJobs: [runnerFaultMacJob],
      annotationsByJobId: { [runnerFaultMacJob.id]: [] },
    });

    assert.equal(plan.retry, false);
    assert.match(plan.reason, /no failed job carries a runner acquisition annotation/);
  });

  it('does not treat a capacity warning alone as a runner acquisition failure', () => {
    assert.equal(isRunnerAcquisitionAnnotation(capacityAnnotation), false);
    assert.equal(isRunnerAcquisitionAnnotation(acquisitionAnnotation), true);

    const plan = planRunnerFaultRetry({
      runAttempt: 1,
      failedJobs: [runnerFaultMacJob],
      annotationsByJobId: { [runnerFaultMacJob.id]: [capacityAnnotation] },
    });
    assert.equal(plan.retry, false);
  });

  it('does not retry a mixed failure where real build work also failed', () => {
    const plan = planRunnerFaultRetry({
      runAttempt: 1,
      failedJobs: [executedWindowsJob, runnerFaultMacJob],
      annotationsByJobId: { [runnerFaultMacJob.id]: [acquisitionAnnotation] },
    });

    assert.equal(plan.retry, false);
    assert.deepEqual(plan.blockingJobs, [{
      id: executedWindowsJob.id,
      name: 'Package (windows-x64)',
      conclusion: 'failure',
      executedSteps: 34,
    }]);
  });

  it('stops after the attempt limit', () => {
    const plan = planRunnerFaultRetry({
      runAttempt: 3,
      failedJobs: [runnerFaultMacJob],
      annotationsByJobId: { [runnerFaultMacJob.id]: [acquisitionAnnotation] },
    });

    assert.equal(plan.retry, false);
    assert.match(plan.reason, /retry limit/);
  });

  it('does not retry a run with no failed jobs', () => {
    const plan = planRunnerFaultRetry({
      runAttempt: 1,
      failedJobs: [prepareJob, skippedJob],
      annotationsByJobId: {},
    });

    assert.equal(plan.retry, false);
    assert.match(plan.reason, /no failed jobs/);
  });

  it('selects only failure and cancelled jobs', () => {
    assert.deepEqual(
      selectFailedJobs([prepareJob, skippedJob, runnerFaultMacJob, executedWindowsJob]).map((entry) => entry.name),
      ['Package (macos-arm64)', 'Package (windows-x64)'],
    );
  });
});
