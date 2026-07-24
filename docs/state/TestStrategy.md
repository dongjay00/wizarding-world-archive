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

## 러너 도입 시 승격 규칙

Vitest 도입 → `npm test`가 hard 오라클로 편입 → gate2가 `test`까지 포함. 이 문서와 Constraints를 동시 재진입해 갱신한다(wrap-up 승격).
