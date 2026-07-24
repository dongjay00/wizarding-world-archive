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

### L-4. Plan phase는 "부채상환" 유형엔 과하다 (파이프라인 1회전 관찰)
D-4 부채상환을 정식 파이프라인에 태워보니 spec/requirement/architect가 사실상 비어(신규 제품 WHY·아키텍처 없음), decision-queue 항목이 곧 스펙이었다. → 향후 START/AGENTS에 **feature 유형 분기**(product feature = 풀 파이프라인 / debt·chore = spec~architect 축약 경로) 도입 검토. 지금은 각 step을 skip/축약으로 기록해 흔적만 남김.

### L-5. §6 전이 트리거는 코드로 성립함이 실증됨
gate2를 Stop hook이 아니라 **`npm run gate2`로 경계에서 명시 호출**해 red→green 전이를 실측. 전이 트리거 모델이 실제로 동작. package.json 2-tier(`gate2` full / `gate2:fast` tsc+lint)가 §6의 값싼/비싼 계층을 그대로 구현. Stop hook은 이제 안전망 역할만.

### L-6. 게이트 통과 후에도 "범위 밖 잔여"는 별도로 판단하라
gate2는 error만 차단(warning 통과)이라, 4 error 해소로 green이 됐지만 warning 2건이 남았다. 게이트 green ≠ 완결. review/gate3에서 사람이 범위 확장 여부를 판단(이번엔 사용자가 warning 2건도 정리 선택).

### L-7. "기제 한 줄"로 보이는 테마 결함이 실제론 색 시스템 전면 마이그레이션이었다
D-2를 착수할 때 겉보기 결함은 "토글이 `.dark`를 못 봄" 한 줄. 그러나 architect 블라스트 반경 실측 결과 `dark:` 변형 0개 + 하드코딩 색 ~150 사이트(다크 전제). AC-9(양 테마 대비)를 진짜 만족하려면 시맨틱 토큰 레이어로 전면 재매핑 필요. **gate1 승인 스코프를 뒤집을 만큼 큰 발견이라 "스코프 재확인" 휴먼 체크를 삽입**했고 그게 값을 했다. → 교훈: brownfield에서 결함의 표면 크기 ≠ 실제 크기. architect가 blast radius를 **수치로** 재고 gate 승인 스코프와 다르면 되먹임하라. (L-4의 반례: product feature는 Plan/architect가 실질을 가진다.)

### L-8. 테마 색 전환의 시각 검증은 헤드리스로 CSS/런타임까지, 최종 오라클은 gate3 휴먼
verify가 헤드리스로 확인 가능한 최대치: 서버 200·시맨틱 유틸 emit·`:root`↔`.dark` 채널 변수·`dark:` 변형 셀렉터·next-themes 부팅 스크립트 존재. 확인 **불가**한 것: 클릭 시 실제 색 전환의 시각 인지. → 패턴: verify가 정적+스모크로 갭을 최대한 좁히고 **잔여 시각 갭을 gate3로 명시 위임**(session에 갭 기록). "테스트 러너 부재"(T-1)의 현실적 운영.

### L-9. 결정론 게이트도 flake와 진짜 실패를 구분해야 한다
gate2 full에서 `TurbopackInternalError: timeout`으로 build FAIL. 그러나 tsc·lint green + 코드 무변경 재실행 시 4.2s 성공 → 인프라 flake였다. **1회 재시도로 재현성 판정**해 코드 결함(같은 회차 lint set-state-in-effect)과 분리. 게이트 red를 무조건 코드 되감기로 보지 말고, 비결정 실패는 재현 확인 후 판정. (WSL2 Turbopack 동시 실행 시 관찰.)

<!-- 새 교훈은 아래에 append -->
