# ADR-0007 — 필터 상태 소유: URL(searchParams) 단일화 + nuqs 채택

- **status**: accepted
- **date**: 2026-07-09
- **근거**: decision-queue D-1 (option (a) 변형), PRD AC-11~13, UIUX UX-2, Constraints C-S2, ADR-0003(underutilized)
- **관계**: ADR-0003(Zustand global UI state)이 상정한 `filterStore` 실사용을 **폐기**로 확정(supersede 아님 — 0003의 Zustand 채택 자체는 유효, 필터 상태의 소유처만 URL로 이전). 死코드 `filterStore.ts` 제거.

## Context

필터 상태의 **소유가 이원화**돼 있다(A-1, L-1):

- **설계**: `src/lib/stores/filterStore.ts`(Zustand) — `searchQuery/selectedHouse/selectedCategory/sortBy/currentPage` + "변경 시 page=1 리셋" 규칙까지 갖춤.
- **현실**: 4개 목록 페이지(`characters/spells/potions/movies`)가 store를 **쓰지 않고** 각자 local `useState`로 동일 상태를 든다. grep 실측 결과 `filterStore` **소비자 0**(정의 라인만 매치).

두 문제가 같은 뿌리에서 나온다 — 필터 상태의 **단일 소유처가 없다**:
1. store는 소비자 0의 **死코드**이자 "상태 이중화"(C-S2 위반) 리스크.
2. 필터·검색·페이지가 URL에 없어 **새로고침·북마크·공유 링크 시 소실**(UX-2).

## Decision

1. **필터 상태의 단일 소유처 = URL searchParams.** 지속되는(persistent) 검색어·필터 선택·현재 페이지는 URL 쿼리 파라미터가 유일 진실원(single source of truth)이다. 페이지 컴포넌트는 이 상태를 URL과 경쟁하는 별도 지속 상태로 **이중 보유하지 않는다**. → C-S2·UX-2 동시 해소.
2. **기제 = nuqs `useQueryStates`.** 필터 차원별 파서(`parseAsString`/`parseAsInteger`)를 묶어 URL↔상태를 타입 안전하게 양방향 바인딩. root에 `<NuqsAdapter>`(`nuqs/adapters/next/app`)를 배선하고 `package.json`에 `nuqs`를 추가.
   - **근거**: L-3(미묘한 직렬화·인코딩 규칙은 사람이 검증하기 어렵다 → battle-tested 라이브러리로 대체) + T-1(테스트 러너 부재 상황에서 자작 직렬화 코드보다 검증된 라이브러리가 회귀 리스크 낮음).
3. **공통 규칙(공용 팩토리로 중앙화, SDD/state-management에 구체화):**
   - `clearOnDefault: true` — 기본값(빈 `q`·미선택 필터·`page=1`)은 URL 파라미터 **미부착**(깨끗한 URL). → AC-13.
   - 필터·검색 변경 시 `page`를 **1로 리셋**(기존 filterStore 규칙 계승). → AC-13.
   - URL 갱신은 `history: 'replace'` — 키 입력마다 히스토리 오염 방지.
   - 검색 입력: 즉각 반응을 위해 입력 텍스트 **순간값은 컴포넌트 local view 상태**로 두고, 디바운스 후 URL `q`에 커밋. URL이 유일 지속 출처이므로 **C-S2 위반 아님**(지속 상태 이중화가 아니라 transient view-state 미러).
4. **`filterStore.ts` 삭제.** 필터 상태 소유는 URL 단일. (SDD/state-management 반영.)

## 폴백 클로즈 (fallback close)

nuqs가 gate2(build)/gate3(스모크)에서 깨지면 → **자작 `useFilterParams` 훅**(`useSearchParams` + `router.replace` 직접)으로 폴백한다. 트리거:
- Next 16 어댑터 감지 이슈(#1263, nuqs 2.8.5 기준·2.9.0에서 해소 추정)로 `<NuqsAdapter>`가 App Router를 못 잡는 경우.
- React Compiler(on)와 nuqs의 상호작용이 build 또는 런타임 스모크에서 깨지는 경우.

**폴백 비용이 낮은 이유**: 설계 shape(URL 단일 소유·`page=1` 리셋·`clearOnDefault`·`history:'replace'`·검색 디바운스·local view 미러)가 기제와 **무관하게 동일**하다. 폴백은 훅 **내부 구현만** 교체하고 페이지·SDD 계약은 불변. (nuqs는 2.8.9에서 Next 16.2.0 대상 테스트됨. 우리 앱은 Next 16.0.10.)

## Consequences

- **양성**: 필터·검색·페이지가 URL에 표현돼 새로고침·북마크·공유 시 복원(UX-2 해소, AC-11). 지속 상태 소유가 URL 단일화되고 死코드 `filterStore.ts` 제거(C-S2 해소, AC-12). 깨끗한 URL·page 리셋 규칙 배선(AC-13).
- **음성/비용**: 신규 런타임 의존성 `nuqs` 도입(첫 신규 의존성 product feature). `useSearchParams` 계열은 App Router에서 **Suspense 경계**를 요구하므로 목록 페이지에 경계 추가가 필요할 수 있음(build 시 표면화 가능) — L-2 스코프 확대는 아니고 배선 흔적만.
- **회귀 위험**: 페이지별 필터 차원(특히 movies=`title_cont`·`release_date`·pageSize 12 vs 나머지 `name_cont`·`name`·24)을 잘못 매핑하면 목록이 조용히 깨짐 → 공용 팩토리를 config로 파라미터화하고 verify에서 스모크. 최종 시각 복원(AC-11/13)은 gate3 휴먼 위임(L-8 계승).
- **Constraints**: C-S2 위반이 이 feature로 해소됨. "필터 지속 상태는 URL이 소유"를 soft 항목으로 seed 검토(Constraints 반영).

## Alternatives rejected

- **자작 `useFilterParams` 훅을 1순위로**: 직렬화·기본값 생략·throttle 규칙을 손으로 구현 → L-3가 경고한 "미묘한 규칙, 검증 어려움"에 정면으로 부딪힘. 러너 부재(T-1)라 회귀를 잡을 그물도 없음. → 폴백(2차)으로 강등.
- **filterStore(Zustand) 채택**: store 단일 소유로 페이지 리팩터. C-S2는 풀리나 **URL 지속(UX-2)을 못 푼다** — 두 문제 중 하나만 해결. 별도로 URL 동기화 레이어를 또 얹어야 함. → 기각.
- **filterStore 폐기 + local `useState` 공식화(option (b))**: 死코드는 지우지만 UX-2 미해결·상태가 여전히 URL 밖. → 기각.

## Finalization (wrap-up, 2026-07-09)

이 ADR은 `accepted` 상태로 **최종 확정**됐다. 사람 승인 경로: (1) 파이프라인 진입 전 휴먼 브레인스토밍으로 방향 확정(URL 단일 소유 + nuqs + 폴백 클로즈, session.md 핸드오프), (2) gate1 휴먼 승인, (3) gate3 휴먼 수용 완료(4페이지 시각 복원·URL 문자열 관찰). 구현 결과: nuqs **2.9.0** 채택(#1263 해소 버전), `<NuqsAdapter>` 1곳 배선(`src/app/providers.tsx`), 공용 팩토리 `useListFilters` 도입, `filterStore.ts` 삭제(grep 소비자 0). **폴백 클로즈 미발동**(nuqs 정상 동작, Next 16.0.10 / React Compiler on 환경에서 gate2 3종 green). decision-queue D-1 종결, C-S2 해소·C-S6 배선 확인. (append-only — 상단 결정 본문 불변.)
