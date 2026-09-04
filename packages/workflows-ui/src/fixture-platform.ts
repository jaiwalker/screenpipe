// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com

import type {
  TimeAllocationItem,
  TimeProfileDimension,
  WorkflowAnalysis,
  WorkflowEvidence,
  WorkflowMap,
  WorkflowRuntime,
} from "./model";
import type { WorkflowsPlatform } from "./platform";

const analyzedAt = "2026-09-03T17:30:00.000Z";

function evidence(day: number, app: string, detail: string): WorkflowEvidence {
  return {
    timestamp: `2026-09-${String(day).padStart(2, "0")}T16:15:00.000Z`,
    app,
    detail,
  };
}

function screenshot(label: string, app: string, frameId: number) {
  const safeLabel = label.replace(/[<>&]/g, "");
  const safeApp = app.replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540"><rect width="960" height="540" fill="#f3f0e9"/><rect x="28" y="28" width="904" height="54" rx="12" fill="#1c2723"/><circle cx="58" cy="55" r="7" fill="#ff8577"/><circle cx="82" cy="55" r="7" fill="#ffd066"/><circle cx="106" cy="55" r="7" fill="#75d39b"/><text x="140" y="63" font-family="Arial" font-size="22" fill="#fff">${safeApp}</text><rect x="48" y="116" width="250" height="374" rx="16" fill="#e1ddd4"/><rect x="328" y="116" width="584" height="98" rx="16" fill="#fff"/><rect x="328" y="236" width="280" height="254" rx="16" fill="#fff"/><rect x="632" y="236" width="280" height="254" rx="16" fill="#fff"/><text x="356" y="172" font-family="Arial" font-size="26" font-weight="700" fill="#1c2723">${safeLabel}</text><text x="356" y="198" font-family="Arial" font-size="16" fill="#68736f">Fictional preview evidence</text></svg>`;
  return {
    frameId,
    timestamp: "2026-09-03T16:15:03.000Z",
    app,
    matchDistanceSeconds: 3,
    dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  };
}

type FixtureWorkflow = {
  title: string;
  description: string;
  trigger: string;
  outcome: string;
  apps: string[];
  stageNames: [string, string, string];
  activeMinutes: number;
  waitingMinutes: number;
  friction: string;
  control: "direct" | "influence" | "external" | "required";
};

function fixtureWorkflow(input: FixtureWorkflow, index: number): WorkflowMap {
  const firstEvidence = evidence(1 + index, input.apps[0], `${input.stageNames[0]} was observed in this fictional workspace.`);
  const secondEvidence = evidence(2 + index, input.apps[1] ?? input.apps[0], `${input.stageNames[1]} followed the first stage in a repeated sequence.`);
  const thirdEvidence = evidence(3 + index, input.apps.at(-1) ?? input.apps[0], `${input.stageNames[2]} completed the observed outcome.`);
  const allEvidence = [firstEvidence, secondEvidence, thirdEvidence];
  const stageActive = Math.max(2, Math.round(input.activeMinutes / 3));
  return {
    rank: index + 1,
    analysisDays: 90,
    title: input.title,
    description: input.description,
    repetitions: 5 + index,
    frequency: index < 2 ? "Several times a week" : "About weekly",
    trigger: input.trigger,
    outcome: input.outcome,
    totalMinutes: input.activeMinutes + input.waitingMinutes,
    activeMinutes: input.activeMinutes,
    waitingMinutes: input.waitingMinutes,
    appSwitches: input.apps.length + 2,
    confidence: 88 - index,
    apps: input.apps,
    handoffs: input.control === "external" ? ["External review"] : [],
    variations: ["The source material changes between runs", "Review depth depends on the request"],
    stages: input.stageNames.map((name, stageIndex) => ({
      name,
      description: [`Gather the inputs needed to begin ${input.title.toLowerCase()}.`, "Work through the main decision and supporting context.", "Review the result and close the loop."][stageIndex],
      activeMinutes: stageActive,
      waitingMinutes: stageIndex === 1 ? input.waitingMinutes : 0,
      apps: [input.apps[Math.min(stageIndex, input.apps.length - 1)]],
      confidence: 91 - stageIndex * 3,
      observedOccurrences: 5 + index,
      observedDays: 4 + index,
      evidence: [allEvidence[stageIndex]],
      screenshot: screenshot(name, input.apps[Math.min(stageIndex, input.apps.length - 1)], index * 10 + stageIndex + 1),
    })),
    bottlenecks: [{
      label: input.friction,
      stage: input.stageNames[1],
      type: input.control === "external" ? "handoff" : input.control === "required" ? "waiting" : "switching",
      control: input.control,
      controlReason: input.control === "direct" ? "The observed switching pattern is within the user's workflow." : input.control === "influence" ? "The user can improve the handoff but does not own the whole process." : input.control === "external" ? "The delay depends on another person or system." : "This pause is part of a deliberate review safeguard.",
      detail: `The observed sequence pauses during ${input.stageNames[1].toLowerCase()}.`,
      estimatedMinutesPerRun: Math.max(3, input.waitingMinutes),
      confidence: 82,
      evidence: secondEvidence.detail,
    }],
    evidence: allEvidence,
    quality: {
      grade: index < 3 ? "strong" : "good",
      evidenceCount: allEvidence.length,
      distinctDays: 4 + index,
      stageEvidenceCoverage: 100,
      repeatedStageCoverage: 100,
      screenshotCount: 3,
      stageScreenshotCoverage: 100,
      reasons: ["Every stage has an exact supporting observation", "The sequence repeated across several days", "Each stage has a nearby screenshot"],
    },
  };
}

