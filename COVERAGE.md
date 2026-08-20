# Screenpipe Coverage

Screenpipe tracks coverage at two complementary layers:

- Tauri/WebDriver E2E coverage: real product UX and local API behavior by platform.
- Core engine coverage: Rust behavioral flow coverage across capture, audio, DB, accessibility, and engine crates.

These dashboards are behavioral maps, not a replacement for line or branch coverage.
Use them to see which product risks are represented, then layer runtime job
results and `cargo llvm-cov` data on top when judging release confidence.

## Dashboards

- E2E dashboard: [apps/screenpipe-app-tauri/e2e/COVERAGE.md](apps/screenpipe-app-tauri/e2e/COVERAGE.md)
- Core engine dashboard: [docs/coverage/CORE.md](docs/coverage/CORE.md)

## Current Snapshot

### Tauri E2E

- Mapped specs: 118
- Declared test blocks: 339
- Weighted coverage points: 265.2

| Platform | Specs | Declared tests | Weighted points | Layers | Features | Critical score |
| --- | --- | --- | --- | --- | --- | --- |
| windows | 90 | 293 | 239.3 | 15 | 94 | 92% |
| macos | 114 | 301 | 235.0 | 17 | 100 | 90% |
| linux | 79 | 251 | 208.5 | 14 | 90 | 88% |

### Core Engine

- Mapped suites: 32
- Mapped Rust files: 330
- Active test blocks: 3197
- Ignored/manual test blocks: 138
- Weighted coverage points: 2622.5

| Platform | Suites | Active tests | Ignored tests | Weighted points | Layers | Flows | Critical score |
| --- | --- | --- | --- | --- | --- | --- | --- |
| windows | 29 | 3058 | 133 | 2559.1 | 21 | 11 | 100% |
| macos | 29 | 3116 | 113 | 2571.5 | 22 | 11 | 100% |
| linux | 25 | 2732 | 106 | 2262.4 | 20 | 11 | 100% |

## Refresh

From `apps/screenpipe-app-tauri`:

```bash
bun run coverage:all
bun run coverage:all:check
```

For core line coverage, install/use `cargo llvm-cov` and feed its JSON
summary into `coverage:core`; the core dashboard documents the exact command.
