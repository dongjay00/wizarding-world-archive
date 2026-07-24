# ADR-0006 — Theming via next-themes (with known defect)

- **status**: accepted with **known defect** (frozen 사실 기록 / 수정은 D-2)
- **date**: retro

## Context
다크/라이트 테마 전환을 제공하려 함(UIUX). 다크 우선 디자인.

## Decision
**next-themes**를 `attribute="class"`, `defaultTheme="dark"`, `enableSystem`으로 채택(providers.tsx). 별도 `themeStore.ts`(Zustand) 파일도 생성.

## Consequences / Defect (⚠)
- **결함**: next-themes는 `class` 전략(html에 `.dark` 등 클래스 부착)인데, `globals.css`는 색 변수를 `@media (prefers-color-scheme: dark)`로 바꾼다. **토글이 CSS 변수에 반영되지 않는다** → 사실상 다크 고정(UIUX UX-1, Architecture A-2).
- `themeStore.ts`는 **빈 파일**로 남아 next-themes와 이중 개념만 남김.
- **수정 방향**(→ decision-queue **D-2**): (a) `globals.css`를 `.dark` 클래스 셀렉터 기반으로 전환하거나, (b) 다크 고정을 공식화하고 토글·themeStore·next-themes를 정리.

## Alternatives rejected
- 자체 테마 컨텍스트: next-themes가 FOUC·SSR 처리를 이미 제공.
