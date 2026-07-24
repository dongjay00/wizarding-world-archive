# decision-queue — 미결정 적재소

> 지금 당장 못 정하는 결정을 붙들지 않고 큐에 쌓는다. 결정 확정 시 **ADR로 승격하고 큐에서 삭제**한다
> — 이 승격 게이트가 있어야 큐가 비고 ADR이 는다. spec/architect가 적재, wrap-up이 정리.

---

<!-- D-1(필터 상태 소유 이원화)은 2026-07-09 파이프라인 1회전으로 해소·종결 → option (a) 변형 채택(URL searchParams 단일 소유 + nuqs 2.9.0 + 폴백 클로즈, 폴백 미발동), filterStore.ts 폐기로 C-S2·UX-2 동시 해소. ADR-0007 승격(gate3 휴먼 수용 완료). summary 참조. 큐에서 삭제됨. -->


<!-- D-2(테마 전략 정합)는 2026-07-09 파이프라인 1회전으로 해소·종결 → option (a) 채택, ADR-0008 승격(0006 supersede). summary 참조. 큐에서 삭제됨. -->

<!-- D-3(이미지 호스트 화이트리스트 vs PotterDB 실제 호스트)는 2026-07-09 실측으로 해소·종결 → 실데이터 수집 결과 실호스트 2개(static.wikia.nocookie.net /harrypotter/images/**, www.wizardingworld.com)가 현재 remotePatterns와 완전 정합. 신규 호스트·프록시 불요 → 코드 무변경 종결(프록시 미도입이라 ADR 불요). Constraints C-4 note 정합 확인 갱신, summary·lessons(L-14) 참조. 큐에서 삭제됨. -->

<!-- D-4(베이스라인 gate2 lint 실패)는 2026-07-09 파이프라인 1회전으로 해소·종결 → summary 참조. 큐에서 삭제됨. -->

<!-- D-6(i18n 라이브러리·기제)은 2026-07-13 i18n 파이프라인 완주로 해소·종결 → next-intl 확정, ADR-0010 승격(대안 next-i18next·자작 경량 기각 기록). gate2 build·gate3 스모크로 신규 의존성 리스크 통과. summary 참조. 큐에서 삭제됨. -->

<!-- D-7(메시지 카탈로그 네임스페이스 구조)은 2026-07-13 해소·종결 → SDD/i18n §4 확정(평면 top-level: common/nav/home/footer/엔티티별/domain/switcher, domain ko=Domain.md R-6 복제, 3번째 언어=배열+카탈로그 추가로 개방). 키 대칭 en↔ko 179=179 실측. summary 참조. 큐에서 삭제됨. -->

<!-- D-8(도메인 어휘 ko 표기 표준을 Domain.md에 확정할지)은 2026-07-13 해소·종결 → requirement가 Domain.md 「도메인 어휘 ko 표기 표준」(R-6)으로 확정(gate1 freeze), 카탈로그는 복제·정합(C-S8·L-19). API 종속 필터 어휘(R-5)는 표준 밖 영문 유지. summary·lessons(L-19) 참조. 큐에서 삭제됨. -->

<!-- D-9(locale 프리픽스 정책 as-needed vs always)은 2026-07-13 해소·종결 → as-needed 확정, ADR-0011 승격(en 무프리픽스로 기존 URL·AC-13 정신 보존, always=churn·never=AC-20 위반 기각). summary·lessons(L-20) 참조. 큐에서 삭제됨. -->

<!-- 새 미결정은 아래에 append. 확정되면 ADR 승격 후 이 항목 삭제. -->

## D-10. Next 16 `middleware.ts` → `proxy` 파일 컨벤션 이전 (debt)
- **맥락**: i18n feature에서 `src/middleware.ts`(=`createMiddleware(routing)`)를 배선했는데, `next build` 시 Next 16이 **`middleware.ts` 파일 컨벤션을 `proxy`로 rename 예고**하는 deprecation advisory 1건이 출력된다(2026-07-13 gate2 full 로그). 현재 **build 비차단**(gate2 exit 0), 런타임 거동 정상.
- **결정할 것**: Next 컨벤션이 실제로 `middleware.ts`를 제거/강제할 시점에 `proxy` 파일 컨벤션으로 이전할지·시점. next-intl `createMiddleware`가 새 컨벤션을 어떻게 노출하는지(라이브러리 대응 버전 대기) 확인 후 이전.
- **소유/시점**: 향후 debt feature(Next 메이저 업그레이드 회전에 편승 가능). 지금은 무해 — 착수 불요, 관찰만.
- **유형**: debt. blast-radius=파일 1개(`src/middleware.ts`) + next-intl 버전 정합. 계약·거동 불변(파일 컨벤션 rename뿐).
