#!/usr/bin/env bash
# gate2 — build-verify (deterministic oracle). AGENTS.md §3 / Constraints C-1~C-3.
#
# Modes:
#   - default advisory: print the gate status and exit 0.
#   - GATE_ENFORCE=1: fail with exit 2 when any oracle fails.
#   - GATE_FULL=1: include next build. Default is tsc + lint only.

set -uo pipefail
cd "$(dirname "$0")/../.." || exit 0

ENFORCE="${GATE_ENFORCE:-0}"
FULL="${GATE_FULL:-0}"

if [ "$ENFORCE" != "1" ]; then
  echo "[gate2] advisory mode. Set GATE_ENFORCE=1 to enforce. See AGENTS.md §3."
  exit 0
fi

fail=0
echo "[gate2] build-verify start (C-1 tsc / C-2 lint$( [ "$FULL" = "1" ] && echo ' / C-3 build' ))"

echo "[gate2] C-1 tsc --noEmit ..."
if ! npx --no-install tsc --noEmit; then echo "[gate2] x C-1 tsc FAIL"; fail=1; fi

echo "[gate2] C-2 eslint ..."
if ! npm run --silent lint; then echo "[gate2] x C-2 lint FAIL"; fail=1; fi

if [ "$FULL" = "1" ]; then
  echo "[gate2] C-3 next build ..."
  if ! npm run --silent build; then echo "[gate2] x C-3 build FAIL"; fail=1; fi
fi

if [ "$fail" != "0" ]; then
  echo "[gate2] blocked: build-verify failed -> rewind to build-logic (AGENTS.md §2)" >&2
  exit 2
fi

echo "[gate2] pass -> Testing may proceed"
exit 0
