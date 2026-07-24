# ADR-0009 — Local Favorites via Zustand Persist

- **status**: accepted
- **date**: 2026-07-09
- **근거**: PRD AC-14~16, UIUX U-8~9, ADR-0003

## Context

사용자는 로그인 없이 캐릭터·주문·마법약·영화·책을 탐색한다. 다시 보고 싶은 항목을 같은 브라우저에서 빠르게 모아볼 수 있어야 하지만, 계정·서버 쓰기·동기화는 PRD 비목표다.

## Decision

즐겨찾기 상태는 **Zustand persist + localStorage**가 단일 소유한다.

- store: `src/lib/stores/favoritesStore.ts`
- 저장 키: 앱 전용 localStorage key
- 저장 값: `type/id/title/subtitle/image/href/savedAt` 최소 표시 메타데이터
- 표면: 5종 목록 카드, 5종 상세 페이지, `/favorites`

## Consequences

- (+) 서버 변경 없이 즉시 저장/해제 UX를 제공한다.
- (+) ADR-0003의 Zustand 채택을 실제 로컬 UI 상태 용도로 사용한다.
- (+) `/favorites`가 API 재조회 없이 빠르게 렌더된다.
- (-) 브라우저/기기 간 동기화는 없다.
- (-) 저장 후 원본 데이터가 바뀌어도 즐겨찾기 목록의 제목·이미지는 저장 당시 값이다. 상세 링크 진입 시 최신 API 데이터를 다시 본다.

## Alternatives rejected

- URL searchParams: 공유/필터 상태에는 맞지만 개인 즐겨찾기 지속에는 부적합.
- 서버 저장: 인증·계정·쓰기 API가 필요해 PRD 비목표를 침범.
- 매번 API 재조회로 즐겨찾기 목록 구성: 다수 엔티티 id별 요청이 필요하고, 로컬 기능치고 비용이 크다.
