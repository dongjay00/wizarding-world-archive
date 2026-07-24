# summary — 사람용 요약

> **사람이 읽는 요약**. 이번 feature/세션에서 무엇을 왜 했는지, 완료 작업 이력(tasks에서 증류).
> 에이전트 제어흐름과 무관한 사람 대상 기록. wrap-up이 write.

---

## D-5 로컬 즐겨찾기 — 서버 없는 개인 저장 표면 추가 (2026-07-09)

- **무엇**: 5종 엔티티(Character·Spell·Potion·Movie·Book)에 로컬 즐겨찾기를 추가. 목록 카드와 상세 페이지에서 하트 토글로 저장/해제하고, Header의 Favorites 네비와 `/favorites` 집계 페이지에서 저장 항목을 모아본다.
  - 상태 소유 = `src/lib/stores/favoritesStore.ts`의 Zustand persist(localStorage). 저장 값은 `type/id/title/subtitle/image/href/savedAt` 최소 메타데이터.
  - 공용 `FavoriteToggleButton`, `FavoriteCard`, 엔티티별 favorite 메타 팩토리(`lib/utils/favorites.ts`)를 추가.
  - 기존 카드의 전체 `Link` 래핑은 카드 루트 + 링크 + 독립 하트 버튼 구조로 조정해 버튼 클릭과 상세 이동이 충돌하지 않게 했다.
- **왜**: 로그인·서버 쓰기 없이도 같은 브라우저에서 다시 보고 싶은 항목을 빠르게 재방문할 수 있게 하기 위해. PRD의 향후 후보였던 “즐겨찾기(로컬)”를 D-5로 활성화.
- **결과**: ADR-0009 accepted. PRD AC-14~16, UIUX U-8~9, SDD/state-management 반영. `npm run gate2` green(tsc·lint·build). 프로덕션 서버 스모크(`/favorites`·`/characters` 200)와 Playwright localStorage 수화/표시/해제 스모크 pass. 브라우저별 동기화·서버 저장은 비목표로 유지.

---

## D-3 이미지 호스트 화이트리스트 정합 — 실측으로 무변경 종결 (2026-07-09)

- **무엇**: decision-queue D-3(“`next.config.ts remotePatterns`와 PotterDB 실제 이미지 호스트 정합 미확인”)을 **실측**으로 해소. PotterDB 전 엔티티(characters·spells·potions·movies·books) 이미지 필드를 API에서 대량 수집해 실제 호스트를 전수 확인.
- **왜**: 미등재 호스트는 `next/image` 런타임에서 터지는 hard 제약(C-4)인데, 데이터-의존이라 build가 못 잡는 갭. 스코프를 수치로 확정해야 “보강 vs 프록시”를 정할 수 있었다(L-7/L-12).
- **결과**: 실호스트는 **2개뿐**이며 현재 등재와 **완전 정합** — characters/spells/potions `image`=`static.wikia.nocookie.net`(경로 `/harrypotter/images/**`, 221샘플 0 불일치), movies `poster`·books `cover`=`www.wizardingworld.com`. 신규 호스트·프록시 불요 → **코드 무변경 종결**(프록시 미도입이라 ADR 불요). `www.wizardingworld.com`의 `/**` 광역 허용은 CDN 경로 변경 대비 의도적 유지(하드닝 보류, 휴먼 게이트 선택). Constraints C-4 note를 “정합 확인”으로 갱신, decision-queue D-3 삭제. **D-3 종결 → 미결정 큐 0.**
- **배운 것**: L-14(실측이 부채를 dissolve — “표면 크기 ≠ 실제 크기”(L-7)는 과대뿐 아니라 **과소**로도 성립: 실측 결과 손댈 게 없을 수 있고, 그 확인 자체가 산출물).

---

## D-1 필터 상태 소유 일원화 — 첫 신규 의존성 도입 product-feature 1회전 (2026-07-09)

- **무엇**: decision-queue D-1을 **option (a) 변형**(URL searchParams 단일 소유)으로 해소. 목록 4페이지의 검색어·필터·페이지 상태를 URL이 유일하게 소유하도록 이전하고, 死코드 `filterStore.ts`를 폐기.
  - 기제 = **nuqs 2.9.0** 채택(`useQueryStates`). `<NuqsAdapter>`를 `src/app/providers.tsx` 1곳에 배선.
  - 공용 팩토리 훅 `src/lib/hooks/useListFilters.ts` 신규 — config로 페이지별 차원 파라미터화, 공통 규칙 4종(clearOnDefault·page=1 리셋·history:replace·검색 300ms 디바운스+local view 미러) 중앙화. 4페이지의 local `useState`/`setCurrentPage(1)` 제거 → 훅 치환.
  - movies 차원 특이(⚠ `title_cont`·`release_date`·pageSize 12 vs 나머지 `name_cont`·`name`·24)를 config로 흡수.
  - `filterStore.ts` 삭제(grep 소비자 0). nuqs `useSearchParams` Suspense 요구가 build에서 표면화 → 4페이지 콘텐츠를 `<Suspense fallback={FullPageLoader}>`로 감쌈(최상단 `"use client"` 유지, L-2 스코프 확대 아님).
