// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com

import { getCurrentWindow } from "@tauri-apps/api/window";
import type { WorkflowsPlatform } from "@screenpipe/workflows-ui";
import { commands } from "@/lib/utils/tauri";
import { analyzeCapturedWork, ensureWorkflowRuntime } from "./runtime";

export const desktopWorkflowsPlatform: WorkflowsPlatform = {
  ensureRuntime: ensureWorkflowRuntime,
  analyzeCapturedWork,
  openAccount: async () => {
    const result = await commands.openLoginWindow(null, "sign-up");
    if (result.status !== "ok") throw new Error(result.error);
  },
  startWindowDrag: () => getCurrentWindow().startDragging(),
};
