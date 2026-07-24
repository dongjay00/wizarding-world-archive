# ADR-0004 — PotterDB REST as Data Source

- **status**: accepted (frozen)
- **date**: retro

## Context
해리 포터 canon 데이터가 필요하나 자체 백엔드는 비목표(PRD Non-goal).

## Decision
**PotterDB** REST(`https://api.potterdb.com/v1`)를 유일 데이터 소스로. JSON:API 스타일(`data/meta/links`, `id+type+attributes`). 필터/정렬 문법(`filter[key]`, `page[number]`, `sort`)을 그대로 채택(Domain R-5).

## Consequences
- (+) 백엔드 불필요, 즉시 풍부한 데이터.
- (−) 외부 가용성·스키마에 종속 → 방어적 렌더(Domain R-3)·에러 계약 필수.
- (−) 이미지 호스트가 앱의 `remotePatterns`와 어긋날 수 있음 → **decision-queue D-3**, Constraints C-4.
- (−) 쿼리 대괄호 비인코딩 등 클라이언트 문법 취약점 → 단위 테스트 1순위(TestStrategy).

## Alternatives rejected
- HP-API(hpapi): 페이지네이션/필터/책·챕터 등 범위 부족.
- 자체 DB 구축: 비목표.
