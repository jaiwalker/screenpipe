// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com

import type { WorkflowAnalysis, WorkflowRuntime } from "./model";
import type { WorkflowsPlatform } from "./platform";

export type WebWorkflowsPlatformOptions = {
  runtimeEndpoint?: string;
  analysisEndpoint?: string;
  accountUrl?: string;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
};

async function resolvedHeaders(value: WebWorkflowsPlatformOptions["headers"]) {
  if (!value) return {};
  return typeof value === "function" ? value() : value;
}

async function requestJson<T>(url: string, init: RequestInit, headers: WebWorkflowsPlatformOptions["headers"]) {
  const requestHeaders = new Headers(await resolvedHeaders(headers));
  const extraHeaders = new Headers(init.headers);
  extraHeaders.forEach((value, key) => requestHeaders.set(key, value));
  if (!requestHeaders.has("content-type")) requestHeaders.set("content-type", "application/json");

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: requestHeaders,
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `Workflows request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function createWebWorkflowsPlatform(options: WebWorkflowsPlatformOptions = {}): WorkflowsPlatform {
  const runtimeEndpoint = options.runtimeEndpoint ?? "/api/workflows/runtime";
  const analysisEndpoint = options.analysisEndpoint ?? "/api/workflows/analyze";
  return {
    ensureRuntime: () => requestJson<WorkflowRuntime>(runtimeEndpoint, { method: "POST", body: "{}" }, options.headers),
    analyzeCapturedWork: (days) => requestJson<WorkflowAnalysis>(analysisEndpoint, {
      method: "POST",
      body: JSON.stringify({ days }),
    }, options.headers),
    openAccount: async () => {
      if (typeof window !== "undefined") window.location.assign(options.accountUrl ?? "/login?next=/workflows");
    },
  };
}
