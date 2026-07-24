# decision-queue — 미결정 적재소

> 지금 당장 못 정하는 결정을 붙들지 않고 큐에 쌓는다. 결정 확정 시 **ADR로 승격하고 큐에서 삭제**한다
> — 이 승격 게이트가 있어야 큐가 비고 ADR이 는다. spec/architect가 적재, wrap-up이 정리.

---

<!-- D-1(필터 상태 소유 이원화)은 2026-07-09 파이프라인 1회전으로 해소·종결 → option (a) 변형 채택(URL searchParams 단일 소유 + nuqs 2.9.0 + 폴백 클로즈, 폴백 미발동), filterStore.ts 폐기로 C-S2·UX-2 동시 해소. ADR-0007 승격(gate3 휴먼 수용 완료). summary 참조. 큐에서 삭제됨. -->


<!-- D-2(테마 전략 정합)는 2026-07-09 파이프라인 1회전으로 해소·종결 → option (a) 채택, ADR-0008 승격(0006 supersede). summary 참조. 큐에서 삭제됨. -->

### D-3. 이미지 호스트 화이트리스트 vs PotterDB 실제 호스트
- **맥락**: `next.config.ts remotePatterns`는 `static.wikia.nocookie.net`·`www.wizardingworld.com`만 허용. PotterDB가 반환하는 실제 이미지 호스트와 정합 미확인(Constraints C-4, A-4).
- **필요 작업**: 실데이터의 이미지 호스트 수집 → 누락 시 remotePatterns 보강 or 이미지 프록시.
- **결정 시**: 설정 변경 + (프록시 도입이면) ADR.

<!-- D-4(베이스라인 gate2 lint 실패)는 2026-07-09 파이프라인 1회전으로 해소·종결 → summary 참조. 큐에서 삭제됨. -->

<!-- 새 미결정은 아래에 append. 확정되면 ADR 승격 후 이 항목 삭제. -->
