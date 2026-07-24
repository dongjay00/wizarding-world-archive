# SDD — Routing & Component Structure

> status: **frozen**. 상위: Architecture, UIUX.
>
> **재진입 2026-07-10 (i18n, ADR-0010/0011 · draft `SDD/i18n.md`)**: i18n(ko+en) 도입으로 아래 라우트 트리 전체(`app/{page,characters,spells,potions,movies,books,favorites}` 12 page.tsx)가 **`src/app/[locale]/` 하위로 이전**된다. 루트 `layout.tsx`의 `<html lang>`이 동적화되고 `NextIntlClientProvider`가 배치된다. 기존 `next/link`·`usePathname` 직수입처는 로케일 인지 래퍼(`@/i18n/navigation`)로 치환된다. **본 문서 §라우팅 본문의 슬라이스 구조·컴포넌트 계층 계약 자체는 불변**(파일 위치만 `[locale]` 하위로 이동, 컴포넌트 방향·의존 규칙 유지). 상세 배선은 `SDD/i18n.md` 참조. (append-only 재진입 배너 — 아래 frozen 본문 수정 없음.)

## 라우팅 (App Router)

엔티티마다 동일한 2라우트 슬라이스:

```
app/
  page.tsx                 홈
  {entity}/page.tsx        목록 (characters/spells/potions/movies/books)
  {entity}/[id]/page.tsx   상세
  layout.tsx               전역(Header/Footer/Providers/ThemeProvider)
  providers.tsx            QueryClientProvider + next-themes
  globals.css              Tailwind v4 @theme + 유틸
```

- 목록·상세 페이지는 현재 전부 `"use client"`(필터·모션·훅 사용). → Constraints C-S1(서버 경계 최소화 soft 위반), lessons L-2.
- 동적 라우트 파라미터 `[id]`는 PotterDB `id`(UUID).

## 컴포넌트 계층

```
components/
  layout/    Header, Footer               (전역 크롬)
  features/  {Entity}Card                  (도메인 인지 카드 5종)
  shared/    Pagination                    (도메인 무지, 재사용)
  ui/        LoadingSpinner(=FullPageLoader/ErrorMessage)   (프리미티브)
```

- 방향: `app/{entity}/page` → `features/{Entity}Card` + `shared/Pagination` + `ui/*`.
- `features/*Card`는 `types/potter.ts`와 `HOUSE_COLORS`(constants)만 의존.
- 재사용 조각(`shared/ui`)은 도메인 타입을 모른다(props로만 받음).

## 신규 엔티티/페이지 추가 절차 (수직 슬라이스)

`types` → `lib/api` (*API) → `lib/hooks` (use*) → `components/features/*Card` → `app/{entity}/page + [id]` 순 복제. 목록 페이지는 기존(예: characters)을 패턴 템플릿으로 삼되 상태 관리는 SDD/state-management의 현행 관례(local useState)를 따른다.

## 표현 규약

- 이미지: `next/image` + `remotePatterns` 등재 호스트만(Constraints C-4). fallback = Sparkles/플레이스홀더.
- 그리드: `grid-cols-1 sm:2 lg:3 xl:4 gap-6`(UIUX U-4).
- 상태 3분기(loading/error/empty)를 페이지마다 명시(UIUX U-1).
