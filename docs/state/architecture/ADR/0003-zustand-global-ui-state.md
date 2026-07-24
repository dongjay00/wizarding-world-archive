# ADR-0003 — Zustand for Global UI State

- **status**: accepted, but **underutilized** (frozen 결정 / 실사용 미결 → D-1)
- **date**: retro

## Context
검색·필터·정렬·페이지 등 UI 상태를 전역에서 공유할 수단이 필요하다고 판단.

## Decision
전역 클라이언트 UI 상태 도구로 **Zustand v5**를 채택. `lib/stores/filterStore.ts`에 필터 상태와 "변경 시 page=1 리셋" 규칙을 설계.

## Consequences
- (+) 경량·보일러플레이트 적음. 서버 상태(Query)와 역할 분리 명확.
- (−/미결) **실제로는 페이지들이 local `useState`를 써서 store가 死코드.** 상태 이중화 위험(Constraints C-S2). 채택/폐기 결정 미제 → **decision-queue D-1**.

## Alternatives rejected
- Redux Toolkit: 이 규모엔 과함.
- Context만: 잦은 필터 변경에 리렌더 비용·보일러플레이트.
