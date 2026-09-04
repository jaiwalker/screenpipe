// screenpipe — AI that knows everything you've seen, said, or heard
// https://screenpipe.com

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { WorkflowsApp } from "@screenpipe/workflows-ui";
import { createFixtureWorkflowsPlatform, fixtureWorkflowAnalysis } from "@screenpipe/workflows-ui/fixture";

describe("shared workflows experience", () => {
  beforeEach(() => window.history.replaceState(null, "", "/"));

  it("renders the same complete experience with a browser-safe platform", async () => {
    const { container } = render(
      <WorkflowsApp
        platform={createFixtureWorkflowsPlatform()}
        initialAnalysis={fixtureWorkflowAnalysis}
        storageKey={null}
      />,
    );

    expect(await screen.findByRole("heading", { name: /see how your work/i })).toBeInTheDocument();
    expect(screen.getByText("5 known workflows")).toBeInTheDocument();
    expect(screen.getByText("Analysis only")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^time$/i }));
    expect(screen.getByRole("heading", { name: "Where your time goes" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /categories/i })).toHaveAttribute("aria-selected", "true");

    const scrollRegion = container.querySelector<HTMLElement>("[data-workflows-scroll-region]");
    expect(scrollRegion).not.toBeNull();
    if (scrollRegion) scrollRegion.scrollTop = 420;
    fireEvent.click(screen.getByRole("button", { name: /workflows 5/i }));
    expect(scrollRegion?.scrollTop).toBe(0);
    expect(screen.getByRole("heading", { name: "Your workflows" })).toBeInTheDocument();
    expect(screen.getByText("5 of 5 shown")).toBeInTheDocument();
  });
});
