# Local development onboarding — build 2

<!-- doc-covers: scripts/cto/build-local.sh -->
<!-- doc-verified: 4d0faa535737ef8802524257025ff27d78e8e6b8 -->

Build 1 inherited production frontend account gating despite the native debug profile. Build 2 enables Screenpipe's existing NEXT_PUBLIC_SCREENPIPE_DEV_LOGIN_SKIP and NEXT_PUBLIC_SCREENPIPE_DEV_BILLING_BYPASS flags through a dedicated local build wrapper. No server entitlements or account credentials are fabricated. The source license remains applicable.

Validation:

- Canonical queued signed build succeeded and strict deep signature verification passed.
- A separate retained 0.1.0 build 2 package was signed and verified from clean commit 4d0faa535737ef8802524257025ff27d78e8e6b8.
- Upstream app-entitlement suite: 52 tests passed.
- CTO validation CI passed for this commit: https://github.com/jaiwalker/screenpipe/actions/runs/33967266485
- Computer use confirmed the development continuation button appeared, and choosing it advanced without account or checkout to referral then permissions.
- Microphone and accessibility permissions were recognised as granted. System Settings showed screen recording enabled. End-to-end screen capture has not yet passed.
- Build 1 became active during screen-permission testing, on a connection screen. UI testing paused to avoid interfering with user activity. Both retained packages share the development bundle identity; use the explicit build 2 path and close other development candidates before testing.

Build 1 and its private data are retained. Build 2 has its own data directory and port 3040. The shared callback issue is avoided by local development continuation; browser callback schemes themselves are unchanged. Hosted AI/connections still require their normal accounts and permissions.
