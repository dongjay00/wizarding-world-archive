# AGENTS.md — Frontend Team Governance (harness-neutral)

> 이 문서는 **하네스 중립 헌법**이다. 파이프라인·step 스펙(WHO)·게이트·문서 계약의 **단일 출처(SSOT)**.
> 특정 도구(Claude Code / Codex)는 이 문서를 **어댑터**로 참조한다:
> - Claude Code → `CLAUDE.md` + `.claude/agents/*` + `.claude/settings.json`(hooks)
> - Codex → `.codex/adapter.md` + `.codex/steps/*`
>
> 어댑터는 "누가 실행하고 어떤 도구를 쓰는가"만 다르게 하고, **역할·읽는 문서·쓰는 문서·통과 게이트는 이 문서를 그대로 따른다.**

---

## 0. 대원칙

1. **상태는 컨텍스트가 아니라 파일에 산다.** 에이전트는 기억이 아니라 `docs/`를 읽고 쓴다. 핸드오프는 `docs/runtime/session.md`로.
2. **State는 얼고(freeze), Runtime은 흐른다(mutate).** State 문서 수정은 명시적 재진입을 요구한다.
3. **게이트는 두 종류다.** 결정론(도구가 pass/fail) + 휴먼(사람이 승인). 결정론은 자동 차단, 휴먼은 사람 확인 없이는 통과 못함.
4. **얇게 시작한다.** Constraints는 실재 도구가 있는 것만 hard. 나머지는 soft로 두고 반복 위반이 도구화되면 승격(moving boundary).

---

## 1. 컨텍스트 맵 (무엇을 어디서 읽고 쓰나)

```
docs/state/        read-mostly, 게이트에서 freeze
  PRD.md               WHY            (freeze: gate1)
  Domain.md            어휘·규칙       (freeze: gate1)
  UIUX.md              WHAT(사용자경험) (freeze: Implement 초입, review 재진입 가능)
  TestStrategy.md      검증 기준        (freeze: Implement 초입)
  Constraints.md       hard/soft 제약   (seed: architect, 승격: wrap-up)
  architecture/
    Architecture.md    HOW 상위        (freeze: Implement 초입)
    SDD/               HOW 하위        (draft→frozen: gate2)
    ADR/               결정 이력        (append-only, immutable)

docs/runtime/      mutate
  session.md           work-state 원장  (매 step write, 세션 휘발)
  tasks.md             구현 분해·완료    (완료의 단일 출처, feature 스코프)
  lessons.md           교훈             (append-only, wrap-up write)
  decision-queue.md    미결정           (spec/architect 적재, wrap-up 정리)
  summary.md           사람용 요약       (wrap-up write)
```

읽기/쓰기 권한은 §4 step 표에서 step별로 못박는다. **어떤 step도 자기 권한 밖 문서를 수정하지 않는다.**

---

## 2. 파이프라인

```mermaid
flowchart TD
    subgraph PLAN["Plan"]
        direction LR
        spec["spec"] --> req["requirement"]
    end
    gate1{{"gate1 · validate_prd (휴먼+구조)"}}
    subgraph IMPL["Implement"]
        direction LR
        arch["architect"] --> scaf["scaffold"] --> bui["build-ui"] --> blog["build-logic"]
    end
    gate2{{"gate2 · build-verify (결정론: tsc·lint·build)"}}
    subgraph TEST["Testing"]
        direction LR
        ver["verify (behavioral)"] --> tst["test"]
    end
    gate3{{"gate3 · acceptance (휴먼)"}}
    subgraph REVIEW["Review"]
        direction LR
        rev["review"] --> wrap["wrap-up"]
    end

    PLAN --> gate1 --> IMPL --> gate2 --> TEST --> gate3 --> REVIEW

    %% 되감기 루프 (REVIEW 보정: 커버리지 명시)
    gate2 -->|"build-verify fail → 재구현"| blog
    ver   -->|"behavioral fail → 재구현"| blog
    tst   -->|"test fail → 구현 or 테스트 교정"| blog
    scaf  -->|"scaffold fail → 구조 재검토"| arch
    rev   -->|"acceptance fail: 구현 문제 → 재구현"| bui
    rev   -->|"acceptance fail: UX 기준 문제 → UIUX 재진입"| arch
    rev   -->|"acceptance fail: 전제 문제 → WHY 재검토"| spec
    gate1 -->|"PRD 거절 → WHY 재작성"| spec
```

