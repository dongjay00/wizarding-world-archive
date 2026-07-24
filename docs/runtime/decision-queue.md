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

<!-- D-4(베이스라인 gate2 lint 실패)는 2026-07-09 파이프라인 1회전으로 해소·종결 → summary 참조. 큐에서 삭제됨. -->

<!-- 새 미결정은 아래에 append. 확정되면 ADR 승격 후 이 항목 삭제. -->
