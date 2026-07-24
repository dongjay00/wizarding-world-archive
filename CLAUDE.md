# CLAUDE.md — Claude Code 어댑터

> 이 파일은 **어댑터**다. 거버넌스의 규범(파이프라인·step·게이트·문서 계약)은 **[`AGENTS.md`](./AGENTS.md)가 단일 출처**다.
> 여기서는 Claude Code가 그 규범을 **어떻게 실행하는지**(서브에이전트·hook·도구)만 정의한다.

## 먼저 읽어라

작업 시작 전 항상:
1. **[`AGENTS.md`](./AGENTS.md)** — 파이프라인과 현재 어느 step인지.
2. **`docs/runtime/session.md`** — 직전 핸드오프(기억이 아니라 파일에서 상태를 얻는다).
3. 해당 step이 `AGENTS.md §4`에서 **읽도록 지정한 State 문서**만.

## Step → 서브에이전트 매핑

`AGENTS.md §4`의 10개 step은 `.claude/agents/`의 서브에이전트로 실행한다. 각 에이전트는 자기 step의 계약(reads/writes/gate/done)을 `AGENTS.md`에서 그대로 상속한다.

| step | 서브에이전트 |
|---|---|
| spec / requirement | `.claude/agents/spec.md`, `requirement.md` |
| architect / scaffold / build-ui / build-logic | `architect.md`, `scaffold.md`, `build-ui.md`, `build-logic.md` |
| verify / test | `verify.md`, `test.md` |
| review / wrap-up | `review.md`, `wrap-up.md` |

서브에이전트 호출은 Task 도구로. 한 step이 끝나면 결과 verdict를 `session.md`에 남기고 다음 step으로 핸드오프한다.

## 게이트 실행 (Claude 측)

- **gate1(휴먼)**, **gate3(휴먼)**: 자동 통과하지 않는다. 사람의 승인을 요청하고(질문), 승인 전까지 다음 phase로 넘어가지 않는다.
- **gate2(결정론)**: 발화 모델은 **전이 트리거(주) + Stop 안전망(보조)** (AGENTS.md §3). 주경로는 Implement→Testing 경계에서 `npm run gate2`로 완전 게이트(`tsc·lint·build`)를 1회 호출한다. Stop 안전망은 `.claude/hooks/gate2-build-verify.sh` wrapper가 중립 커널 `scripts/harness/gate2-build-verify.sh`를 호출하며, `.claude/settings.json`의 Stop hook에 연결된다. 기본 advisory·`GATE_ENFORCE=1` 시 차단.

## 문서 쓰기 규율 (재확인)

- 자기 step이 `AGENTS.md §4`에서 **쓰도록 허용한 문서만** 수정한다.
- 완료 표시는 `tasks.md`에만(§5). ADR은 append-only. State 재진입은 흔적을 남긴다.

## 프로젝트 사실 (빠른 참조)

- Next.js 16 App Router / React 19 / React Compiler on · TS strict · TanStack Query v5 · Zustand v5 · Tailwind v4 · PotterDB API.
- 정적 오라클: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- 알려진 부채: **없음** — D-1(상태 이원화)·D-2(테마 전략)·D-3(이미지 호스트)·D-4(gate2 lint) 전부 2026-07-09 종결. 이력은 `docs/runtime/summary.md`, 미결정 큐(`docs/runtime/decision-queue.md`)는 현재 비어 있음.