> **REVIEW.md에서 지적한 공백 보정분**이 이 파이프라인에 반영돼 있다:
> - **게이트 3개 + 종류 명시**: gate1(휴먼), gate2(결정론), gate3(휴먼). (기존 2개→3개, 각 종류 태깅)
> - **용어 분리**: `build-verify`(gate2, 정적 tsc/lint/build) ≠ `verify`(Testing, behavioral). 같은 단어 혼용 제거.
> - **되감기 루프 커버리지**: scaffold 실패·test 실패·gate1 거절·UIUX 재진입 경로를 실선으로 추가(기존 점선/누락 보정).

---

## 3. 게이트 정의

| 게이트 | 위치 | 종류 | 통과 조건 | 실행 |
|---|---|---|---|---|
| **gate1** `validate_prd` | Plan→Implement | 휴먼 + 구조 | PRD/Domain에 WHY·수용기준·유비쿼터스 언어가 존재하고 모순 없음. **사람이 승인**. 구조 체크(필수 섹션 존재)는 자동. | 사람(팀장/개발자) + 어댑터의 구조 린트 |
| **gate2** `build-verify` | Implement→Testing | 결정론 | `tsc --noEmit` **and** `npm run lint` **and** `npm run build` 모두 pass. 하나라도 fail이면 차단. | **전이 트리거(주)** + Stop hook 안전망 (아래 발화 모델) |
| **gate3** `acceptance` | Testing→Review | 휴먼 | PRD 수용기준(AC-*)·UIUX 기준(U-*)을 review가 대조, **사람이 최종 수용**. | review step + 사람 |

- gate2는 Constraints C-1~C-3와 1:1. 테스트 러너 도입 시 `npm test`가 gate2에 편입(TestStrategy 승격 규칙).
- **ADR 승격은 휴먼 판단**: "되돌리기 어려운 결정"은 사람 승인 후에만 decision-queue→ADR 승격(wrap-up이 집행, 사람이 결정).

### 게이트 유형별 거동 (feature 유형 분기)

게이트 위치·개수·종류는 불변. 유형별로 내용/적용만 다르다.

| 게이트 | product | debt | investigation |
|---|---|---|---|
| **gate1** (human) | PRD/AC 검증 | 경량 착수 인가(가치+스코프) | 경량 착수 인가(질문+측정 계획) |
| **gate2** (deterministic) | 항상 | 항상 | 코드 변경 시에만 — 무변경 종결이면 N/A |
| **gate3** (human) | AC·UIUX 대조 수용 | 회귀 없음+스코프 수용 | finding 수용 + dissolve/spawn 결정 |

- gate1은 유형 불문 항상 휴먼(§0.3 유지). id `validate_prd` 유지, 비-product는 경량 intake.
- **재분류 소급 발화**: architect가 유형을 올리면(debt→product 등) 하위에서 건너뛴 상위 게이트를 소급 발화(gate1을 PRD 검증 모드로).

### 게이트 발화 모델 (전이 트리거 + Stop 안전망)

게이트는 개념상 **phase 경계에서 발화**한다 — 매 Stop마다가 아니라. 결정론 게이트(gate2)의 기본 모델:

- **전이 트리거(주)**: build-logic이 done을 선언하는 **Implement→Testing 경계에서 파이프라인이 완전 게이트(`tsc·lint·build`)를 1회 명시 호출**한다.
- **2-tier 비용**: 값싼 연속 체크(`tsc·lint`, step 단위로 자주) vs 비싼 완전 게이트(`build`, 경계 1회).
- **Stop hook 안전망(보조)**: `scripts/harness/gate2-build-verify.sh`는 **하네스 중립 gate2 커널**이다. Claude Stop hook은 `.claude/hooks/gate2-build-verify.sh` wrapper로 이 커널을 호출한다. Stop마다 도는 것은 **값싼 안전망**일 뿐, 게이트의 주 메커니즘이 아니다. 기본 advisory, `GATE_ENFORCE=1`로 무장 시 차단.

