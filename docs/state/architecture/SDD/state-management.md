# SDD — State Management

> status: **frozen** (현재 구현 반영). 상위: Architecture, ADR-0003/0007/0008/0009.
> **재진입 2026-07-09 (D-2, ADR-0008)**: 테마 상태 소유를 next-themes 단일로 확정, `themeStore.ts` 삭제. §상태3분류·§설계vs현실 갱신.
> **재진입 2026-07-09 (D-1, ADR-0007)**: 필터(지속 UI 상태) 소유를 **URL searchParams 단일**로 확정, 기제=nuqs. `filterStore.ts` 삭제 완료. §상태3분류·§설계vs현실·§목표방향 갱신.
> **재진입 2026-07-09 (D-5, ADR-0009)**: 로컬 즐겨찾기 상태를 Zustand persist(localStorage) 단일 소유로 추가.

## 상태 3분류

| 종류 | 소유 | 도구 |
|---|---|---|
| 서버 상태(엔티티 데이터) | TanStack Query 캐시 | `lib/hooks` |
| 지속 필터 상태(검색어·필터·페이지) | **URL searchParams 단일**(ADR-0007) | nuqs `useQueryStates` + 공용 팩토리 훅 `lib/hooks` |
| 로컬 즐겨찾기 상태 | **Zustand persist 단일**(ADR-0009) | `lib/stores/favoritesStore.ts` + localStorage |
| 테마 상태(light/dark) | **next-themes 단일**(localStorage 지속) | `providers.tsx` (ADR-0008) |
| 로컬 뷰 상태(입력·토글) | 컴포넌트 `useState` | 페이지/컴포넌트 |

> **Zustand 사용 경계**: 필터에 대한 실사용은 URL로 이전됐고, 즐겨찾기는 서버 쓰기 없는 로컬 사용자 상태이므로 Zustand persist가 소유한다. 서버 상태는 계속 TanStack Query가 소유한다.

## 필터(지속 UI 상태) — URL 단일 소유 설계 (ADR-0007)

- **소유처**: URL 쿼리 파라미터가 검색어·필터 선택·현재 페이지의 유일 진실원. 페이지는 이를 별도 지속 상태로 이중 보유하지 않는다(C-S2).
- **기제**: nuqs `useQueryStates`. root `layout.tsx`(또는 `providers.tsx`)에 `<NuqsAdapter>`(`nuqs/adapters/next/app`) 1회 배선.
- **공용 팩토리 + 페이지별 config**: 공통 규칙(아래)을 한 곳에 중앙화한 얇은 팩토리 훅(예: `lib/hooks/useListFilters.ts`)을 두고, 페이지별 **차원 차이**를 config로 파라미터화한다. 페이지별 얇은 래퍼(`useCharacterFilters` 등)는 선택(build 판단). 차원 차이(실측):
  - characters: `q`→`name_cont`, `house`→`house_eq`, sort `name`, pageSize 24
  - spells: `q`→`name_cont`, `category`→`category_eq`, sort `name`, pageSize 24
  - potions: `q`→`name_cont`, `difficulty`→`difficulty_eq`, sort `name`, pageSize 24
  - movies: `q`→**`title_cont`**, (필터 차원 없음), sort **`release_date`**, pageSize **12**
  - 공통 파라미터: `page`(정수, 기본 1).
- **공통 규칙**:
  - `clearOnDefault: true` — 기본값(빈 `q`·미선택 필터·`page=1`)은 URL 미부착(깨끗한 URL, AC-13).
  - 필터·검색 변경 시 `page=1` 리셋(AC-13, 기존 filterStore 규칙 계승).
  - `history: 'replace'`(히스토리 오염 방지).
- **검색 입력의 경계(C-S2 위반 아님 — 명시)**: 검색어 텍스트의 **커밋 전 순간값**은 컴포넌트 local `useState`(정당한 view 상태)로 두어 타이핑 즉각 반응을 유지하고, **디바운스 후** URL `q`에 커밋한다. URL이 유일 **지속** 출처이므로 이 local 미러는 "같은 지속 상태의 이중 보관"이 아니다. house/category/difficulty/page 등 이산 선택은 디바운스 없이 즉시 URL 커밋.
- **API 옵션 파생**: 훅은 URL 상태에서 `FetchOptions`(page/pageSize/filter/sort)를 파생해 `lib/hooks/use*`(TanStack Query)에 넘긴다. 서버 상태 경계(Query 소유)는 불변.

## 즐겨찾기(로컬 사용자 상태) — Zustand persist 단일 소유 (ADR-0009)

- **소유처**: `src/lib/stores/favoritesStore.ts`. localStorage에 persist되며 서버/API에는 쓰지 않는다.
- **저장 단위**: `{ type, id, title, subtitle?, image?, href, savedAt }`. `/favorites`는 저장 당시 메타데이터로 렌더하고, 상세 최신화 재조회는 하지 않는다.
- **적용 표면**: 5종 엔티티 목록 카드, 5종 상세 페이지, `/favorites` 집계 페이지, Header 네비.
- **수화 경계**: localStorage 수화 전에는 비활성/빈 상태가 잠깐 보일 수 있으므로 store가 `hasHydrated`를 노출해 `/favorites` 빈 상태 판정을 수화 후로 미룬다.

## 설계 vs 현실 (종결된 괴리)

- ~~**`lib/stores/filterStore.ts`** — `searchQuery/selectedHouse/selectedCategory/sortBy/currentPage` + 세터, `resetFilters`(필터 변경 시 `currentPage: 1` 리셋 규칙 설계됨).~~ **삭제 완료(2026-07-09, ADR-0007)**: 필터 소유를 URL 단일로 이전하면서 파일을 제거했다. `page=1` 리셋 규칙은 위 §URL 단일 소유 설계로 계승.
- ~~**`lib/stores/themeStore.ts`** — 빈 파일(0줄).~~ **삭제(2026-07-09, ADR-0008)**: 테마는 next-themes가 단일 소유. D-2 option (a)로 기제 일원화(`.dark` 클래스 + 시맨틱 토큰).

## 목표 방향 (수렴 완료)

~~D-1 결정에 따라 둘 중 하나로 수렴: (1) filterStore 채택 / (2) filterStore 폐기.~~
**확정(2026-07-09, ADR-0007)**: option (a) 변형 = **filterStore 폐기 + URL searchParams 단일 소유(nuqs)**. "같은 상태 이중 보관 금지"(C-S2)를 필터의 지속 상태를 URL 단일화함으로써 만족한다. 신규 목록 페이지는 이후 **위 §URL 단일 소유 설계(공용 팩토리 훅)** 를 관례로 따른다(local `useState` 지속 관례는 폐기).
