# ADR-0008 — 테마 기제 교정: `.dark` 클래스 + 시맨틱 색 토큰

- **status**: accepted
- **date**: 2026-07-09
- **supersedes**: ADR-0006 (Theming via next-themes with known defect)
- **근거**: decision-queue D-2 (option (a)), PRD AC-8~10, UIUX UX-1, Architecture A-2

## Context

ADR-0006이 기록한 결함: next-themes는 `<html>`에 `.dark` **클래스**를 붙이는데 `globals.css`는 `@media (prefers-color-scheme: dark)`로 색을 바꿔 **둘이 서로를 보지 않아** 토글이 무력했다. 채택 후 실측으로 결함이 더 드러남:

- **이중 래핑**: `layout.tsx`와 `providers.tsx`가 `<ThemeProvider>`를 **두 번** 감쌈.
- **하드코딩 다크**: `layout.tsx`의 루트 div가 `from-slate-950…text-white`로 화면을 덮어 테마와 무관하게 항상 다크.
- **`themeStore.ts` 빈 파일**: next-themes와 개념 이중화만 남긴 死코드.
- **다크 전제 색 ~150 사이트**: `text-gray-400`×73·`text-gray-300`×16·`text-white`×16·`bg-white/10`×18 등. `dark:` 변형은 0개(다크모드 인프라 부재).

D-2를 **option (a)**(토글 정상화)로 해소하기로 사용자가 결정 → 진짜 동작하는 라이트/다크 전환이 목표.

## Decision

1. **단일 기제 = next-themes `.dark` 클래스.** `providers.tsx`의 `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>` **하나만** 유지. `layout.tsx`의 중복 `<ThemeProvider>` 제거. 2-state 토글(light↔dark), 선택은 next-themes가 localStorage에 지속.
2. **시맨틱 색 토큰 레이어.** `globals.css`에 switchable 원시 채널 변수를 `:root`(라이트)·`.dark`(다크)로 정의하고, `@theme`에서 이를 참조하는 시맨틱 색 유틸을 생성:
   - `text-content` (본문), `text-muted` (2차), `text-subtle` (3차)
   - `bg-surface` (채움 표면; 채널이 다크=흰색/라이트=검정으로 뒤집혀 양쪽에서 은은한 대비)
   - `.glass`/`.glass-dark`/스크롤바도 switchable 변수 기반으로 전환.
   - amber 강조색(`amber-400/500`)·하우스 색은 양 테마 공용으로 **유지**(literal).
3. **하드코딩 색 → 토큰 치환.** `@media prefers-color-scheme` 이원화 제거. `text-white/gray-*`, `bg-white/*` 하드코딩 사이트를 위 시맨틱 유틸로 패턴 일괄 치환.
4. **`themeStore.ts` 삭제.** 테마 상태 소유는 next-themes 단일. (SDD/state-management 반영.)

## Consequences

- **양성**: 토글이 실제 색을 전환(AC-8). 양 테마 대비 정상(AC-9). 기제 단일화(AC-10). 향후 테마 추가/조정이 토큰 한 곳(globals.css)에서 가능.
- **음성/비용**: ~150 색 사이트 치환으로 diff가 큼(≈15파일). 라이트 팔레트는 *기능적·정합적* 수준(바스포크 리디자인 아님, PRD 스코프).
- **회귀 위험**: 치환 과정에서 amber/하우스 색을 잘못 건드리거나 대비가 무너질 수 있음 → verify(behavioral)에서 양 테마 스모크로 확인.
- **Constraints**: C-S3(디자인 토큰 사용)이 이 feature로 실질 강화됨 → soft C-S5 seed(색은 시맨틱 토큰 경유) 후보.

## Alternatives rejected

- **(b) 다크 고정 공식화**: 사용자가 option (a) 선택으로 기각(라이트 모드 제공 원함).
- **사이트별 `dark:` 변형 추가(~150곳에 `dark:` prefix)**: 토큰 레이어보다 diff가 더 크고 중앙화 이점 없음 → 기각.
- **`@media prefers-color-scheme` 유지 + 토글 제거**: (b)와 동치, 기각.
