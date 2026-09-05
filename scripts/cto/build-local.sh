#!/bin/bash
# screenpipe — AI that knows everything you've seen, said, or heard
# https://screenpipe.com
set -euo pipefail
CTO_REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# Upstream's explicit local development affordances. These do not grant
# access to hosted services or change the applicable source license.
export NEXT_PUBLIC_SCREENPIPE_DEV_LOGIN_SKIP=true
export NEXT_PUBLIC_SCREENPIPE_DEV_BILLING_BYPASS=true
export NEXT_PUBLIC_SCREENPIPE_FORCE_BILLING_GATE=false
export APPLE_SIGNING_IDENTITY="${APPLE_SIGNING_IDENTITY:--}"
cd "$CTO_REPO_ROOT/apps/screenpipe-app-tauri"
exec ./scripts/build_macos.sh
