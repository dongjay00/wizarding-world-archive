# summary — 사람용 요약

> **사람이 읽는 요약**. 이번 feature/세션에서 무엇을 왜 했는지, 완료 작업 이력(tasks에서 증류).
> 에이전트 제어흐름과 무관한 사람 대상 기록. wrap-up이 write.

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
