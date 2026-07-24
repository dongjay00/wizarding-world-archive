# ADR-0002 — TanStack Query for Server State

- **status**: accepted (frozen)
- **date**: retro

## Context
5종 엔티티의 목록/상세를 외부 REST에서 읽는다. 로딩·에러·캐시·페이지네이션·재요청을 일관되게 다뤄야 한다.

## Decision
서버 상태는 **TanStack Query v5**가 단독 소유한다. 컴포넌트는 `lib/hooks/use*`만 소비하고 `fetch`나 `*API`를 직접 부르지 않는다. `queryKey=[entity, options]`, `staleTime` 목록 5분/상세 10분.

## Consequences
- (+) 로딩/에러/캐시/중복요청 제거를 선언적으로 처리.
- (+) 훅 계층이 데이터 소비의 유일 진입점(테스트·목킹 지점 명확 → TestStrategy).
- (−) Next fetch 캐시(revalidate 3600)와 **이중 캐시 계층** 발생 → SDD/data-fetching에서 관리, 무효화 기능 도입 시 재검토.

## Alternatives rejected
- RSC + `fetch`만: 필터·페이지 상호작용이 클라이언트 상태라 클라 데이터 훅이 여전히 유리.
- SWR: 팀 선호·devtools·mutation 생태계로 TanStack 우선.