- **왜**: 필터 상태 소유가 이원화(설계된 filterStore는 死코드, 실제는 local useState)돼 C-S2(상태 이중화)를 위반하고, 필터·검색·페이지가 URL 밖이라 새로고침·공유 시 소실(UX-2)되던 두 결함을 **같은 뿌리(단일 소유처 부재)**에서 동시 해소하기 위해. 하네스로 **첫 신규 런타임 의존성 도입 + 상태 아키텍처 변경** product feature를 완주 검증.
- **결과**: gate1(휴먼)·gate2(tsc·lint·build 3종 green, 4목록 static prerender)·gate3(휴먼 시각 수용: 4페이지 URL 복원·문자열 관찰) 3게이트 통과. **폴백 클로즈(자작 useFilterParams) 미발동**(nuqs 2.9.0에서 #1263 해소, Next 16.0.10/React Compiler on 환경 정상). ADR-0007 승격(accepted 최종 확정). C-S2 해소·C-S6 배선 확인. UX-2 구현 완료(gate3 수용). **D-1 종결.**
  - ✅ **UIUX UX-2 문구 정합 완료(2026-07-09 후속 확인)**: 이 플래그는 wrap-up 시점 가정("UIUX가 아직 '구현 대기'")에 근거했으나, 실제 `UIUX.md`는 architect의 D-1 재진입에서 이미 UX-2를 "해소(ADR-0007 → U-7)·구현 종결"로 갱신하고 U-7 수용기준을 추가한 상태였다(재진입 로그·라인 56·61). 즉 문서는 이미 현실과 일치(L-1) — 별도 갱신 불요. stale 플래그였음을 여기 정리.
- **배운 것**: L-10(방향 확정 브레인스토밍을 파이프라인 진입 전에 두고 session 핸드오프로 실음), L-11(신규 의존성=ADR+폴백 클로즈+게이트 안전망으로 흡수), L-12(blast radius 확정분≠실측 3건, config 파라미터화로 흡수, L-7 재확인), L-13(부산물 Suspense 경계를 L-2 스코프 확대 아님으로 격리).

---

## 거버넌스 부트스트랩 (2026-07-08)

- **무엇**: START.md(frontend team governance) 설계를 이 저장소에 역복원 방식으로 구축.
- **왜**: 완성된 실앱에 하네스를 입혔을 때 성립하는지 검증하는 기준 앱으로 삼기 위해.
- **결과**: `docs/state`(PRD·Domain·Architecture·SDD×3·ADR×6·UIUX·TestStrategy·Constraints) 역복원, `docs/runtime` seed, `AGENTS.md`(중립 파이프라인 스펙) + `.claude` 어댑터(agents·hooks) 구축.
- **다음**: 실제 feature 1건을 파이프라인에 태워 한 바퀴 검증(별도 세션).

---

## D-4 부채상환 — 파이프라인 정식 1회전 (2026-07-09)

- **무엇**: 하네스의 첫 정식 파이프라인 1회전(spec→wrap-up). feature = D-4 부채상환.
  - Footer.tsx 내부 링크 4건 `<a>`→`<Link>` (외부 링크 유지)
  - Header.tsx 죽은 테마 토글 잔재 제거
  - 범위 밖 lint warning 2건(Briefcase·SpellCard Sparkles)도 gate3에서 사람 판단으로 정리
  - §6 전이 트리거 코드화: package.json `gate2`/`gate2:fast`
- **왜**: gate2를 막던 pre-existing lint 4 error를 해소하고, 동시에 파이프라인·게이트·§6 전이 트리거가 실제로 도는지 검증하려고.
- **결과**: gate2 red→green 실측(전이 트리거 `npm run gate2` 명시 호출). 최종 lint 0 errors·0 warnings. 행위 회귀 없음. **D-4 종결**(단순 부채 상환, ADR 불요).
- **배운 것**: L-4(Plan이 debt엔 과함 → feature 유형 분기 검토), L-5(§6 전이 트리거 코드 성립), L-6(게이트 green ≠ 완결).

---

## D-2 테마 토글 정상화 — 첫 product-feature 파이프라인 1회전 (2026-07-09)

- **무엇**: decision-queue D-2를 **option (a)**(토글 정상화)로 해소. 다크/라이트 토글이 실제 색을 전환하도록 테마 기제를 교정하고 라이트 팔레트를 도입.
  - 기제 일원화: next-themes `.dark` 클래스 단일 소스 + Tailwind `@custom-variant dark`. `@media prefers-color-scheme` 이원화 제거, ThemeProvider 이중 래핑 제거, 빈 `themeStore.ts` 삭제.
  - 시맨틱 색 토큰 레이어(`globals.css`): `:root`(라이트)/`.dark`(다크) 채널 변수 → `@theme` 유틸(`text-content`/`muted`/`subtle`, `bg-surface`), `.glass`/`.glass-dark`/스크롤바 변수화.
  - 색 ~150 사이트 치환. **히어로 이미지 스크림 오버레이 텍스트·컬러 버튼/뱃지·이미지 placeholder 아이콘은 리터럴 흰색 유지**(대비 보존). amber 강조·하우스 색 공용 유지.
  - `ThemeToggle.tsx`: next-themes `setTheme` + CSS `dark:` 아이콘 전환(effect/state 없음 → 하이드레이션 안전).
- **왜**: 토글 어포던스가 있으나 색을 못 바꿔(사실상 다크 고정) 신뢰를 해치던 UX-1 결함 해소. 동시에 하네스를 **debt가 아닌 실제 product feature로 처음 완주** 검증(D-4는 순수 부채였음).
- **결과**: gate1(휴먼)·gate2(tsc·lint·build green)·gate3(휴먼 시각 수용) 3게이트 통과. ADR-0008 승격(ADR-0006 supersede). UIUX U-6 추가·UX-1 종결. **D-2 종결.**
- **배운 것**: L-7(결함 표면크기≠실제크기, blast radius 수치 실측→스코프 재확인 게이트), L-8(시각검증 헤드리스 한계→gate3 위임), L-9(결정론 게이트도 flake/실패 구분).

---

_(이후 feature별 요약을 위에 append)_
