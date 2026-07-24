# TestStrategy

> **무엇을 어떻게 검증할지(WHAT의 통과 기준)**. 테스트 범위·계층, 커버리지 목표, 오라클 종류.
> verify/test step과 review가 읽는다. architect 생성, Plan~Implement 초입에 freeze.

## 현재 상태 (정직한 기준선)

**자동화 테스트 없음.** `package.json`에 test 스크립트도, 러너(Vitest/Jest/Playwright)도 없다. 지금 존재하는 결정론적 오라클은 **정적 검증 3종뿐**:

| 오라클 | 명령 | 계층 |
|---|---|---|
| 타입 | `npx tsc --noEmit` | 정적 |
| 린트 | `npm run lint` | 정적 |
| 빌드 | `npm run build` | 정적/통합(컴파일) |

→ 이 3종이 현재 gate2(build-verify)의 전부이며 Constraints C-1~C-3와 1:1 대응.

## 오라클 종류 (용어)

- **build-verify (결정론)**: 위 정적 3종. 사람 개입 없이 pass/fail. gate2.
- **behavioral verify (계획)**: 실제 동작(렌더·상호작용·데이터 흐름)을 확인. 러너 도입 후 활성화.
- **acceptance (휴먼/혼합)**: PRD 수용기준·UIUX 기준 대조. review step, 일부 휴먼 판정.

## 목표 테스트 피라미드 (러너 도입 후)

지금은 **갭**이며, 러너가 들어오는 순간 아래가 활성화되고 관련 항목이 Constraints hard로 승격된다(C 승격, Constraints T-1).

1. **단위** (Vitest): `lib/api/client.ts`의 `buildQueryString`(page/filter/sort 인코딩 규칙 — 대괄호 비인코딩 등 미묘한 로직), `lib/utils` 순수 함수. → 최우선(순수·고위험).
2. **훅/통합** (Vitest + Testing Library + MSW): `lib/hooks/use*`가 로딩·성공·에러·페이지 전환에서 올바른 상태를 내는지. API는 MSW로 목킹(외부 PotterDB 실호출 금지).
3. **컴포넌트** (Testing Library): 카드가 null 속성·이미지 없음·하우스 색을 UIUX 기준대로 렌더하는지(U-1~U-5).
4. **E2E/시각회귀** (Playwright, 선택): 핵심 플로우(목록→필터→상세) 1~2개 + 카드 스냅샷. 프론트 시각회귀는 여기로.

## 커버리지 방침

- 커버리지 %를 게이트로 걸지 않는다(수치 게임 방지). 대신 **위험 기반**: `buildQueryString`·훅 상태 전이·null 렌더링을 "반드시 커버" 목록으로 둔다.
- 외부 네트워크 의존 테스트는 CI 불안정 원인 → **항상 목킹**. 실 API는 수동 스모크에서만.

## 필터 URL 직렬화·파싱 검증 (D-1, ADR-0007)

nuqs 도입으로 필터 상태가 URL↔상태로 직렬화된다. 러너 부재(T-1) 하의 현실적 검증 전략:

- **정적(gate2)**: `tsc·lint·build`가 nuqs 파서 타입·`<NuqsAdapter>` 배선·Suspense 경계 누락(build 시 `useSearchParams` 경계 경고/에러)을 잡는다. 공용 팩토리 훅 config(페이지별 filter key·sort·pageSize)의 타입 정합도 tsc가 커버.
- **수동 스모크(gate3 위임)**: (1) 필터·검색·페이지 변경 → URL 쿼리 문자열이 기대대로 바뀌는가, (2) 그 URL 새로고침/공유 진입 시 동일 목록 복원되는가, (3) 기본값에서 파라미터 미부착(깨끗한 URL)인가. 헤드리스 정적 검증 불가한 "시각 복원 동치"는 gate3 휴먼(L-8 계승, D-2 AC-8 선례).
- **러너 도입 시 1순위 단위 테스트 후보(L-3 계승)**: 공용 팩토리 훅의 URL↔`FetchOptions` 파생 로직(기본값 생략·`page=1` 리셋·filter key 매핑·movies의 `title_cont`/`release_date` 분기). `buildQueryString`(기존 최우선)과 함께 "미묘한 직렬화 규칙" 군으로 묶어 커버. 라이브러리(nuqs) 자체 직렬화는 검증하지 않고(신뢰), **우리 config·파생 경계만** 테스트.

