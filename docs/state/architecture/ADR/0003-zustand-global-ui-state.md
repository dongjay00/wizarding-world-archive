# ADR-0003 — Zustand for Global UI State

- **status**: accepted, **reserved** (필터 사용은 ADR-0007로 superseded)
- **date**: retro

## Context
검색·필터·정렬·페이지 등 UI 상태를 전역에서 공유할 수단이 필요하다고 판단.

## Decision
전역 클라이언트 UI 상태 도구로 **Zustand v5**를 채택. retro 시점에는 `lib/stores/filterStore.ts`에 필터 상태와 "변경 시 page=1 리셋" 규칙을 설계했다.

## Consequences
- (+) 경량·보일러플레이트 적음. 서버 상태(Query)와 역할 분리 명확.
- (현재) 필터 상태 용도는 **ADR-0007로 superseded**: URL searchParams(nuqs)가 지속 필터 상태를 단일 소유하고, `filterStore.ts`는 2026-07-09 D-1에서 삭제됐다. Zustand 채택 자체는 향후 전역 클라이언트 UI 상태가 필요할 때 쓰는 예약 결정으로 남긴다.
- (주의) 서버 상태는 계속 TanStack Query 소유이며, Zustand에 두지 않는다.

## Alternatives rejected
- Redux Toolkit: 이 규모엔 과함.
- Context만: 잦은 필터 변경에 리렌더 비용·보일러플레이트.