> **현 상태**: gate2 커널은 `npm run gate2` / `npm run gate2:fast`로 명시 호출 가능하다. Claude 어댑터는 Stop hook 안전망을 추가로 배선하고, Codex 어댑터는 `build-logic` 완료 시 `npm run gate2`를 전이 트리거로 호출한다.

---

## 4. Step 스펙 (WHO — 단일 출처)

각 step은 아래 계약을 따른다. 어댑터는 이 표의 `reads/writes/gate/done`을 바꾸지 않는다.

### feature 유형 프로파일 (§ START.v2 "feature 유형" 인스턴스)

각 feature는 spec이 유형을 잠정 분류(→ `tasks.md` 헤더 `[type:]`), architect가 blast-radius로 재확인한다. step별 유형 거동:

| step | product | debt | investigation |
|---|---|---|---|
| spec | full WHY | thin — WHY=큐 항목 | thin — 질문 프레이밍 |
| requirement | AC 확정 | thin — "회귀 없음+제약 충족" | repurpose — 측정 계획·판정 기준 |
| architect | ADR/SDD/분해 | blast-radius 실측 필수·ADR·SDD 통상 불요 | 측정 접근 설계·ADR 통상 불요 |
| scaffold | 필요시 | 통상 skip | skip |
| build-ui / build-logic | 구현 | 상환(해당 계층) | skip(측정 스크립트면 임시) |
| verify | behavioral | 회귀 스모크 | 증거 수집 = 핵심 산출 |
| test | 전략 따라 | 스모크 | n/a(재현성 확인) |
| review | AC/U 대조 | 회귀·스코프 대조 | finding 대조 + dissolve/spawn 권고 |
| wrap-up | 풀 증류 | 증류(ADR 통상 불요) | 증류 + dissolve/spawn |

- 항상 실행(repurpose): spec·requirement·architect·verify·review·wrap-up. skip 가능: scaffold·build-ui·build-logic·test.
- **architect는 어떤 유형도 skip 안 함**(재분류 관문). investigation 종결: dissolve(무변경) 또는 spawn(후속 feature 적재·새 회전 분리).
- 아래 각 step 계약의 표기 뒤 `[applies_to]` 요약은 이 표를 가리킨다.

### Plan

**spec** — WHY 초안
- reads: PRD(초안), decision-queue, lessons
- writes: PRD(WHY 부분), decision-queue(적재), tasks(feature 헤더 [type:] 태그만)
- done: 문제·목표·비목표가 PRD에 있고, 미결정은 큐에 적재됨.
- applies_to: product=full / debt·investigation=thin(WHY=큐항목 또는 질문 프레이밍). **유형을 잠정 분류해 tasks 헤더 `[type:]`에 기록.**

**requirement** — 수용기준으로 조이기
- reads: PRD, Domain
- writes: PRD(수용기준 AC-*), Domain(어휘·규칙 확정)
- done: 각 목표가 검증 가능한 AC로 표현됨. → **gate1**

### Implement

**architect** — WHAT/HOW 상위 + 분해 seed
- reads: PRD(frozen), Domain(frozen)
- writes: Architecture, UIUX, TestStrategy, SDD(draft), Constraints(seed), ADR(신규 결정), decision-queue(적재), tasks(SDD→분해 seed)
- done: 골격 문서 존재, tasks에 구현 단위 분해됨.
- applies_to: 어떤 유형도 skip 없음. blast-radius 실측으로 spec 분류를 재확인, 어긋나면 재분류(session 흔적)+게이트 소급 발화. debt/investigation은 ADR·SDD 통상 불요.

