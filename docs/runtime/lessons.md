# lessons — 세션 초월 교훈 (append-only)

> **세션을 넘어 축적되는 교훈**. 반복 실패·패턴을 증류해 다음 세션의 Plan이 참고.
> 반복 위반이 도구화 가능해지면 Constraints의 hard 항목으로 승격되는 후보. wrap-up이 write.
> append-only — 기존 항목 수정하지 않고 새 항목 추가.

---

### L-1. 완성 앱 역복원 시 "설계 의도 ≠ 실제 코드" 를 분리 기록하라
거버넌스 부트스트랩 중, 설계된 것(filterStore, themeStore)과 실제 쓰이는 것이 어긋나는 지점이 반복 발견됨. State 문서는 "의도"가 아니라 **현실**을 적고, 괴리는 decision-queue로 보낸다. (근거: D-1, D-2)

### L-2. `"use client"` 기본값화 경향
목록/상세 페이지가 관성적으로 전부 클라이언트 컴포넌트가 됨(필터·모션 때문). RSC 경계 최소화(Constraints C-S1)가 관례로 지켜지지 않음. 반복되면 "페이지 최상단 use client 금지, 상호작용은 잎으로" 를 lint 규칙화해 hard 승격 후보.

### L-3. 외부 API 클라이언트의 미묘한 인코딩 규칙은 반드시 오라클로 고정하라
`buildQueryString`의 대괄호 비인코딩은 사람이 읽고 검증하기 어렵다. 테스트 러너 도입 시 이 함수가 1순위 단위 테스트(TestStrategy) — 회귀 시 전 목록 API가 조용히 깨진다.

<!-- 새 교훈은 아래에 append -->
