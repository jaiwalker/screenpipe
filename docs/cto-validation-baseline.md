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

The retained-package command verifies code signatures before and after copying, refuses to overwrite a version/build and records source identity and the executable checksum. It configures isolated data and port settings. Runtime isolation still requires checking the launched process.

## Remaining acceptance

Real screen edit retrieval, controlled two-lane audio accuracy, speaker uncertainty, sleep/wake, deletion, backup/restore, cross-version migration and five days of resource/reliability measurements remain open. Neither native compilation nor the MCP suite proves these capture behaviors.

Private run reports, feedback, app candidates and data remain under the ignored .cto-runtime directory. Commercial source licensing and stable development signing identity are not yet confirmed.
