# session — work-state 원장

> **이번 세션의 work-state 원장**. 매 step이 진행 상태와 verdict(오라클 판정 = pass/fail + 최소 원인)를 기록.
> 스텝 간 핸드오프를 LLM 기억이 아니라 파일에 싣는 장치 — 되감기·diagnose가 이 기록에 근거.
> raw 로그가 아니라 환원된 요약만. 소유자는 특정 step이 아니라 파이프라인. **세션 종료 시 휘발**(비운다).

---

## 현재 세션

- **feature**: D-5 로컬 즐겨찾기
- **active step**: wrap-up
- **직전 종결**: 문서 정합성 정리 커밋 `12bf654` — A-1/A-2/A-4 stale 부채 표기를 종결 이슈로 정리.
- **다음 세션 인계**: D-5 구현·gate2·브라우저 스모크 완료. 사람이 실제 브라우저에서 카드/상세 토글 감각만 수용 확인하면 다음 feature로 넘어갈 수 있음.

<!-- 아래는 다음 세션 시작 시 휘발(비운다). 종결된 D-1 세션의 step 로그·핸드오프는 summary(사람용)·lessons(교훈)·ADR-0007(결정)로 증류 완료. -->

## (아카이브) 핸드오프 — 브레인스토밍 확정분 (휴먼 승인 완료, 2026-07-09)

> 이 feature는 파이프라인 진입 전 사람과의 브레인스토밍으로 **방향이 이미 확정**됐다. 각 step은 아래에서 자기 슬라이스만 자기 권한 문서에 옮긴다(spec=WHY+큐, requirement=AC, architect=ADR/SDD/tasks/HOW).

