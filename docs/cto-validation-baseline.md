# CTO development baseline — 5 September 2026

<!-- doc-covers: scripts/cto/, apps/screenpipe-app-tauri/scripts/build_macos.sh -->
<!-- doc-verified: 2d6c709ae10329ff597d37db67ef53af9cc2b2bf -->

Candidate: companion 0.1.0 build 1, upstream desktop app-v2.7.21. This is a development baseline, not daily-use acceptance.

## Verified checks

- Queued `bun run build:tauri:dev`: successful native compilation on Apple Silicon.
- `bun test scripts/cto/`: 11 passed, 0 failed, 29 assertions.
- `cd packages/screenpipe-mcp && bun run test`: 104 passed in 16 test files.
- Validation logs and feedback: exercised against a running official instance using supported local authentication. Fresh frame timestamps and bounded retrieval passed; controlled audio was explicitly not run. This result belongs to that official instance, not the fork.
- Computer-use fixture: created and visually checked a synthetic TextEdit document containing a date, a negation and a draft marker. Searches returned zero matches. Capture correctness did not pass. Feedback was retained locally with its source run/build reference.
- Regression improvement: a fresh health response with empty search results initially incorrectly reported healthy. A failing regression was added, the status changed to unknown, and the test passed.

## Packaging investigation

The initial queued signed build failed on unsigned Metal code. Investigation showed that signing the input resource was insufficient: prebuild cleanup and resource copying can discard its generic signature. The final fix bundles Metal as a Tauri sidecar so it is signed after copying, and omits the unused empty Intel ONNX placeholder on Apple Silicon. The queued `APPLE_SIGNING_IDENTITY=- ./scripts/build_macos.sh` then completed successfully, including strict deep signature verification. The configuration override uses [Tauri's documented JSON Merge Patch behavior](https://v2.tauri.app/develop/configuration-files/). The build script also re-signs Metal after its final extended-attribute cleanup.

The retained-package command verifies code signatures before and after copying, refuses to overwrite a version/build and records source identity and the executable checksum. It configures isolated data and port settings. Computer-use launch succeeded. Runtime logs confirm the separate candidate recording directory, and the app requests health on port 3040. Onboarding has not started the recorder, so no listener or capture result is claimed.

## Remaining acceptance

Real screen edit retrieval, controlled two-lane audio accuracy, speaker uncertainty, sleep/wake, deletion, backup/restore, cross-version migration and five days of resource/reliability measurements remain open. Neither native compilation nor the MCP suite proves these capture behaviors.

Private run reports, feedback, app candidates and data remain under the ignored .cto-runtime directory. Commercial source licensing and stable development signing identity are not yet confirmed.

## Packaged candidate and UI outcome

The retained 0.1.0 build 1 package was created from clean source commit b5f93c181c3dfdf3b8f569de20afac39566e47be and passed strict deep signature checks. A second packaging invocation correctly refused the existing destination and left the manifest unchanged. Its executable checksum is in the private candidate manifest.

Computer use opened the app and exercised Get Started. It reached browser authentication. The upstream callback uses the same screenpipe URL scheme as the official app, so the browser handoff was cancelled; the embedded sign-in fallback returned to onboarding in this test. No account token was copied from the official app, no purchase was completed, and no capture permissions were bypassed. Sign-in/onboarding and controlled capture tests remain required.

The fork's own health probe correctly reports degraded while port 3040 is unavailable at onboarding. The everyday instance remains separate. GitHub's CTO validation layer workflow passed for the implementation commit: https://github.com/jaiwalker/screenpipe/actions/runs/33949254130 . This is the 11-test validation job; it is not a remote native build or a capture-accuracy test.
