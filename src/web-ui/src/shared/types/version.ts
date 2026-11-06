/**
 * Build/version metadata types.
 */
export interface VersionInfo {
   
  name: string;
   
  version: string;
   
  buildDate: string;
   
  buildTimestamp: number;
   
  gitCommit?: string;
   
  gitCommitFull?: string;
   
  gitBranch?: string;
   
  isDev: boolean;
   
  buildEnv: 'development' | 'production' | 'preview';

  releaseChannel?: 'stable' | 'beta' | 'nightly';
}
