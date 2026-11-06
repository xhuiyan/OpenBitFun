#!/usr/bin/env node

/**
 * Re-run a Desktop Package workflow run whose only failed jobs never started
 * because GitHub could not acquire a hosted runner.
 *
 * GitHub cancels a hosted job that no runner takes in time. Such a job runs no
 * step, produces no build output, and still turns the whole run red. A step-level
 * retry inside the build cannot help because no job ever started, so the only
 * recovery is re-running the failed jobs of the same workflow run.
 *
 * This rescue is deliberately conservative:
 * - it only reacts to a completed run whose failure comes entirely from jobs
 *   that both ran no step and carry GitHub's "not acquired by Runner" annotation;
 * - a failure that executed a step is a real build failure and is never retried;
 * - it stops after MAX_RUN_ATTEMPTS total attempts, so a persistent runner
 *   shortage cannot loop forever.
 *
 * The workflow that invokes it owns the run-level guards (failure conclusion and
 * attempt count); this script owns classification, the recovery delay, and the
 * rerun request.
 */

import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const RUNNER_ACQUISITION_ANNOTATION =
  /The job was not acquired by Runner of type \S+ even after multiple attempts/i;

const MAX_RUN_ATTEMPTS = 3;

/** Give the hosted runner pool a short window before asking for the same labels again. */
const RETRY_DELAY_MS = 5 * 60 * 1000;

const FAILED_JOB_CONCLUSIONS = new Set(['failure', 'cancelled']);

export function isRunnerAcquisitionAnnotation(annotation) {
  return RUNNER_ACQUISITION_ANNOTATION.test(String(annotation?.message ?? ''));
}

export function selectFailedJobs(jobs) {
  return (jobs ?? []).filter((job) => FAILED_JOB_CONCLUSIONS.has(job?.conclusion));
}

function summarizeJobs(jobs) {
  return jobs.map((job) => ({
    id: job.id,
    name: job.name,
    conclusion: job.conclusion,
    executedSteps: (job.steps ?? []).length,
  }));
}

/**
 * Decide whether a completed run is recoverable by re-running failed jobs.
 *
 * @param {object} input
 * @param {number} input.runAttempt  Attempt number of the completed run (1-based).
 * @param {Array} input.failedJobs   Jobs whose conclusion is failure or cancelled.
 * @param {Record<string, Array>} input.annotationsByJobId  Check-run annotations per job id.
 * @param {number} [input.maxAttempts]
 */
export function planRunnerFaultRetry({
  runAttempt,
  failedJobs,
  annotationsByJobId,
  maxAttempts = MAX_RUN_ATTEMPTS,
}) {
  const failed = selectFailedJobs(failedJobs);

  if (!Number.isFinite(runAttempt) || runAttempt < 1) {
    return { retry: false, reason: 'the completed run attempt is unknown' };
  }
  if (runAttempt >= maxAttempts) {
    return {
      retry: false,
      reason: `attempt ${runAttempt} reached the automatic retry limit (${maxAttempts})`,
    };
  }
  if (failed.length === 0) {
    return { retry: false, reason: 'the run has no failed jobs' };
  }

  const neverStarted = failed.filter((job) => (job.steps ?? []).length === 0);
  const runnerFault = neverStarted.filter((job) =>
    (annotationsByJobId?.[job.id] ?? []).some(isRunnerAcquisitionAnnotation),
  );
  const blocking = failed.filter((job) => !runnerFault.includes(job));

  if (runnerFault.length === 0) {
    return {
      retry: false,
      reason:
        neverStarted.length === 0
          ? 'every failed job actually ran at least one step, so this is a real build failure'
          : 'no failed job carries a runner acquisition annotation',
      failedJobs: summarizeJobs(failed),
    };
  }
  if (blocking.length > 0) {
    return {
      retry: false,
      reason: 'failed jobs include work that actually ran, so this is a real build failure',
      blockingJobs: summarizeJobs(blocking),
      runnerFaultJobs: summarizeJobs(runnerFault),
    };
  }

  return {
    retry: true,
    reason: 'every failed job never started because no hosted runner was acquired',
    runnerFaultJobs: summarizeJobs(runnerFault),
  };
}

