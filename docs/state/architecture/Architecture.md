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
| 전역 UI 상태 | Zustand v5 + persist(localStorage) for favorites | ADR-0003, ADR-0007, ADR-0009 |
| 데이터 소스 | PotterDB REST (`api.potterdb.com/v1`) | ADR-0004 |
| 스타일 | Tailwind CSS v4 (`@theme`), glassmorphism | ADR-0005, UIUX |
| 애니메이션 | Framer Motion | UIUX |
| 테마 | next-themes (class 전략) + 시맨틱 토큰 | ADR-0008 (ADR-0006 supersede) |
| i18n (ko+en) | **next-intl** (App Router / RSC, `[locale]` 라우팅, `as-needed` 프리픽스, 미들웨어 감지·쿠키) | ADR-0010, ADR-0011, SDD/i18n |

## 레이어와 의존 방향

의존은 **위에서 아래로만** 흐른다. 아래 레이어는 위를 알지 못한다.

```
app/            (라우트·페이지·조합)          ← 화면 단위, "use client" 여기 다수
  │  imports
  ▼
components/     (features / layout / shared / ui)   ← 표현 컴포넌트
  │  imports
  ▼
lib/            (hooks / api / utils / stores 예약) ← 데이터·상태·유틸
  │  imports
  ▼
types/          (potter.ts)                          ← 순수 타입, 무의존
```

- **app → components → lib → types** 단방향. 역방향 import 금지(lib이 components를 import하면 안 됨).
- `types/`는 어느 것도 import하지 않는 잎(leaf).
- **모듈 경계**:
  - `lib/api` = 외부 세계와의 유일한 창구. 다른 레이어는 `fetch`를 직접 부르지 않고 `lib/api`의 `*API` 객체만 쓴다.
  - `lib/hooks` = `lib/api`를 TanStack Query로 감싼 **유일한** 데이터 소비 진입점. 컴포넌트는 hook만 부른다(api를 직접 부르지 않음).
  - `lib/stores` = 전역 클라이언트 상태(Zustand) 경계. 로컬 즐겨찾기처럼 브라우저에 지속되는 클라이언트 UI 상태를 둔다. 서버 데이터는 여기 두지 않는다(Query 소유).
  - `components/features` = 엔티티별 카드(도메인 인지), `components/ui`·`shared` = 도메인 무지 재사용 조각.
  - `src/i18n/*`(신규, i18n) = 로케일 라우팅·메시지 로딩·로케일 인지 네비게이션의 경계(`routing.ts`/`request.ts`/`navigation.ts`). `messages/{en,ko}.json` = 카탈로그(chrome + 고정 도메인 어휘, Domain R-6 정합). `src/middleware.ts`(신규) = 요청 경계에서 로케일 감지·프리픽스·쿠키. 컴포넌트/페이지는 `next/link`·`next/navigation` 직수입 대신 `@/i18n/navigation` 래퍼를 쓴다. → ADR-0010/0011, SDD/i18n.

## i18n 레이어 (ko+en, ADR-0010/0011)

전 라우트가 `src/app/[locale]/` 하위로 이전된다(라우팅 계층 변경, SDD/routing-and-components 재진입 배너·SDD/i18n). 번역 계층(카탈로그 조회)을 타는 것은 **UI 추(chrome) + 고정 도메인 어휘**뿐 — API 가변 canon 서술문(biography·effect·summary)은 계층을 우회해 원본 렌더(스코프 가드 AC-22). 로케일 상태 소유: URL 경로(`[locale]`) + `NEXT_LOCALE` 쿠키(지속) — 미들웨어가 감지·우선순위 집행(AC-21).

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

- **A-3. 클라이언트 경계 과다**: 목록 페이지 전체가 `"use client"` → RSC 이점 미활용. → C-S1, L-2.

## 종결된 구조 이슈

- ~~**A-1. 상태 소유 이원화**: `filterStore`(Zustand) 설계돼 있으나 페이지가 local `useState`로 필터를 들고 있어 store가 死코드에 가깝다.~~ **종결(2026-07-09, D-1 / ADR-0007)**: 필터 지속 상태를 URL searchParams(nuqs) 단일 소유로 이전하고 `filterStore.ts`를 삭제했다. C-S2 해소.
- ~~**A-2. 테마 전략 불일치**: next-themes는 `class` 전략인데 `globals.css`는 `@media (prefers-color-scheme)`로 변수를 바꾼다. 토글이 CSS 변수에 반영되지 않는 경로 존재. + `themeStore.ts` 빈 파일.~~ **종결(2026-07-09, D-2 / ADR-0008)**: `.dark` 클래스 + 시맨틱 토큰으로 기제를 일원화하고 `themeStore.ts`를 삭제했다. ADR-0006은 superseded.
- ~~**A-4. 이미지 호스트 화이트리스트 vs 실제 데이터**: `remotePatterns`와 PotterDB 반환 호스트 정합 미확인.~~ **종결(2026-07-09, D-3)**: PotterDB 이미지 호스트 실측 결과 현재 `remotePatterns`와 완전 정합. 코드 변경 불요.

## 확장 시 재진입 지점

새 엔티티 추가 = `types → lib/api → lib/hooks → components/features → app/route` 순으로 같은 슬라이스를 복제(수직 슬라이스 아키텍처). 새 기능(검색·즐겨찾기 등)은 이 문서를 재진입해 레이어 영향부터 판정한 뒤 SDD로 내린다.