## i18n 검증 (ko+en, 2026-07-10 · ADR-0010/0011, SDD/i18n)

러너 부재(T-1)·헤드리스 정적 검증 한계 하에서 AC-17~22의 **정적 오라클 커버 vs gate3 휴먼 위임**을 명시 분리한다(L-8 계승). 정적 오라클은 전역 AC-7(tsc·lint·build)이 배선·타입·빌드를 커버하되, i18n 특유의 대조는 아래로 보강한다.

### 정적으로 검증되는 것 (gate2 AC-7 + 코드/문서 대조)
- **AC-17 키 대칭**: `messages/en.json`과 `ko.json`의 chrome 키 집합 일치(en에 있는 키가 ko에 빠짐없이). next-intl은 누락 키에 fallback을 쓰므로 런타임이 조용히 넘어감 → **키 대칭을 별도 대조 대상**으로 둔다(build가 못 잡음). 러너 도입 시 "두 카탈로그 키 diff = 0" 단위 테스트 1순위 후보(§승격).
- **AC-18 배선**: 각 chrome 표면이 카탈로그 키를 소비하는 배선, `<html lang={locale}>` 동적화, `generateMetadata`의 로케일 연동 존재 — tsc/build + 코드 대조. 하드코딩 영문 잔존은 grep 대조(soft 제약 C-S7).
- **AC-19 도메인 어휘 정합**: `ko.json` `domain.*` 값이 Domain.md R-6 표기와 **문자 일치**(그리핀도르·슬리데린·래번클로·후플푸프·인물·주문·마법약·영화·책·챕터), 필터 원문 키(SPELL_CATEGORIES 등)·API filter 키 영문 유지 — 문서↔코드 정적 대조.
- **AC-20 라우팅**: 라우트가 `[locale]` 세그먼트 하위 구성, as-needed 프리픽스 배선, 로케일 인지 `Link`/`usePathname` 치환 존재 — tsc/build.
- **AC-21 배선**: 미들웨어의 Accept-Language 감지·쿠키 read/write·우선순위(쿠키>감지)·`matcher` 존재 — 코드 대조 + build.
- **AC-22 스코프 가드**: 가변 콘텐츠 필드(biography·effect·summary)가 카탈로그 조회를 거치지 않고 API 원본을 렌더하는 코드 경로 — 정적 대조.

### gate3(휴먼 스모크)로 위임되는 것
- **AC-17 시각 전환**: 스위처 클릭 후 화면이 대상 언어로 시각적으로 바뀌는가.
- **AC-18 ko 완전성**: ko에서 모든 chrome 표면이 빠짐없이 한국어인가(누락 영문 없음).
- **AC-20 공유 링크 복원**: `/ko/...` URL 진입 시 실제로 해당 언어로 화면 복원.
- **AC-21 감지·지속**: 첫 방문 감지 결과 + 스위처 선택이 새로고침·재방문에서 동일 언어로 유지(쿠키 우선).
- **AC-19/22 보조**: ko 화면에서 도메인 어휘 한국어·가변 서술문 영문 유지 시각 확인(정적 대조가 주, 시각은 보조).

### 신규 의존성 리스크 게이트 (L-11)
- next-intl 런타임 도입 리스크는 **gate2(build)** 가 1차로 잡는다(`createNextIntlPlugin` 래핑·RSC 메시지 로딩·React Compiler 상호작용). 런타임 거동(미들웨어 리다이렉트·스위처)은 **gate3 스모크**. 폴백 클로즈(ADR-0010) 트리거 시에도 카탈로그·SDD 계약 불변이므로 검증 항목은 동일.

## 러너 도입 시 승격 규칙

Vitest 도입 → `npm test`가 hard 오라클로 편입 → gate2가 `test`까지 포함. 이 문서와 Constraints를 동시 재진입해 갱신한다(wrap-up 승격).
