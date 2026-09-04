// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com

import { getCurrentWindow } from "@tauri-apps/api/window";
import type { WorkProfile, WorkflowsPlatform } from "@screenpipe/workflows-ui";
import { commands } from "@/lib/utils/tauri";
import { analyzeCapturedWork, ensureWorkflowRuntime } from "./runtime";

const WORK_PROFILE_KEY = "screenpipe-workflows:work-profile:v1";

function readWorkProfile(): WorkProfile | null {
  try {
    const value = window.localStorage.getItem(WORK_PROFILE_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<WorkProfile>;
    if (
      typeof parsed.summary !== "string" ||
      typeof parsed.priorities !== "string" ||
      typeof parsed.vocabulary !== "string" ||
      typeof parsed.guidance !== "string" ||
      !Array.isArray(parsed.kpis)
    ) return null;
    return {
      scope: parsed.scope === "workspace" ? "workspace" : "personal",
      summary: parsed.summary,
      priorities: parsed.priorities,
      kpis: parsed.kpis.filter((kpi) => kpi && typeof kpi === "object").map((kpi) => ({
        name: typeof kpi.name === "string" ? kpi.name : "",
        definition: typeof kpi.definition === "string" ? kpi.definition : "",
        target: typeof kpi.target === "string" ? kpi.target : "",
        cadence: typeof kpi.cadence === "string" ? kpi.cadence : "",
        owner: typeof kpi.owner === "string" ? kpi.owner : "",
      })),
      hourlyValue: parsed.hourlyValue && Number.isFinite(parsed.hourlyValue.amount)
        ? parsed.hourlyValue
        : null,
      vocabulary: parsed.vocabulary,
      guidance: parsed.guidance,
      visibility: parsed.visibility === "aggregate-workspace" ? "aggregate-workspace" : "device-only",
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : undefined,
    };
  } catch {
    return null;
  }
}

export const desktopWorkflowsPlatform: WorkflowsPlatform = {
  ensureRuntime: ensureWorkflowRuntime,
  analyzeCapturedWork: (days, options) => analyzeCapturedWork(days, options?.workProfile),
  loadWorkProfile: async () => readWorkProfile(),
  saveWorkProfile: async (profile) => {
    window.localStorage.setItem(WORK_PROFILE_KEY, JSON.stringify(profile));
    return profile;
  },
  openAccount: async () => {
    const result = await commands.openLoginWindow(null, "sign-up");
    if (result.status !== "ok") throw new Error(result.error);
  },
  startWindowDrag: () => getCurrentWindow().startDragging(),
};
