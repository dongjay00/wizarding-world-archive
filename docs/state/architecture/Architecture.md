# Architecture

> 시스템의 **상위 경계·구조(HOW의 상위)**. 레이어 구분과 의존 방향, 모듈 경계, 주요 기술 선택.
> "무엇이 무엇을 알아도 되는가"의 큰 그림. Implement 초입에 freeze — 여기서 얼어야 아래 SDD·build가 안정된 골격 위에서 움직인다.
> 하위 상세(컴포넌트 트리·상태관리 설계·데이터 페칭)는 SDD/로, 되돌리기 어려운 결정은 ADR/로.

## 기술 선택 (요약)

| 축 | 선택 | 근거 문서 |
|---|---|---|
| 프레임워크 | Next.js 16 App Router, React 19, **React Compiler** on | ADR-0001 |
| 언어 | TypeScript strict, `@/*` 절대경로 | Constraints C-1, C-S4 |
| 서버 상태 | TanStack Query v5 | ADR-0002 |
| 전역 UI 상태 | Zustand v5 | ADR-0003 |
| 데이터 소스 | PotterDB REST (`api.potterdb.com/v1`) | ADR-0004 |
| 스타일 | Tailwind CSS v4 (`@theme`), glassmorphism | ADR-0005, UIUX |
| 애니메이션 | Framer Motion | UIUX |
| 테마 | next-themes (class 전략) | ADR-0006(⚠ 결함 기록) |

## 레이어와 의존 방향

의존은 **위에서 아래로만** 흐른다. 아래 레이어는 위를 알지 못한다.

```
app/            (라우트·페이지·조합)          ← 화면 단위, "use client" 여기 다수
  │  imports
  ▼
components/     (features / layout / shared / ui)   ← 표현 컴포넌트
  │  imports
  ▼
lib/            (hooks / api / stores / utils)      ← 데이터·상태·유틸
  │  imports
  ▼
types/          (potter.ts)                          ← 순수 타입, 무의존
```

- **app → components → lib → types** 단방향. 역방향 import 금지(lib이 components를 import하면 안 됨).
- `types/`는 어느 것도 import하지 않는 잎(leaf).
- **모듈 경계**:
  - `lib/api` = 외부 세계와의 유일한 창구. 다른 레이어는 `fetch`를 직접 부르지 않고 `lib/api`의 `*API` 객체만 쓴다.
  - `lib/hooks` = `lib/api`를 TanStack Query로 감싼 **유일한** 데이터 소비 진입점. 컴포넌트는 hook만 부른다(api를 직접 부르지 않음).
  - `lib/stores` = 전역 클라이언트 상태(Zustand). 서버 데이터는 여기 두지 않는다(Query 소유).
  - `components/features` = 엔티티별 카드(도메인 인지), `components/ui`·`shared` = 도메인 무지 재사용 조각.

## 데이터 흐름 (읽기 파이프라인)

```
PotterDB REST
   ▲ fetch (revalidate 3600s, Next fetch cache)
   │
lib/api/client.ts  ── buildQueryString(page/filter/sort) ──► lib/api/index.ts (*API.getAll/getById)
   ▲
   │ queryFn
lib/hooks/use*.ts  (TanStack Query, staleTime 5~10분, queryKey=[entity, options])
   ▲
   │ hook 호출
app/**/page.tsx  ──► components/features/*Card  ──► components/ui, shared/Pagination
```

두 캐시 계층이 겹친다: **Next fetch 캐시(revalidate 3600s)** + **TanStack Query staleTime(5~10분)**. 정합·중복은 SDD/data-fetching에서 다룬다.

## 알려진 구조적 부채 (Architecture 레벨)

여기 적힌 것은 "구조를 흔드는" 이슈만. 세부는 `runtime/decision-queue.md`·`lessons.md`에.

- **A-1. 상태 소유 이원화**: `filterStore`(Zustand) 설계돼 있으나 페이지가 local `useState`로 필터를 들고 있어 store가 死코드에 가깝다. → D-1.
- **A-2. 테마 전략 불일치**: next-themes는 `class` 전략인데 `globals.css`는 `@media (prefers-color-scheme)`로 변수를 바꾼다. 토글이 CSS 변수에 반영되지 않는 경로 존재. + `themeStore.ts` 빈 파일. → ADR-0006, D-2.
- **A-3. 클라이언트 경계 과다**: 목록 페이지 전체가 `"use client"` → RSC 이점 미활용. → C-S1, L-2.
- **A-4. 이미지 호스트 화이트리스트 vs 실제 데이터**: `remotePatterns`와 PotterDB 반환 호스트 정합 미확인. → C-4, D-3.

## 확장 시 재진입 지점

새 엔티티 추가 = `types → lib/api → lib/hooks → components/features → app/route` 순으로 같은 슬라이스를 복제(수직 슬라이스 아키텍처). 새 기능(검색·즐겨찾기 등)은 이 문서를 재진입해 레이어 영향부터 판정한 뒤 SDD로 내린다.
