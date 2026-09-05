# Personal memory development on Screenpipe

<!-- doc-covers: scripts/cto/, cto-release.json -->
<!-- doc-verified: 2d6c709ae10329ff597d37db67ef53af9cc2b2bf -->

The development branch starts from `app-v2.7.21` at `2d6c709ae10329ff597d37db67ef53af9cc2b2bf`. The first addition is an independent validation/reporting layer. It does not modify capture callbacks, write to the Screenpipe database, enable an AI provider, or replace the running recorder.

## Version identity

`cto-release.json` records the companion version/build and pinned upstream tag/commit. Each validation run also records the current Git commit and the engine version returned by the API. Engine and desktop versions are distinct; an engine response such as `0.4.46` is not evidence of the desktop app's `2.7.21` version.

Keep a source commit for every tested iteration, increment the companion version/build when behavior changes, and retain the prior tested source ref and packaged artifact. Never reuse an app artifact identity for different bytes. Only use the upstream's development build/signing scripts. Official updater/download endpoints are not our fork's distribution system; do not publish an `app-v*` tag or alter production updater pointers.

## Run the improvement loop

1. Implement one bounded change tied to an observed failure or missing requirement.
2. Run `bun test scripts/cto/` and the relevant upstream tests. MCP baseline: `cd packages/screenpipe-mcp && bun run test`.
3. Capture a validation report with `bun scripts/cto/validate.ts --api http://127.0.0.1:3040`. Default port is deliberately 3040 for development. For an explicitly chosen everyday instance use its actual local origin, for example `--api http://127.0.0.1:3030`.
4. Set `SCREENPIPE_LOCAL_API_KEY` through Screenpipe's supported auth-token flow if the instance requires it. Do not put the key in arguments, source, reports or Git. The probe accepts only loopback origins and refuses redirects. It makes GET requests to `/health` and a bounded `/search` sample.
5. Inspect the generated `.cto-runtime/runs/<id>.md` and JSON. Health/freshness checks are separate from semantic correctness. For a controlled audio session, add `--require-audio`; this checks timestamp/state only, not the accuracy of the words or speakers.
6. Save optional feedback: `bun scripts/cto/validate.ts --run '<run-id>' --feedback 'Expected the edited date to be found; the result showed the old date.'`. Feedback stores the run/build ID and begins at `new`. Keep its text local. Add a minimized synthetic regression case, fix, rerun and record the fixed version.
7. Compare the same fixtures with the previous baseline. Required failures block promotion. Preserve failed and not-run results; do not overwrite the report to make it look green.

Reports and feedback are local files with restricted permissions and Git-ignored by default. The current command is an explicit one-shot development check; it is not a background monitor and does not ask daily questions. Automated report rotation and a dashboard for feedback are follow-on work. No report retention policy is claimed implemented yet; inspect the output folder's size during trials.

## Isolated native build

Install the repository's documented dependencies, including Bun, Rust, FFmpeg, full Xcode, git-lfs and sccache. From `apps/screenpipe-app-tauri`, use `bun install --frozen-lockfile` followed by `bun run build:tauri:dev`. This invokes the required shared native build queue and cache.

The upstream development bundle has a separate identity (`screenpi.pe.dev`). Select a separate recording data directory and API port before enabling capture. Never point a development build at the everyday `~/.screenpipe` data directory. See `docs/macos-dev-builds.md` for signing when persistent macOS capture permissions are needed. Do not launch the raw native binary and assume it has the bundled app's permission identity.

## Rollback

Reverting source is straightforward: check out a previously tested CTO commit in a separate checkout and rebuild with a new explicit candidate identity. App rollback must additionally verify database compatibility. Stop the development recorder, export a consistent backup using Screenpipe's own backup command, and include media/configuration needed for recovery. Test against a copy. Never downgrade an everyday database simply to get an older app running.

The initial CTO layer does not implement a database downgrade or snapshot restore. Screenpipe's official older-version installer depends on its hosted updater and account access. The fork will need its own retained artifacts/signing setup before it can promise an offline app rollback.

## Release acceptance still required

- Computer-use test of the development app and one-time macOS permissions.
- Twenty known screen changes, including dates, negations and draft/sent context.
- Both audio lanes in a controlled call, backgrounding, mute and route changes.
- Search and transcript correctness against retained source evidence.
- Sleep/wake, interrupted processing, retention/deletion and upgrade/rollback rehearsal.
- Five actual working days of passive capture and measured CPU, battery, storage and cost.

Commercial source licensing is being arranged. This checkout is for the permitted development/evaluation path until the relevant license is confirmed. An official app subscription must not be treated as a source-fork license.

## Retained local app candidates

After the canonical signed build succeeds, run `python3 scripts/cto/package-local.py` from the repo root. It verifies the input signature, refuses to overwrite an existing version/build, copies the app into `.cto-runtime/releases/<version>-build<N>/`, sets supported launch environment variables in its Info.plist, re-signs, verifies again and writes a manifest. The manifest includes source commit/dirty state and executable SHA-256. The bundle uses port 3040, a separate data directory per candidate, and disables telemetry. Check the actual runtime data path and listening port after launch before considering isolation verified.

The default local signature is ad hoc (`-`) and is not notarized. It supports local evaluation but does not promise stable macOS permission grants across changed builds. Set `APPLE_SIGNING_IDENTITY` consistently for the build and package steps when a development certificate is available.

Retaining a candidate preserves its app bytes and separate data directory. Switching back requires quitting the currently running development instance first because candidates share development bundle identity and port. Do not point an older candidate at newer data. Cross-version migration and a consistent backup/restore rehearsal remain release gates.
