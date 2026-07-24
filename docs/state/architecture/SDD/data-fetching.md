# SDD — Data Fetching

> 하위 상세 설계(HOW의 하위). status: **frozen** (구현 확정 반영).
> writer: architect(초안) + build(확정). 상위: Architecture, ADR-0002/0004.

## 레이어

```
components  →  lib/hooks/use*  →  lib/api/index (*API)  →  lib/api/client (PotterAPIClient)  →  fetch
```

컴포넌트는 **hook만** 호출한다. `*API`·`fetch`를 직접 부르지 않는다(Architecture 경계).

## 클라이언트 (`lib/api/client.ts`)

- `PotterAPIClient.fetch<T>(endpoint, options)` / `fetchById<T>(endpoint, id)`.
- `buildQueryString`: JSON:API 스타일 쿼리 생성.
  - `page` → `page[number]=N`, `pageSize` → `page[size]=N` — **대괄호를 인코딩하지 않음**(PotterDB가 리터럴 대괄호를 요구). ⚠ 이 미묘함이 단위 테스트 1순위(TestStrategy).
  - `filter[key]=value`(value만 `encodeURIComponent`), `sort=값`(인코딩).
- `fetch` 옵션 `next: { revalidate: 3600 }` → Next 데이터 캐시 1시간.
- 에러: `!response.ok` 시 `throw new Error("API Error: status")`, `console.error` 후 rethrow.
- 싱글턴 `apiClient` export.

## API 모듈 (`lib/api/index.ts`)

엔티티별 `*API` 객체: `charactersAPI/spellsAPI/potionsAPI/moviesAPI/booksAPI`.
- 각기 `getAll(options)` / `getById(id)`. `booksAPI`는 추가로 `getChapters(bookId, options)`, `getChapterById`.
- 반환 타입은 `types/potter.ts`의 `*Response`.

## 훅 (`lib/hooks/use*.ts`)

TanStack Query v5 래퍼. 규약:
- `queryKey`: 목록 `[entity, options]`, 상세 `[entitySingular, id]`.
- `staleTime`: 목록 5분, 상세 10분. (QueryClient 기본 60s를 훅이 상향 오버라이드.)
- 상세/의존 쿼리는 `enabled: !!id`.
- 반환은 `useQuery` 결과 그대로(`data/isLoading/error`)를 페이지가 소비.

## 캐시 계층 (겹침 주의)

| 계층 | 수명 | 소유 |
|---|---|---|
| Next fetch cache | `revalidate 3600s` | client.ts |
| TanStack Query | `staleTime 5~10분` + gc | hooks |

두 계층이 독립적으로 캐싱한다. 현재는 문제되지 않으나(둘 다 읽기), 무효화가 필요한 기능이 생기면 정합 규칙을 재설계(재진입).

## 에러/로딩 계약

페이지는 `isLoading → FullPageLoader`, `error → ErrorMessage`, 성공 시 `data?.data ?? []` + `data?.meta?.pagination?.last ?? 1`로 방어적 접근(Domain R-3).
