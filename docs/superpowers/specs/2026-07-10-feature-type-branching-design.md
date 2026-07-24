# 설계 — feature 유형 분기 (L-4 도구화)

> **대상**: 하네스(START.v2 메타-템플릿 + AGENTS 인스턴스 + 어댑터)
> **근거**: L-4 — 파이프라인 4회전 실측. product(D-1·D-2·D-5)는 spec/architect가 실질을 갖고, debt(D-4)·investigation(D-3)은 비어서 수동 축약됨.
> **채택 구조**: A안 — 단일 파이프라인 유지 + step 계약에 유형별 거동 명시(뼈대 재발명 없음). §0.4 "얇게 시작한다" 준수.
> **성격**: 메타-governance 문서 편집. 앱 product 파이프라인(gate2=tsc/lint/build)을 타지 않음.

---

## 문제

현재 파이프라인은 **단일 경로**다 — 모든 feature가 `spec→requirement→gate1→architect→scaffold→build-ui→build-logic→gate2→verify→test→gate3→review→wrap-up` 10 step을 밟는다. L-4가 잡은 결함: debt(D-4)·investigation(D-3)에서 spec/requirement/architect가 사실상 비었는데도 풀 파이프라인을 돌며 "skip/축약"을 **매번 수동으로 통역·기록**해야 했다. 유형이 암묵적이라 축약 판단이 계약이 아닌 사람 재량에 맡겨진다.

## 목표

- feature 유형을 **명시적 3분류**(product/debt/investigation)로 계약화.
- 각 유형의 step·게이트 거동을 **계약이 규정**(수동 통역 제거).
- 뼈대(파이프라인·게이트 개수/종류·되감기·발화 모델)는 **불변** — 검증된 구조 재발명 금지.

## 비목표

- 새 게이트·새 step 추가 없음.
- 앱 제품 코드 변경 없음(이 변경은 governance 문서 한정).
- B안(트랙 3벌 복제)·C안(축약 규칙 한 문단)은 기각(각각 드리프트·과소해결).

---

## §1. 유형 정의 + 분류 시점

**분류 규칙:**

| 유형 | 판정 기준 | 근거 |
|---|---|---|
| **product** | 신규 사용자대면 WHAT/WHY **또는** 신규 아키텍처·의존성 도입(ADR/SDD 필요) | D-1·D-2·D-5 |
| **debt** | 기존 코드를 기존 제약/품질선에 맞게 상환. 신규 WHY 없음·신규 사용자 동작 없음 | D-4 |
| **investigation** | 불확실성을 실측으로 해소. 코드 무변경으로 끝날 수 있음 | D-3 |

**분류 시점 = spec 진입 시(첫 step).** spec이 decision-queue/PRD를 읽고 유형을 판정, `tasks.md` feature 헤더에 기록: `## 현재 feature: <이름> [type: product|debt|investigation]`. session 현재 feature 줄에도 동반 표기.

**이중 장치 — 분류는 잠정, architect가 재확인:**
- spec의 분류는 **잠정**.
- architect가 **blast-radius 실측** 후 유형이 어긋나면 **재분류**하고 전이를 session에 흔적으로 남긴다.
- 재분류가 유형을 **올리면**(예: debt→product) 생략됐던 게이트/step을 되살린다(§3 소급 발화).
- **모호하면 상위 세리머니(product)로 기운다.** 과소 세리머니가 필요 게이트를 건너뛰는 위험 > 과잉. (L-7 실증: "표면 debt"가 실측하면 product 규모.)

## §2. step별 `applies_to` 프로파일

계약 스키마(START.v2 §4)에 필드 추가: 각 step에 유형별 거동. 값 = **full / thin(축약) / repurpose(용도전환) / skip**.

| step | product | debt | investigation |
|---|---|---|---|
| **spec** | full WHY | thin — WHY=큐 항목 | thin — 질문 프레이밍 |
| **requirement** | AC 확정 | thin — "회귀 없음+대상 제약 충족" | repurpose — 측정 계획·판정 기준 |
| **architect** | ADR/SDD/분해 | **blast-radius 실측 필수**, ADR·SDD 통상 불요 | 측정 접근 설계, ADR 통상 불요 |
| **scaffold** | 필요시 | 통상 skip(골격 존재) | skip |
| **build-ui / build-logic** | 구현 | **상환(해당 계층)** | skip (측정 스크립트면 임시·커밋 여부 wrap-up 판단) |
| **verify** | behavioral 검증 | **회귀 스모크** | **증거 수집 = 핵심 산출** |
| **test** | 전략 따라 | 스모크 | n/a (측정 재현성 확인만) |
| **review** | AC/U 대조 | 회귀·스코프 대조 | finding 대조 + dissolve/spawn 권고 |
| **wrap-up** | 풀 증류(ADR 승격 등) | 증류(ADR 통상 불요) | 증류 + dissolve/spawn |

**핵심 통찰 — "백본은 보편, 코드 생산부만 collapse":**
- **항상 실행(내용만 유형별로 변함 = repurpose)**: spec · requirement · architect · verify · review · wrap-up. → 뼈대 재발명 없음(A안 성립 근거).
- **skip 가능(코드 작업 있을 때만)**: scaffold · build-ui · build-logic · test.
- **architect는 어떤 유형도 skip 안 함** — blast-radius 실측이 §1 재분류 관문. debt/investigation에서도 "실측하고 ADR 불요 판정"까지는 반드시 돈다(L-14: "변경 불요 확인 자체가 산출물").