**결정된 방향 (decision-queue D-1 → option (a) 변형):**
- **필터 상태 단일 소유 = URL searchParams.** `lib/stores/filterStore.ts`(死코드, 소비자 0)는 **폐기**. → C-S2(상태 이중화) 해소 + UX-2(필터 링크 공유·새로고침 지속) 동시 해소.
- **기제 = nuqs 채택** (`useQueryStates`). root `layout.tsx`에 `<NuqsAdapter>` 배선, `package.json`에 `nuqs` 추가. 근거: L-3(미묘한 직렬화 규칙은 검증 어려움 → battle-tested 라이브러리로 대체), T-1(러너 부재 상황에서 자작 코드보다 검증된 라이브러리가 리스크 낮음).
- **폴백 클로즈**: Next 16 어댑터 감지 이슈(#1263, 2.8.5 기준·2.9.0에서 해소 추정)나 React Compiler 상호작용이 gate2(build)/gate3(스모크)에서 깨지면 → 자작 `useFilterParams` 훅으로 폴백. **설계 shape(URL 단일 소유·page=1 리셋·debounce)는 동일**하므로 폴백 비용 낮음. nuqs는 2.8.9에서 Next 16.2.0 대상 테스트됨(우리 앱 Next 16.0.10).

**규칙 (architect가 SDD/tasks로 구체화):**
- 기본값은 URL에서 생략(`clearOnDefault`) — `page=1`·빈 `q`·미선택 필터는 파라미터 미부착. 깨끗한 URL.
- 필터 변경 시 `page`는 1로 리셋(기존 filterStore 규칙 계승).
- URL 갱신은 `history: 'replace'`(키 입력마다 히스토리 오염 방지).
- 검색 입력은 즉각 반응 위해 입력 텍스트 순간값은 컴포넌트 local(정당한 view 상태), 디바운스 후 URL 커밋(nuqs `throttleMs` 또는 로컬 미러). URL이 유일 지속 출처라 C-S2 위반 아님 — SDD에 이 경계 명시.

**Blast radius (architect 분해 입력):**
- 수정 4파일: `app/{characters,spells,potions,movies}/page.tsx` — local `useState`(각 2~3개) 제거 → 페이지별 얇은 nuqs 필터 훅 호출로 치환.
  - characters: `q`, `house`, `page` / spells: `q`, `category`, `page` / potions: `q`, `difficulty`, `page` / movies: `q`, `page`.
- 신규: 페이지별 얇은 래퍼 훅(예: `lib/hooks/useCharacterFilters.ts`) 또는 공용 팩토리 — architect 판단.
- 삭제: `lib/stores/filterStore.ts`.
- 배선: root `layout.tsx` `<NuqsAdapter>`, `package.json` `nuqs` 의존성.
- 주의: `useSearchParams`는 Suspense 경계 필요. 페이지가 이미 `"use client"`이나 App Router 요구 확인(L-2는 이번 스코프 확대 안 함, 흔적만).

**결정 처리:**
- 확정 시 **ADR-0007 승격**(URL 단일 소유 + nuqs 채택 + 폴백 조건). ADR 승격은 wrap-up이 사람 승인 후 집행.
- decision-queue **D-1 삭제**, UIUX **UX-2 종결**.
- 이 feature는 D-4(순수 부채)·D-2(결함 교정)에 이은 첫 **신규 의존성 도입 + 상태 아키텍처 변경** product feature (L-4 반례: architect가 실질을 가짐).

## step 로그

<!--
형식(한 줄씩 append):
- [step] verdict=pass|fail  note=<최소 원인/결과>  ts=<상대>
-->

- [spec] verdict=pass  note=D-1 재진입 WHY(문제·목표·비목표) PRD 추가+AC-11~13 후보, decision-queue D-1에 확정방향 주석(구현 대기)  ts=2026-07-09
- [requirement] verdict=pass  note=AC-11~13 확정(후보→정식): URL 단일소유 반영·복원(UX-2), 死코드/이중보유 제거·필터차원 보존(C-S2), page=1 리셋·기본값 URL 미부착. 새로고침/공유 시각복원·URL 문자열 관찰은 gate3 위임 명시. Domain 무변경(신규 어휘 없음). HOW 불기재  ts=2026-07-09
- [architect] verdict=pass  note=ADR-0007 신규(URL단일소유+nuqs+폴백클로즈), SDD/state-management 재진입(필터=URL단일), UIUX U-7·UX-2 해소설계, Constraints C-S2 해소+C-S6 seed, TestStrategy nuqs검증노트, tasks.md D-1 T1~T8 분해. blast radius 실측: 소스는 src/ 하위(확정분은 프리픽스 누락)·filterStore 소비자 0 확인·movies는 title_cont/release_date/pageSize12(나머지 name_cont/name/24)로 상이 → 공용팩토리 config로 흡수·tasks에 반영  ts=2026-07-09
- [scaffold] verdict=pass  note=T1 완료. nuqs@2.9.0 설치(#1263 해소 추정 버전, 확정분 언급 2.9.0), NuqsAdapter(nuqs/adapters/next/app) 1곳 배선=src/app/providers.tsx 최외곽(QueryClient 상위, use client 경계 내). tsc --noEmit green. 이중배선 없음. 런타임 어댑터 인식 최종확인은 T6/T7 몫  ts=2026-07-09
- [build-logic] verdict=pass  note=T2/T3/T4 완료. useListFilters 공용팩토리(useQueryStates, clearOnDefault+page=1리셋+history:replace 중앙화, 검색 local미러+300ms디바운스 URL커밋, URL→FetchOptions 파생) 신규. 4페이지 useState/setCurrentPage(1) 제거→훅 치환(movies=title_cont/release_date/pageSize12 실측 반영, 이산필터 미선택='' 규약). filterStore.ts 삭제(grep 0)+빈 stores/ 정리. T5 Suspense: 스모크 build가 "useSearchParams should be wrapped in suspense" 표면화→4페이지 콘텐츠를 <Suspense fallback=FullPageLoader>로 감쌈(최상단 use client 유지, L-2 확대 아님). gate2 3종(tsc·lint·build) 전부 green, 4목록 static prerender  ts=2026-07-09
- [verify] verdict=pass  note=T7 헤드리스 최대치. 정적(AC-12): grep filterStore src/=0(死코드 제거), 4페이지 useState=0(지속상태 이중보유 없음·local미러는 훅 내부만), config 차원 보존 실측(chars/spells/potions=name_cont+house/category/difficulty_eq+name+24, movies=title_cont+이산없음+release_date+12), NuqsAdapter providers.tsx 1곳. 스모크(AC-11/13): npm start 프로덕션 서버 실측 curl — /characters 200, /characters?q=harry&house=Gryffindor&page=2 200, /movies?q=potter&page=2 200. 앱셸 렌더(17KB·title·error/500/NuqsAdapter마커 0), 폴백 미발동(nuqs 정상). 초기 curl "command not found"는 셸 해싱 artifact였고 절대경로 재시도 3x200 재현(L-9). 서버 종료·포트 정리 완료. 시각 동치는 gate3 위임  ts=2026-07-09
- [test] verdict=pass  note=러너부재(T-1)·verify의 정적3종+스모크로 대체·축약(별도 test runner 없음)  ts=2026-07-09
- [review] verdict=pass  note=AC/U 코드대조 완료. AC-12 정적 충족(filterStore src/=0·stores/ 삭제·4페이지 useState=0·필터차원 4페이지 실측보존:chars/spells/potions=name_cont+house/category/difficulty_eq+name+24, movies=title_cont+이산없음+release_date+12), AC-13 로직 충족(clearOnDefault:true·setSearch/setDiscrete가 page=1리셋·value||null로 기본값 미부착·history:replace), AC-11 배선 충족(URL→urlState→search미러/discreteValue/fetchOptions 양방향, NuqsAdapter 1곳). 회귀 없음(4페이지 loading/error/empty 3분기·하우스색·페이지네이션·검색 배선 보존). 잔여=AC-11 시각복원·AC-13 URL문자열 관찰 gate3 휴먼 위임. fail 없음 → gate3 대기  ts=2026-07-09
- [spec/architect] verdict=pass  note=D-5 로컬 즐겨찾기 범위 확정. 서버/로그인/동기화 비목표, Zustand persist+localStorage 단일 소유(ADR-0009), 5종 카드·상세 토글 + /favorites 집계 + Header 네비로 tasks T1~T8 seed.  ts=2026-07-09
- [build] verdict=pass  note=T2~T6 완료. favoritesStore(Zustand persist+localStorage, hasHydrated, toggle/remove/isFavorite), favorite 메타 팩토리, FavoriteToggleButton, FavoriteCard, /favorites 라우트, Header Favorites 네비 추가. 5종 카드 Link 구조를 카드 루트+Link+독립 하트 버튼으로 조정해 중첩 인터랙션 회피. 5종 상세 사이드바에 label 토글 배선.  ts=2026-07-09
- [gate2] verdict=pass  note=`npm run gate2` green(tsc --noEmit, eslint, next build). /favorites static prerender 확인. baseline-browser-mapping stale warning은 기존 advisory.  ts=2026-07-09
- [verify] verdict=pass  note=프로덕션 서버 스모크: curl /favorites=200, /characters=200. Playwright로 /favorites empty 표시, localStorage 주입 후 Harry Potter 카드 표시, Header Favorites 링크 표시, remove 버튼 클릭 후 empty 복귀 확인. 프로젝트 내 Playwright 미설치라 /tmp Playwright 사용; sandbox Chromium 제한으로 승인 후 실행.  ts=2026-07-09
- [review] verdict=pass  note=AC-14 충족(5종 목록 카드+상세 토글 배선, 상태 즉시 토글 store), AC-15 충족(/favorites 집계·상세 링크·목록 해제), AC-16 충족(localStorage persist+hasHydrated 빈상태). U-8/U-9 코드대조+브라우저 스모크 pass. 잔여는 휴먼 감각 수용(실제 카드/상세 클릭감)만.  ts=2026-07-09

**→ gate3(휴먼 acceptance) — review가 넘긴 최종 수용 체크리스트**: review가 AC-11/12/13·U-7을 코드대조로 pass 판정(fail 없음). 정적 확정분(AC-12 전부·AC-13 로직·AC-11 배선)은 검증 완료. 아래는 사람이 4페이지에서 **눈으로만** 확정할 잔여 시각 갭(헤드리스 불가). `npm run dev`(또는 `npm start`)로 앱을 띄우고 브라우저에서 4페이지 각각 확인.

- **[AC-11 시각 복원] 4페이지 공통** (`/characters`·`/spells`·`/potions`·`/movies`):
  - 조작: 검색어 입력(예 characters `harry`) + 이산 필터 클릭(characters=House `Gryffindor` / spells=category / potions=difficulty; movies는 검색만) + 페이지네이션으로 2페이지 이동.
  - 기대: 주소창 URL에 `?q=…&house=…&page=2`(movies는 `?q=…&page=2`)가 붙는다. 그 URL을 **새로고침(F5)** 또는 **새 탭/공유 링크로 재진입** → 검색 입력창에 검색어가 그대로, 필터 칩이 그대로 하이라이트, 2페이지 목록 결과가 **동일하게 복원**된다(빈 목록/1페이지로 리셋되지 않음). ⚠ curl은 앱셸 200만 확인했고 실제 목록은 클라이언트 페치라 HTML에 없으므로 **목록 카드가 눈에 보이는지**가 핵심.
- **[AC-13 URL 문자열 관찰] 4페이지 공통**:
  - (1) 리셋: 2페이지에 있는 상태에서 검색어를 바꾸거나 필터 칩을 다른 값으로 클릭 → URL의 `page`가 **사라지고(=1로 리셋)** 목록이 1페이지부터 다시 뜬다.
  - (2) 깨끗한 URL: 검색어를 지우고(빈 입력) 필터를 "All"(미선택)로 되돌리고 1페이지에 있으면 → URL에 `q`·이산·`page` 파라미터가 **하나도 안 붙는다**(순수 경로 `/characters` 등).
  - (3) 디바운스: 검색어를 타이핑할 때 URL이 매 키입력마다가 아니라 **입력 멈춤 ~300ms 후** 한 번 갱신된다(입력창 자체는 즉시 반응).
  - (4) movies 특이: `/movies` 검색은 URL이 `title_cont`가 아니라 `q` 파라미터로 나타나고(내부 매핑), 페이지 크기 12로 페이지네이션 총페이지가 나머지(24)와 다름을 확인.
- **회귀 육안 확인**: 4페이지 각각 로딩 스피너→결과 그리드 정상 표시, 검색 0건 시 "No … Found" 빈 상태, characters 카드 하우스 색 정체성, 카드 호버 lift/shine, 모바일~xl 반응형 그리드가 기존과 동일하게 동작.
- **수용/반려**: 위가 모두 기대대로면 gate3 통과 → wrap-up(ADR-0007 최종 승격·decision-queue D-1 삭제·UX-2 종결·tasks T5~T8 체크는 wrap-up/휴먼). 어긋나면 유형별 되감기 — 목록 미복원/URL 미갱신 등 **구현 문제→build-logic**, 필터 UX 기준 자체 문제→**architect(UIUX 재진입)**, 전제(WHY) 문제→**spec**.

**→ gate2 오케스트레이터 → verify(T7)**: build-logic(T2/T3/T4 + T5 Suspense)이 완료됐고, 이 step 내부에서 이미 `npm run build` 스모크로 gate2 3종(tsc·lint·build) 전부 green을 확인했다(4목록 static prerender). 폴백 클로즈 미발동(nuqs 정상 동작).
- **gate2(T6)**: 오케스트레이터가 `npm run gate2`를 명시 호출해 최종 게이트 확정만 하면 된다(이미 로컬 green). flake는 1회 재시도(L-9).
- **T5(Suspense)**: build-logic이 확정 처리 완료 — 4개 목록 페이지 콘텐츠를 `<Suspense fallback={<FullPageLoader/>}>`로 감쌌다(default export=Suspense 래퍼, 내부 `*PageContent`가 훅 소비). 페이지 최상단 `"use client"` 유지, L-2 스코프 확대 아님. tasks.md T5 체크는 gate2/오케스트레이터 재량(build-logic 권한은 T2/T3/T4 체크로 한정해 미표기).
- **T7(verify)**: ✅ 완료(pass). 정적 대조 + 프로덕션 스모크로 갭 최대 축소. 상세는 위 step 로그 [verify].
- **훅 계약(verify/후속 참조)**: `useListFilters(config)` → `{ search, setSearch, discreteValue, setDiscreteValue, page, setPage, fetchOptions }`. URL 파라미터: `q`(검색), `page`(정수), 이산=`house|category|difficulty`(movies 없음). 미선택/기본값은 URL 미부착.

**→ T8(gate3 휴먼) — verify가 넘긴 잔여 시각 갭**(헤드리스 검증 불가, 사람이 눈으로만 확인 가능):
- **AC-11 시각 복원**: 4페이지(`/characters`·`/spells`·`/potions`·`/movies`) 각각에서 검색어·이산 필터·페이지를 바꾼 뒤 그 URL을 새로고침/공유 링크로 재진입 → 동일 검색어·필터·페이지가 적용된 **동일 목록 결과가 실제로 복원되는가**. (curl은 라우트 200·앱셸만 확인; TanStack Query 클라이언트 페치 결과 목록은 HTML에 미포함 → 시각 관찰 필수.)
- **AC-13 URL 문자열 관찰**: (1) 필터/검색 변경 상호작용 후 주소창 URL이 기대대로 바뀌고 `page`가 1로 리셋되는가, (2) 기본값 상태(빈 검색·미선택·1페이지)에서 `q`·이산·`page` 파라미터가 URL에 **부착되지 않는가**(깨끗한 URL). 특히 검색어 300ms 디바운스 커밋과 movies의 `title_cont`/pageSize 12 차원을 육안 확인.
- verify 실측 근거: 정적 배선(clearOnDefault·page=1 리셋·history:replace·NuqsAdapter 1곳) + 스모크(파라미터 부여 URL 3종 모두 200·폴백 미발동) = **배선 존재는 확인됨**. 남은 건 "클릭→URL 변화→새로고침 복원"의 시각 동치 오라클뿐(L-8 패턴).

**(참고) scaffold 원본 핸드오프 — architect가 남긴 T1~T8 순서:**

**→ scaffold (Implement phase 진입)**: architect가 골격 문서(ADR-0007·SDD 재진입·UIUX·Constraints·TestStrategy) + tasks.md D-1 분해(T1~T8)를 완료. scaffold부터 build-logic까지 아래 순서로 집행.

**구현 순서(tasks.md T1~T8):**
1. **T1 (scaffold)** — `nuqs` 설치 + root `<NuqsAdapter>` 1곳 배선(`src/app/layout.tsx` 또는 `providers.tsx`). 배선 성공이 scaffold 관문.
2. **T2 (build-logic)** — 공용 팩토리 훅 `src/lib/hooks/useListFilters.ts`(config 파라미터화, 공통 규칙 4종 중앙화).
3. **T3 (build-logic, 4개 병렬 가능)** — 4 페이지 local useState → URL 훅 치환. **movies 특이(config 주의)**: `title_cont`·`release_date`·pageSize 12(나머지 `name_cont`·`name`·24).
4. **T4** — `src/lib/stores/filterStore.ts` 삭제(소비자 0 실측).
5. **T5** — Suspense 경계(T6 build가 요구 표면화 시 확정, L-2 스코프 확대 아님).
6. **T6 (gate2)** — `npm run gate2` green. **폴백 클로즈**: React Compiler+nuqs가 build에서 깨지면 자작 `useFilterParams`로 T2 내부만 교체(계약 불변, ADR-0007). flake는 1회 재시도 판정(L-9).
7. **T7 (verify)** — 헤드리스 정적+스모크 최대치, 잔여 시각 갭 session 기록.
8. **T8 (gate3 휴먼)** — AC-11 시각 복원 + AC-13 URL 문자열 관찰(L-8 위임 패턴).

**scaffold 유의:**
- 소스 경로는 전부 `src/` 하위(확정분 문서의 `app/`·`lib/`는 `src/` 프리픽스로 해석).
- blast radius 실측 확정분과 일치(수정 4파일·삭제 1파일·소비자 0). 단 차이 1건: **movies 차원이 나머지와 상이**(위) → 공용 팩토리 config로 흡수(tasks T3 반영). 확정분의 "movies: q, page"는 맞으나 API filter key/sort/pageSize가 달라 config 필수.
- decision-queue D-1 삭제·ADR-0007 최종 승격 집행은 wrap-up(사람 승인 후). architect는 ADR을 `accepted`로 작성만 완료.
