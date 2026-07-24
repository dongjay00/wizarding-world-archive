# decision-queue — 미결정 적재소

> 지금 당장 못 정하는 결정을 붙들지 않고 큐에 쌓는다. 결정 확정 시 **ADR로 승격하고 큐에서 삭제**한다
> — 이 승격 게이트가 있어야 큐가 비고 ADR이 는다. spec/architect가 적재, wrap-up이 정리.

---

### D-1. filterStore 채택 vs 폐기 (상태 소유 이원화)
- **맥락**: `lib/stores/filterStore.ts`가 설계돼 있으나 페이지는 local `useState` 사용. store가 死코드, 상태 이중화 위험(Constraints C-S2, ADR-0003, SDD/state-management).
- **선택지**: (a) store(또는 URL searchParams) 단일 소유로 페이지 리팩터 / (b) filterStore 폐기·local 상태 공식화.
- **영향**: UX-2(필터 공유·새로고침 소실)도 (a) 채택 시 함께 해소 가능.
- **결정 시**: ADR-0007로 승격.

### D-2. 테마 전략 정합 (next-themes class ↔ CSS prefers-color-scheme)
- **맥락**: 토글이 실제 색을 못 바꿈, `themeStore.ts` 빈 파일(ADR-0006, A-2, UX-1).
- **선택지**: (a) `globals.css`를 `.dark` 클래스 셀렉터로 전환해 토글 정상화 / (b) 다크 고정 공식화 + 토글·themeStore·next-themes 정리.
- **결정 시**: ADR-0006을 supersede하는 ADR-0008로 승격.

### D-3. 이미지 호스트 화이트리스트 vs PotterDB 실제 호스트
- **맥락**: `next.config.ts remotePatterns`는 `static.wikia.nocookie.net`·`www.wizardingworld.com`만 허용. PotterDB가 반환하는 실제 이미지 호스트와 정합 미확인(Constraints C-4, A-4).
- **필요 작업**: 실데이터의 이미지 호스트 수집 → 누락 시 remotePatterns 보강 or 이미지 프록시.
- **결정 시**: 설정 변경 + (프록시 도입이면) ADR.

### D-4. 베이스라인 gate2 lint 실패 (기존 부채)
- **맥락**: 거버넌스 부트스트랩 시 gate2 무장 실측에서 발견(session 2026-07-08). `Footer.tsx`가 내부 네비게이션에 `<a>`를 사용해 `@next/next/no-html-link-for-pages` **error 4건**(L37/45/53/61) → gate2 차단. tsc·build는 통과.
- **성격**: 하네스 결함이 아니라 앱의 pre-existing 부채. 게이트가 정상 작동해 잡아낸 것.
- **결정**: 기존 부채로 인정, 코드 불변. 별도 feature("Footer 내부 링크를 `next/link`로 교체 + Header 미사용 테마 훅 정리")로 파이프라인에 태워 해소.
- **부수**: lint 경고 7건 중 Header 테마 훅 미사용 5건은 **D-2(테마 결함)의 코드 증거** — D-2와 함께 처리 가능.
- **결정 시**: 코드 수정 feature 완료로 종결(ADR 불요, 단순 부채 상환).

<!-- 새 미결정은 아래에 append. 확정되면 ADR 승격 후 이 항목 삭제. -->