## §3. 게이트 유형별 거동

게이트는 **위치 고정**, 유형별로 *내용/적용*만 달라진다. 게이트 개수·종류·발화 모델(전이 트리거+Stop 안전망)은 **불변**.

| 게이트 | product | debt | investigation |
|---|---|---|---|
| **gate1** (human) | PRD/AC 검증 | **경량 착수 인가**(가치+스코프) | **경량 착수 인가**(질문+측정 계획) |
| **gate2** (deterministic) | 항상 | 항상 | **코드 변경 시에만** — 무변경 종결이면 N/A |
| **gate3** (human) | AC·UIUX 대조 수용 | **회귀 없음+스코프 수용** | **finding 수용 + dissolve/spawn 결정** |
| (승격) ADR promotion | 신규 결정 시 | 통상 불요 | 통상 불요(신규 기제 시만) |

- **gate1은 유형 불문 항상 휴먼**, 내용만 다름. id `validate_prd` 유지, 계약에 "비-product는 경량 intake" 명문. 누구도 Plan을 사람 승인 없이 못 떠남(§0.3 유지).
- **gate2만 유형 조건부.** investigation은 코드 무변경이 정상 종결(D-3, L-14)이라 델타 0이면 N/A. debt/product는 항상. 결정론 무결성은 코드 델타가 있을 때 항상 유지.
- **gate3은 유형 불문 항상 발화**, investigation에선 dissolve/spawn 종결 게이트.

**재분류의 게이트 소급 발화:** architect가 유형을 올리면 상위 유형이 요구하는데 하위에서 건너뛴 게이트를 소급 발화(debt→product 시 gate1을 PRD 검증 모드로 재발화). L-7의 "스코프 재확인 휴먼 체크"를 게이트 레벨에 내장.

## §4. investigation 종결 분기

1. **dissolve**(D-3형): 실측 결과 손댈 게 없음. 산출 = decision-queue 종결 주석 + State/Constraints note 정합 확인 + lessons(L-14형). 코드 무변경·ADR 불요·gate2 N/A.
2. **spawn**: 실측이 실작업을 드러냄 → 후속 feature로 decision-queue에 적재(product/debt 태그). 원 investigation은 "측정+판정"으로 종결, 실작업은 **새 회전으로 분리**. 이유: 측정(verify)과 실작업(build)은 성격이 다르고 실작업은 자기 유형의 게이트 프로파일을 따라야 함 — 한 회전에 섞으면 프로파일 오염. spawn 적재는 wrap-up 집행.

**불변식 — "대상(제품) 코드를 건드리는 순간 investigation이 아니다":** 측정 중 사소한 제품 코드 수정을 발견하면 원칙은 spawn. 인라인 처리하려면 유형이 investigation→debt/product로 재분류되고 §3 게이트 소급 발화. (측정용 임시 계측 스크립트는 예외 — 대상 코드가 아니므로 investigation을 유지.) 이 규율이 investigation을 측정 전용으로 유지.

---

## 변경 범위 (blast radius)

| 파일 | 변경 |
|---|---|
| `START.v2.md` (메타-템플릿, 부모 dir·비-git) | §4 계약 스키마에 `applies_to` 필드 + "feature 유형" 절 신설(정의·분류·프로파일 원칙). 앱 무관 메타 규범. |
| `wizarding-world-archive/AGENTS.md` (인스턴스) | §3 게이트 표에 유형 거동, §4 각 step 유형별 인스턴스화, 새 절 "feature 유형 분기" |
| `.claude/agents/{spec,architect,verify,wrap-up}.md` | 분류/재분류/측정/종결분기 계약 반영 |
| `.codex/steps/*` (해당 step) | 위와 동기화 |
| `docs/runtime/tasks.md` | feature 헤더 `[type: …]` 규약(이번 세션 헤더 편집에 이미 착수) |

## 검증 (이 변경의 오라클)

마크다운 governance 편집이라 build 오라클 무의미. 대신:
- **정합 오라클**: START.v2 ↔ AGENTS ↔ 어댑터(.claude/.codex) 간 유형 프로파일이 서로 모순 없는가(SSOT 일관성). AGENTS가 START.v2를 인스턴스화하되 뼈대를 안 바꾸는가.
- **역행 검증(회고 적용)**: 새 계약을 D-1~D-5에 소급 적용했을 때 실제로 밟은 경로와 일치하는가(product 3건=풀, D-4=debt 축약, D-3=investigation dissolve). 불일치 시 프로파일 교정.
  - **결과(2026-07-10)**: 소급 매핑 5/5가 3분류에 정확히 담김 — D-1·D-2·D-5(product)·D-3(investigation)은 **실제 경로가 프로파일과 일치**, D-4(debt)는 분기 부재 당시 풀 파이프라인을 돌아 L-4를 남긴 **동기 사례**(프로파일이 그 과잉을 교정 — "경로 일치"와 구분). 프로파일 교정 불요. lessons L-16.
- **휴먼 수용**: 사람이 3유형 프로파일이 4회전 경험과 맞는지 최종 확인.

## 미해결/후속

- feature 유형 태그를 lessons/summary에도 병기할지(추적성) — 후속 판단.
- 유형별 어댑터 서브에이전트 분기(예: debt 전용 축약 에이전트)는 **비목표** — 계약 분기로 충분, 에이전트 복제는 B안의 드리프트 위험 재현.
