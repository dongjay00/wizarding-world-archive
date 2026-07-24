#!/usr/bin/env bash
# gate2 — build-verify (결정론 오라클). AGENTS.md §3 / Constraints C-1~C-3.
#
# 종류: 결정론 게이트. tsc --noEmit + eslint (+ 선택적 next build) 모두 pass여야 통과.
#
# 실행 모드:
#   - 기본(advisory): 판정만 출력하고 세션을 막지 않는다(exit 0).
#   - GATE_ENFORCE=1 : fail 시 exit 2로 **차단**(Claude Code Stop hook이 계속 진행을 강제).
#   - GATE_FULL=1    : next build 까지 포함(느림). 기본은 tsc + lint 만.
#
# 왜 기본이 advisory인가: 모든 Stop마다 빌드를 돌리면 대화가 느려진다.
# feature 구현 세션에서 실제로 게이트를 무장하려면 GATE_ENFORCE=1 로 실행한다.

set -uo pipefail
cd "$(dirname "$0")/../.." || exit 0

ENFORCE="${GATE_ENFORCE:-0}"
FULL="${GATE_FULL:-0}"

if [ "$ENFORCE" != "1" ]; then
  echo "[gate2] advisory 모드 (미무장). 무장하려면 GATE_ENFORCE=1. — AGENTS.md §3"
  exit 0
fi

fail=0
echo "[gate2] build-verify 시작 (C-1 tsc / C-2 lint$( [ "$FULL" = "1" ] && echo ' / C-3 build' ))"

echo "[gate2] C-1 tsc --noEmit ..."
if ! npx --no-install tsc --noEmit; then echo "[gate2] ✗ C-1 tsc FAIL"; fail=1; fi

echo "[gate2] C-2 eslint ..."
if ! npm run --silent lint; then echo "[gate2] ✗ C-2 lint FAIL"; fail=1; fi

if [ "$FULL" = "1" ]; then
  echo "[gate2] C-3 next build ..."
  if ! npm run --silent build; then echo "[gate2] ✗ C-3 build FAIL"; fail=1; fi
fi

if [ "$fail" != "0" ]; then
  echo "[gate2] ✗ 차단: build-verify 실패 → build-logic 되감기 (AGENTS.md §2)" >&2
  exit 2
fi
echo "[gate2] ✓ 통과 → Testing 진입 허용"
exit 0