function allocation(label: string, description: string, minutes: number, percentage: number, apps: string[], day: number): TimeAllocationItem {
  return {
    label,
    description,
    minutes,
    percentage,
    confidence: 86,
    distinctDays: 8,
    apps,
    evidence: [evidence(day, apps[0], `${label} was visible in this fictional preview workspace.`)],
  };
}

function dimension(items: TimeAllocationItem[], totalMinutes: number): TimeProfileDimension {
  const attributedMinutes = items.reduce((sum, item) => sum + item.minutes, 0);
  return {
    items,
    attributedMinutes,
    unattributedMinutes: Math.max(0, totalMinutes - attributedMinutes),
    coveragePercent: Math.round((attributedMinutes / totalMinutes) * 100),
  };
}

const workflows = [
  fixtureWorkflow({ title: "Customer feedback triage", description: "Review incoming feedback, connect it to product context, and decide what needs follow-up.", trigger: "New feedback arrives", outcome: "Feedback is categorized and routed", apps: ["Intercom", "Linear", "Slack"], stageNames: ["Read the request", "Check product context", "Route the follow-up"], activeMinutes: 28, waitingMinutes: 9, friction: "Context is split across tools", control: "direct" }, 0),
  fixtureWorkflow({ title: "Weekly product review", description: "Pull together recent product signals and turn them into a focused weekly decision review.", trigger: "Weekly review block starts", outcome: "Priorities and owners are clear", apps: ["Linear", "Notion", "Slack"], stageNames: ["Gather signals", "Compare priorities", "Share decisions"], activeMinutes: 46, waitingMinutes: 12, friction: "Review depends on missing updates", control: "influence" }, 1),
  fixtureWorkflow({ title: "Website release check", description: "Validate a website change from implementation through the final live-page review.", trigger: "A change is ready to review", outcome: "The release is verified", apps: ["GitHub", "Figma", "Chrome"], stageNames: ["Inspect the change", "Compare the experience", "Verify the live page"], activeMinutes: 34, waitingMinutes: 18, friction: "Deployment queue adds a wait", control: "external" }, 2),
  fixtureWorkflow({ title: "Partner meeting preparation", description: "Collect the relevant relationship history and prepare a concise meeting brief.", trigger: "A partner meeting is upcoming", outcome: "A focused brief is ready", apps: ["Calendar", "Gmail", "Docs"], stageNames: ["Confirm the meeting", "Review the history", "Write the brief"], activeMinutes: 24, waitingMinutes: 6, friction: "Details require a manual cross-check", control: "required" }, 3),
  fixtureWorkflow({ title: "Research synthesis", description: "Move from a bounded research question to a traceable summary of findings and open questions.", trigger: "A research question is defined", outcome: "Findings are ready for review", apps: ["Chrome", "Docs", "Slack"], stageNames: ["Collect sources", "Compare findings", "Share the synthesis"], activeMinutes: 51, waitingMinutes: 7, friction: "Frequent tab switching breaks focus", control: "direct" }, 4),
];

const totalMinutes = 1_860;

