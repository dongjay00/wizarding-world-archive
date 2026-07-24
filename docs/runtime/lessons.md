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

### L-10. 방향 확정 브레인스토밍은 파이프라인 **진입 전**에 두고 session 핸드오프로 실어라
D-1은 사람과의 브레인스토밍으로 "URL 단일 소유 + nuqs + 폴백 클로즈"를 파이프라인 진입 **전에** 확정하고, 그 확정분을 session.md 핸드오프에 슬라이스별(WHY+큐 / AC / ADR·SDD·tasks)로 실었다. 각 step은 자기 권한 문서에 자기 슬라이스만 옮겨(spec=WHY, requirement=AC, architect=ADR/SDD/tasks) 재발명 없이 진행. → product feature에서 architect가 실질을 갖는다는 L-4 경로의 실증 연장. 방향이 큰 결정은 파이프라인 안에서 흔드는 대신 **진입 전 사람과 닫고 파일로 핸드오프**하면 step 간 표류가 준다.

### L-11. 신규 외부 의존성 도입은 ADR + 폴백 클로즈 + gate2/gate3 안전망으로 흡수하라
첫 신규 런타임 의존성(nuqs) 도입을 ADR-0007에 폴백 클로즈(자작 `useFilterParams`)와 함께 명문화했다 — 트리거(Next 16 어댑터 감지 #1263, React Compiler 상호작용)와 "설계 shape 불변이라 폴백 비용 낮음"을 미리 계약. 실제로는 2.9.0에서 이슈 해소돼 **폴백 미발동**했으나, 외부 라이브러리 리스크를 gate2(build)/gate3(스모크)가 잡는 그물로 흡수하는 구조를 세워둔 것이 값. 러너 부재(T-1)에서 자작 직렬화보다 battle-tested 라이브러리를 1순위로(L-3 정신), 자작은 2차 폴백으로 강등. → 신규 의존성은 "채택 + 폴백 조건 + 어느 게이트가 잡는가"를 ADR에 함께 박아라.

### L-12. blast radius는 확정분과 어긋나므로 architect가 수치로 재고 config로 흡수하라 (L-7 재확인)
브레인스토밍 확정분의 blast radius가 실측과 3건 어긋났다: (1) 소스가 `src/` 프리픽스 하위(확정분은 `app/`·`lib/`로 누락), (2) movies 차원이 나머지와 상이(`title_cont`·`release_date`·pageSize 12 vs `name_cont`·`name`·24), (3) `useSearchParams` Suspense 경계가 신규로 필요. architect가 이를 수치로 재고 **공용 팩토리를 config로 파라미터화**해 4x 중복 없이 차이를 흡수, tasks에 반영. → brownfield에서 "표면 크기 ≠ 실제 크기"(L-7)는 debt뿐 아니라 product feature의 blast radius 확정분에도 성립. 확정분을 신뢰하되 architect가 실측으로 교정한다.

### L-13. 부산물로 필요해진 경계는 원래 스코프를 확대하지 말고 격리 판정하라
nuqs `useSearchParams`가 App Router에서 Suspense 경계를 요구해 4페이지 콘텐츠를 `<Suspense>`로 감쌌다. 이는 겉보기엔 RSC 경계 개선(L-2: 페이지 use client 축소)처럼 보이나 **실제로는 nuqs 배선의 부산물**이다. 페이지 최상단 `"use client"`는 유지하고 L-2 스코프 확대가 아님을 Constraints C-S6 note로 격리 기록. → 한 feature가 부산물로 다른 부채 영역을 건드릴 때, 그 부채의 스코프를 슬며시 확대하지 말고 "이건 배선 부산물, 그 부채는 별건"으로 명시 격리하라(스코프 크리프 방지).

<!-- 새 교훈은 아래에 append -->