**scaffold** — 골격 생성
- reads: Architecture, SDD, tasks
- writes: 코드(디렉터리·타입·빈 모듈), session
- done: 레이어 골격이 컴파일됨. 실패 시 → architect 되감기.

**build-ui** — 표현 계층 구현
- reads: UIUX, SDD/routing-and-components, tasks
- writes: 코드(components, pages 표현부), tasks(완료 갱신), session
- done: UIUX 화면·상태 3분기가 렌더됨.

**build-logic** — 데이터·상태·로직 구현
- reads: SDD/data-fetching, SDD/state-management, Domain, tasks
- writes: 코드(lib/hooks/api/stores, 로직), tasks(완료 갱신), session
- done: 데이터 흐름·상호작용 동작. → **gate2(build-verify)**

### Testing

**verify** — behavioral 검증
- reads: TestStrategy, PRD(AC), UIUX(U)
- writes: session(verdict)
- done: 핵심 동작이 기대대로. fail → build-logic 되감기.
- applies_to: product=behavioral / debt=회귀 스모크 / investigation=증거 수집(측정 실행)이 핵심 산출.

**test** — 테스트 실행/작성
- reads: TestStrategy
- writes: 테스트 코드(러너 도입 시), session(verdict)
- done: 정의된 테스트 pass. (러너 부재 시 정적 3종 + 수동 스모크로 대체, 갭을 session에 명시.)

### Review

**review** — 수용 판정
- reads: PRD(AC), UIUX(U), Domain, 변경된 코드
- writes: session(수용 verdict)
- done: AC/U 대조 결과 기록. → **gate3(휴먼 acceptance)**. fail 유형별 되감기(spec/architect/build-ui).
- applies_to: investigation은 finding 대조 후 dissolve/spawn 권고.

**wrap-up** — 정리·승격·증류
- reads: session, tasks, decision-queue, lessons
- writes: lessons(append), summary, decision-queue(정리), ADR(승격, 사람 승인 후), Constraints(soft→hard 승격), tasks(폐기)
- done: 세션 산물이 State/장수 Runtime으로 증류됨. session은 다음 세션에서 비운다.
- applies_to: debt=ADR 통상 불요. investigation=dissolve(무변경 종결 주석) 또는 spawn(후속 feature decision-queue 적재, 새 회전 분리).

---

## 5. 문서 계약 규칙

- **완료의 단일 출처는 tasks.md.** session은 진행만, 중복 완료표시 금지.
- **tasks feature 헤더에 유형 태그.** spec이 `## 현재 feature: <이름> [type: product|debt|investigation]`로 잠정 기록, architect 재분류 시 갱신(전이는 session에).
- **ADR은 append-only.** 뒤집을 땐 새 ADR이 이전 것을 supersede(문구로 명시), 기존 파일 수정 금지.
- **State 재진입은 흔적을 남긴다.** freeze된 문서를 고치면 이유를 session에, 결정이면 ADR/decision-queue에.
- **Constraints hard는 실재 도구만.** `enforced_by` 없는 hard 금지.

## 6. Brownfield(역복원) 채택 모드

이 앱은 **완성 후 역복원**으로 거버넌스가 입혀졌다(greenfield가 아니다). 이 모드의 규율:

- **R1. State는 의도가 아니라 현실을 적는다.** 설계 의도와 실제 동작이 갈리면 **현실**을 기록한다.
- **R2. 괴리는 decision-queue로.** 설계-현실 불일치(死코드·이중화·결함)는 문서에 봉합하지 않고 미결로 흘려보낸다(D-1~D-4).
- **R3. 초기 ADR은 `retro` 태그.** 사후 복원한 결정은 `status: accepted (retro)`로 실시간 결정과 구분(ADR-0001~0006).
- **R4. 채택 직후 gate2 베이스라인 실측.** 입히자마자 gate2를 1회 돌려 기존 부채를 뽑아 적재한다(이 실험에서 Footer lint 4건 = D-4를 이렇게 잡음).

다음 feature는 이 파이프라인을 처음부터 한 바퀴 돌며, §3의 "전이 트리거"는 `npm run gate2` 명시 호출로 실행한다.
