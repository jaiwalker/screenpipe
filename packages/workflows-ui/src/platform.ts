// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com

import type { WorkflowAnalysis, WorkflowRuntime, WorkflowScope } from "./model";

export type WorkflowAnalysisOptions = {
  scope?: WorkflowScope;
};

export type WorkflowAnalysisJob = {
  id: string;
  status: "queued" | "processing" | "complete" | "failed";
  progress?: number;
  message?: string;
  result?: WorkflowAnalysis;
};

export type WorkflowsPlatform = {
  ensureRuntime: () => Promise<WorkflowRuntime>;
  analyzeCapturedWork: (days: number, options?: WorkflowAnalysisOptions) => Promise<WorkflowAnalysis>;
  loadCapturedWork?: (days: number, options?: WorkflowAnalysisOptions) => Promise<WorkflowAnalysis | null>;
  startAnalysisJob?: (days: number, options?: WorkflowAnalysisOptions) => Promise<WorkflowAnalysisJob>;
  getAnalysisJob?: (jobId: string) => Promise<WorkflowAnalysisJob>;
  openAccount?: () => Promise<void>;
  startWindowDrag?: () => Promise<void> | void;
};

export type WorkflowsAppProps = {
  platform: WorkflowsPlatform;
  initialAnalysis?: WorkflowAnalysis | null;
  storageKey?: string | null;
  initialScopeId?: string;
  embedded?: boolean;
};
