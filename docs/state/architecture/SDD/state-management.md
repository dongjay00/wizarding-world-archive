# SDD — State Management

> status: **frozen** (현재 구현 반영, 부채 명시). 상위: Architecture A-1/A-2, ADR-0003/0006.

## 상태 3분류

| 종류 | 소유 | 도구 |
|---|---|---|
| 서버 상태(엔티티 데이터) | TanStack Query 캐시 | `lib/hooks` |
| 전역 UI 상태(필터·테마) | Zustand | `lib/stores` |
| 로컬 뷰 상태(입력·토글) | 컴포넌트 `useState` | 페이지/컴포넌트 |

## 설계 vs 현실 (⚠ 부채)

- **`lib/stores/filterStore.ts`** — `searchQuery/selectedHouse/selectedCategory/sortBy/currentPage` + 세터, `resetFilters`. 세터가 필터 변경 시 `currentPage: 1`로 리셋하는 규칙까지 설계됨.
  - **현실**: `app/characters/page.tsx` 등은 이 store를 **쓰지 않고** local `useState`로 동일 상태를 관리. → store는 사실상 死코드. → decision-queue **D-1**.
  - 결과 UX 부채: 필터 상태가 URL·전역에 없어 공유/새로고침 시 소실(UIUX UX-2).
- **`lib/stores/themeStore.ts`** — **빈 파일(0줄)**. 테마는 `next-themes`가 담당. → decision-queue **D-2**, ADR-0006.

## 목표 방향 (재진입 시)

D-1 결정에 따라 둘 중 하나로 수렴:
1. filterStore 채택 → 페이지의 local 상태 제거, store(또는 URL searchParams) 단일 소유.
2. filterStore 폐기 → local 상태 유지 공식화.

어느 쪽이든 "같은 상태 이중 보관 금지"(Constraints C-S2)를 만족해야 한다. 결정 전까지 신규 페이지는 **local `useState` 관례**를 따른다(현행 다수와 일치).
