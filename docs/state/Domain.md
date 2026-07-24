# Domain

> 이 도메인의 **어휘와 규칙**. 유비쿼터스 언어, 상태 전이, 비즈니스 규칙. 데이터 구조가 아니라 *의미*.
> 데이터 모델은 SDD로 간다. PRD와 함께 Plan 게이트에서 freeze.

## 도메인 한 줄 정의

해리 포터(Wizarding World) 세계관의 **읽기 전용 아카이브**. 외부 API([PotterDB](https://api.potterdb.com/v1))가 제공하는 정전(canon) 데이터를 탐색·필터·열람한다. 사용자 생성 데이터도 인증도 없다 — 순수 조회 도메인.

## 유비쿼터스 언어 (핵심 용어)

| 용어 | 이 프로젝트에서의 의미 |
|---|---|
| **Entity(엔티티)** | 아카이브가 다루는 5종 자원의 통칭: Character, Spell, Potion, Movie, Book. 각 엔티티는 `id + type + attributes` 구조(JSON:API 스타일). |
| **Character** | 마법사·마녀·마법 생물. `house`, `blood_status`, `patronus`, `wands` 등으로 서술. |
| **House(기숙사)** | 호그와트 4기숙사: Gryffindor, Slytherin, Ravenclaw, Hufflepuff. 각 하우스는 고유 색 정체성(primary/secondary/gradient)을 가진다 → UIUX·`HOUSE_COLORS`의 근간. Character의 house는 null일 수 있다(비-학생/생물). |
| **Blood status(혈통)** | pure-blood / half-blood / muggle-born 등. 서술 속성일 뿐 접근 제어와 무관. |
| **Spell(주문)** | `incantation`(주문어), `category`(Charm/Curse/Hex/Jinx…), `light`(빛 색), `effect`로 서술. |
| **Potion(마법약)** | `difficulty`(Beginner~Very Advanced), `ingredients`, `effect`, `side_effects`로 서술. |
| **Movie / Book** | 영화 8편·소설 7권. Book은 **Chapter**를 관계로 가진다(`relationships.chapters`). |
| **Chapter** | Book에 종속. `order`(순서) + `summary`. Book 상세에서만 조회. |
| **Slug** | 사람이 읽는 안정 식별자. 라우팅에는 `id`(UUID)를 쓰고 slug는 표시·위키 링크용. |
| **Canon(정전)** | PotterDB가 제공하는 원본 사실. 이 앱은 canon을 **변형하지 않는다**(read-only). |

## 도메인 어휘 ko 표기 표준 (i18n 단일 출처, D-8 확정 2026-07-10)

> 고정 도메인 어휘의 **ko 표기(음역 규범)**를 여기서 못박는다. i18n(ko) 로케일의 도메인 어휘 매핑은 **이 표를 단일 출처로 삼아 정합**해야 한다(PRD AC-19). 메시지 카탈로그는 이 표를 복제할 뿐 독자 표기를 만들지 않는다.
> **적용 범위**: 아래는 **고정(closed) 도메인 어휘**(House 4종·Entity 5종·Chapter 등)에 한한다. **API 종속 필터 어휘**(Spell `category`·Potion `difficulty`·`sort` 키 등 R-5류)의 **원문 키는 영문 유지**가 원칙이며 이 표의 대상이 아니다(ko 화면 표시 라벨은 카탈로그가 담당하되 원문 키를 재명명하지 않는다).

| 어휘(en) | ko 표기 표준 | 비고 |
|---|---|---|
| **House(기숙사)** — Gryffindor | 그리핀도르 | House→색 매핑은 R-4(HOUSE_COLORS)가 소유, 표기만 여기서 확정 |
| **House** — Slytherin | 슬리데린 | |
| **House** — Ravenclaw | 래번클로 | |
| **House** — Hufflepuff | 후플푸프 | |
| **Entity** — Character | 인물 | 엔티티 범주명(내비·헤딩 등 chrome 표기) |
| **Entity** — Spell | 주문 | |
| **Entity** — Potion | 마법약 | |
| **Entity** — Movie | 영화 | |
| **Entity** — Book | 책 | |
| **Chapter** | 챕터 | Book 종속 관계 어휘 |
| **Entity(총칭)** | 엔티티 | 5종 자원 통칭 |

## 규칙 / 불변식 (도메인 레벨)

- **R-1. 읽기 전용**: 도메인에 쓰기/삭제/변경 연산이 없다. 모든 유스케이스는 조회.
- **R-2. 페이지네이션 계약**: 목록은 항상 페이지 단위. 페이지 메타(`current/last/records`)는 API가 소유하며 UI는 이를 신뢰한다. 클라이언트가 전체 집합을 보유한다고 가정하지 않는다(정렬·필터도 서버 위임).
- **R-3. null 관용**: 대부분의 attribute는 `null` 가능. UI는 누락을 정상 상태로 다루고 빈 값을 숨기거나 대체 표현을 쓴다(예: 이미지 없으면 Sparkles 아이콘).
- **R-4. House 색 매핑의 유일 출처**: House→색은 `HOUSE_COLORS`(constants.ts) + `@theme` 토큰. 4하우스 외 값은 색 없음으로 처리.
- **R-5. 필터 어휘는 API 종속**: 검색/필터 파라미터(`name_cont`, `house_eq`, `sort` 키 등)는 PotterDB의 쿼리 문법을 그대로 따른다 — 도메인이 독자 필터 언어를 만들지 않는다.
- **R-6. 도메인 어휘 ko 표기의 유일 출처**: 고정 도메인 어휘(House 4종·Entity 5종·Chapter 등)의 ko 표기 표준은 위 「도메인 어휘 ko 표기 표준」 표가 단일 출처다. i18n(ko) 메시지 카탈로그는 이 표와 정합해야 하며(PRD AC-19) 독자 표기를 만들지 않는다. 단 R-5의 API 종속 필터 어휘 원문 키는 이 규칙 밖(영문 유지).

## 상태 전이

도메인 데이터 자체엔 상태 전이가 없다(정적 canon). 유일한 "상태"는 **조회 상태**: `idle → loading → success | error`, 그리고 목록의 `page` 이동. 이는 TanStack Query가 관리(→ SDD/data-fetching).

## 경계 밖 (이 도메인이 다루지 않는 것)

인증·권한, 사용자 즐겨찾기/댓글, 쓰기 연산, 결제, 오프라인. (일부는 PRD의 향후 후보이며 그 시점에 도메인을 재진입해 확장한다.)