export const fixtureWorkflowAnalysis: WorkflowAnalysis = {
  schemaVersion: 5,
  analysis: { workflows },
  analyzedAt,
  days: 90,
  source: "screenpipe",
  bundleCount: 31,
  observedActiveMinutes: totalMinutes,
  quality: {
    grade: "strong",
    usableDays: 31,
    requestedDays: 90,
    capturedMinutes: totalMinutes,
    totalFrames: 12_480,
    appAttributionCoverage: 94,
    parsedContextCount: 2_914,
    verifiedEvidenceCount: 15,
    screenshotCount: 15,
    screenshotCoverage: 100,
    warnings: ["This public preview uses fictional work history."],
  },
  timeProfile: {
    days: 90,
    totalMinutes,
    categories: dimension([
      allocation("Product and planning", "Product decisions, prioritization, and review", 510, 27, ["Linear", "Notion"], 1),
      allocation("Communication", "Customer, partner, and team communication", 430, 23, ["Slack", "Gmail"], 2),
      allocation("Research", "Reading, comparison, and synthesis", 345, 19, ["Chrome", "Docs"], 3),
      allocation("Operations", "Recurring coordination and release work", 260, 14, ["Calendar", "GitHub"], 4),
    ], totalMinutes),
    projects: dimension([
      allocation("Northstar launch", "Website, release, and launch coordination", 470, 25, ["Figma", "GitHub"], 1),
      allocation("Customer learning", "Feedback review and customer research", 390, 21, ["Intercom", "Docs"], 2),
      allocation("Quarterly planning", "Roadmap preparation and prioritization", 305, 16, ["Linear", "Notion"], 3),
    ], totalMinutes),
    people: dimension([
      allocation("Maya Chen", "Planning, product review, and decision follow-up", 245, 13, ["Slack", "Calendar"], 1),
      allocation("Alex Rivera", "Customer learning and partner preparation", 190, 10, ["Gmail", "Docs"], 2),
    ], totalMinutes),
    companies: dimension([
      allocation("Northstar Labs", "Internal product and operating work", 690, 37, ["Linear", "Slack"], 1),
      allocation("Atlas Group", "Partner coordination and account review", 205, 11, ["Gmail", "Calendar"], 2),
      allocation("Juniper Co.", "Customer feedback and follow-up", 155, 8, ["Intercom", "Slack"], 3),
    ], totalMinutes),
  },
};

export const fixtureWorkflowRuntime: WorkflowRuntime = {
  source: "screenpipe",
  recording: true,
  apiBaseUrl: null,
  authenticatedLocalApi: true,
  cloudAuthAvailable: true,
  processingAvailable: true,
  reason: "Fictional website preview",
  captureLocation: "device",
  processingLocation: "device",
  syncState: "local-only",
};

export const fixtureEnterpriseRuntime: WorkflowRuntime = {
  ...fixtureWorkflowRuntime,
  processingLocation: "confidential-cloud",
  syncState: "synced",
  reason: "Fictional enterprise workspace preview",
  workspace: { id: "northstar", name: "Northstar Studios", role: "admin" },
  availableScopes: [
    { id: "organization", kind: "organization", label: "Organization", detail: "All approved workspace data" },
    { id: "team:product", kind: "team", label: "Product team" },
    { id: "personal", kind: "personal", label: "My work" },
  ],
};

export function createFixtureWorkflowsPlatform(analysis: WorkflowAnalysis = fixtureWorkflowAnalysis): WorkflowsPlatform {
  return {
    ensureRuntime: async () => fixtureWorkflowRuntime,
    analyzeCapturedWork: async () => analysis,
  };
}

export function createFixtureEnterpriseWorkflowsPlatform(analysis: WorkflowAnalysis = fixtureWorkflowAnalysis): WorkflowsPlatform {
  const scopedAnalysis = (scope = fixtureEnterpriseRuntime.availableScopes?.[0]) => ({
    ...analysis,
    scope,
    processing: { location: "confidential-cloud" as const, label: "Confidential cloud" },
  });
  return {
    ensureRuntime: async () => fixtureEnterpriseRuntime,
    loadCapturedWork: async (_days, options) => scopedAnalysis(options?.scope),
    analyzeCapturedWork: async (_days, options) => scopedAnalysis(options?.scope),
    startAnalysisJob: async (_days, options) => ({
      id: "fixture-enterprise-job",
      status: "complete",
      result: scopedAnalysis(options?.scope),
    }),
    getAnalysisJob: async () => ({ id: "fixture-enterprise-job", status: "complete", result: scopedAnalysis() }),
  };
}
