#!/usr/bin/env bash
# Claude Stop-hook compatibility wrapper.
# The tool-neutral gate implementation lives in scripts/harness.

set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)" || exit 0
exec bash "$ROOT/scripts/harness/gate2-build-verify.sh"