async function githubRequest({ apiUrl, token, path, method = 'GET' }) {
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'starmate-desktop-package-retry',
    },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${method} ${path} failed with ${response.status}: ${body.slice(0, 500)}`);
  }
  return response;
}

async function listRunJobs({ apiUrl, token, repository, runId }) {
  const jobs = [];
  for (let page = 1; page <= 10; page += 1) {
    const response = await githubRequest({
      apiUrl,
      token,
      path: `/repos/${repository}/actions/runs/${runId}/jobs?per_page=100&page=${page}`,
    });
    const payload = await response.json();
    jobs.push(...(payload.jobs ?? []));
    if (jobs.length >= (payload.total_count ?? 0)) {
      break;
    }
  }
  return jobs;
}

async function readAnnotations({ apiUrl, token, repository, jobId }) {
  try {
    const response = await githubRequest({
      apiUrl,
      token,
      path: `/repos/${repository}/check-runs/${jobId}/annotations?per_page=100`,
    });
    return await response.json();
  } catch (error) {
    // A matrix job that never expanded has no check-run to annotate. Treat that
    // as "no runner-fault evidence" instead of failing the rescue workflow.
    if (String(error.message).includes('failed with 404')) {
      return [];
    }
    throw error;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function writeStepSummary(lines) {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryFile) {
    return;
  }
  appendFileSync(summaryFile, `${lines.join('\n')}\n`);
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const runId = process.env.WORKFLOW_RUN_ID;
  const runAttempt = Number(process.env.WORKFLOW_RUN_ATTEMPT ?? '0');
  const apiUrl = process.env.GITHUB_API_URL ?? 'https://api.github.com';
  const dryRun =
    process.argv.includes('--dry-run') || process.env.WORKFLOW_RETRY_DRY_RUN === 'true';

  if (!token || !repository || !/^\d+$/.test(String(runId ?? '')) || !Number.isFinite(runAttempt)) {
    throw new Error(
      'GITHUB_TOKEN, GITHUB_REPOSITORY, a numeric WORKFLOW_RUN_ID and WORKFLOW_RUN_ATTEMPT are required',
    );
  }

  const jobs = await listRunJobs({ apiUrl, token, repository, runId });
  const failedJobs = selectFailedJobs(jobs);
  const annotationsByJobId = {};
  for (const job of failedJobs) {
    if ((job.steps ?? []).length > 0) {
      continue;
    }
    annotationsByJobId[job.id] = await readAnnotations({
      apiUrl,
      token,
      repository,
      jobId: job.id,
    });
  }

  const plan = planRunnerFaultRetry({ runAttempt, failedJobs, annotationsByJobId });
  const lines = [
    `## Desktop Package retry (run ${runId}, attempt ${runAttempt})`,
    '',
    `- Retry: **${plan.retry ? 'yes' : 'no'}**`,
    `- Reason: ${plan.reason}`,
  ];
  for (const job of plan.runnerFaultJobs ?? []) {
    lines.push(`- Runner never acquired: \`${job.name}\` (${job.conclusion})`);
  }
  for (const job of plan.blockingJobs ?? []) {
    lines.push(`- Real failure: \`${job.name}\` (${job.conclusion}, ${job.executedSteps} step(s))`);
  }
  console.log(lines.join('\n'));
  writeStepSummary(lines);

  if (!plan.retry) {
    return;
  }
  if (dryRun) {
    console.log('Dry run: skipping the delay and the rerun request.');
    return;
  }

  console.log(`Waiting ${RETRY_DELAY_MS / 1000}s before re-running the failed jobs.`);
  await sleep(RETRY_DELAY_MS);
  await githubRequest({
    apiUrl,
    token,
    path: `/repos/${repository}/actions/runs/${runId}/rerun-failed-jobs`,
    method: 'POST',
  });
  console.log(`Re-ran failed jobs for run ${runId}; next attempt is ${runAttempt + 1} of ${MAX_RUN_ATTEMPTS}.`);
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(`Desktop Package retry failed: ${error.message}`);
    process.exitCode = 1;
  });
}
