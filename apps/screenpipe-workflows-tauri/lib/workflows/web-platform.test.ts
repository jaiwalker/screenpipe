// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com

import { afterEach, describe, expect, it, vi } from "vitest";
import { createWebWorkflowsPlatform } from "@screenpipe/workflows-ui/web";
import { fixtureWorkflowAnalysis, fixtureWorkflowRuntime } from "@screenpipe/workflows-ui/fixture";

describe("web workflows platform", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses authenticated website endpoints without exposing a recorder credential", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(fixtureWorkflowRuntime), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(fixtureWorkflowAnalysis), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const platform = createWebWorkflowsPlatform({ headers: { "x-session-proof": "present" } });

    await expect(platform.ensureRuntime()).resolves.toEqual(fixtureWorkflowRuntime);
    await expect(platform.analyzeCapturedWork(90)).resolves.toEqual(fixtureWorkflowAnalysis);

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/workflows/runtime", expect.objectContaining({
      method: "POST",
      credentials: "include",
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/workflows/analyze", expect.objectContaining({
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ days: 90 }),
    }));
    const headers = fetchMock.mock.calls[1][1].headers as Headers;
    expect(headers.get("x-session-proof")).toBe("present");
    expect(JSON.stringify(fetchMock.mock.calls)).not.toMatch(/api[_-]?key|bearer/i);
  });

  it("surfaces a website API failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Sign in required", { status: 401 })));
    const platform = createWebWorkflowsPlatform();

    await expect(platform.ensureRuntime()).rejects.toThrow("Sign in required");
  });
});
