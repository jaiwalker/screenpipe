// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com

import type { WorkflowAnalysis, WorkflowRuntime } from "./model";

export type WorkflowsPlatform = {
  ensureRuntime: () => Promise<WorkflowRuntime>;
  analyzeCapturedWork: (days: number) => Promise<WorkflowAnalysis>;
  openAccount?: () => Promise<void>;
  startWindowDrag?: () => Promise<void> | void;
};

export type WorkflowsAppProps = {
  platform: WorkflowsPlatform;
  initialAnalysis?: WorkflowAnalysis | null;
  storageKey?: string | null;
};
