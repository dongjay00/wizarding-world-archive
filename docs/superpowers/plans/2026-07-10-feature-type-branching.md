# feature 유형 분기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하네스 파이프라인에 feature 3분류(product/debt/investigation)를 계약으로 도입해, debt/investigation의 step·게이트 축약을 사람 재량이 아닌 계약이 규정하게 한다(L-4 도구화).

**Architecture:** A안 — 단일 파이프라인·게이트 개수/종류·되감기·발화 모델은 **불변**. 유형 분기를 (1) START.v2 메타-템플릿의 계약 스키마 필드 `applies_to` + 유형 정의/원칙 절, (2) AGENTS 인스턴스의 step·게이트별 유형 거동 표, (3) `.claude`/`.codex` 어댑터 카드에 흡수. SSOT 방향: START.v2(원칙) → AGENTS(인스턴스) → 어댑터(실행).

**Tech Stack:** Markdown governance 문서. 빌드/런타임 오라클 없음 — 검증은 SSOT 정합성 + D-1~D-5 역행 매핑.

## Global Constraints

- **뼈대 불변**: 파이프라인 step 순서, 게이트 3개(gate1 human / gate2 deterministic / gate3 human), 되감기 루프, 게이트 발화 모델(전이 트리거+Stop 안전망)을 바꾸지 않는다. 유형 분기는 기존 step/게이트의 *내용·적용*만 조건화한다.
- **SSOT 방향 준수**: START.v2가 원칙·스키마의 단일 출처. AGENTS는 이를 인스턴스화만 하고 새 규범을 발명하지 않는다. 어댑터(.claude/.codex)는 "누가 실행"만 다르고 reads/writes/gate/done을 바꾸지 않는다(AGENTS.md 서두 규율).
- **3유형 canonical 정의**(모든 task 공통, 설계 문서 §1에서 verbatim):
  - `product` = 신규 사용자대면 WHAT/WHY **또는** 신규 아키텍처·의존성(ADR/SDD 필요). 근거 D-1·D-2·D-5.
  - `debt` = 기존 코드를 기존 제약/품질선에 상환. 신규 WHY·신규 사용자 동작 없음. 근거 D-4.
  - `investigation` = 불확실성을 실측으로 해소. 코드 무변경 종결 가능. 근거 D-3.
- **불변식**: "코드를 건드리는 순간 investigation이 아니다"(재분류 트리거). "모호하면 상위 세리머니(product)로 기운다".
- **참조 문서**: 모든 task는 시작 전 `docs/superpowers/specs/2026-07-10-feature-type-branching-design.md`를 읽는다(canonical 표의 출처).
- **커밋 메시지**: 각 task 종료 시 커밋. Co-Authored-By 트레일러 유지.

---

### Task 1: START.v2.md — 메타-템플릿에 유형 스키마 + 원칙 절

**Files:**
- Modify: `/home/bv_leedonghoon/programming/practice/frontend-team-governance/START.v2.md` (§4 계약 스키마 + §4 말미에 신설 절)

**Interfaces:**
- Produces: 유형 어휘(`product|debt|investigation`), 계약 스키마 필드 `applies_to`, 분류/재분류/게이트/종결 **원칙**(구체 표 아님). 하위 task(AGENTS·어댑터)가 이 어휘·원칙을 인스턴스화한다.

- [ ] **Step 1: 계약 스키마에 `applies_to` 필드 추가**

`START.v2.md`의 "### 계약 스키마 (모든 step 공통)" 블록에서 4필드 목록 끝(`- \`done\`: ...` 줄 다음)에 추가:

```markdown
- `applies_to`: feature 유형별 이 step의 거동 — `full`(전량) / `thin`(축약) / `repurpose`(용도전환) / `skip`(생략). 유형은 {product, debt, investigation}. 실제 값은 `AGENTS.md §4`에 인스턴스화.
```

- [ ] **Step 2: §4 말미에 "feature 유형 분기" 절 신설**

`START.v2.md` §4의 마지막(Step roster 표 + 그 아래 인용문 뒤, "## 5. Process" 직전)에 삽입:

```markdown
### feature 유형 (v2.1 신설 — L-4 도구화)

> **실측 근거(파이프라인 4회전)**: product(D-1·D-2·D-5)는 spec/architect가 실질을 갖지만, debt(D-4)·investigation(D-3)은 비어 수동 축약됐다. 유형을 계약화해 축약을 사람 재량이 아닌 계약이 규정한다. **뼈대(파이프라인·게이트·되감기)는 불변** — 유형은 step·게이트의 *거동*만 조건화한다(A안).

**3유형 판정 기준:**

| 유형 | 판정 | 근거 |
|---|---|---|
| **product** | 신규 사용자대면 WHAT/WHY 또는 신규 아키텍처·의존성(ADR/SDD 필요) | D-1·D-2·D-5 |
| **debt** | 기존 코드를 기존 제약/품질선에 상환. 신규 WHY·사용자 동작 없음 | D-4 |
| **investigation** | 불확실성을 실측으로 해소. 코드 무변경 종결 가능 | D-3 |

**분류 시점 + 이중 장치:**
- **spec 진입 시 잠정 분류.** `tasks.md` feature 헤더에 `[type: …]`로 기록.
- **architect가 blast-radius 실측으로 재확인.** 유형이 어긋나면 재분류하고 session에 흔적. 유형을 **올리면**(예: debt→product) 생략된 게이트/step을 소급 발화.
- **모호하면 상위 세리머니(product)로 기운다.** 과소 세리머니가 필요 게이트를 건너뛰는 위험 > 과잉(L-7 실증).

**step 프로파일 원칙 ("백본 보편, 코드 생산부만 collapse"):**
- **항상 실행(내용만 유형별 = repurpose)**: spec·architect·verify·review·wrap-up. → 뼈대 재발명 없음.
- **skip 가능(코드 작업 있을 때만)**: scaffold·build-ui·build-logic·test.
- **architect는 어떤 유형도 skip 안 함** — blast-radius 실측이 재분류 관문(debt/investigation도 "실측 후 ADR 불요 판정"까지는 돈다).
- step별 유형 거동(full/thin/repurpose/skip) 실제 값은 `AGENTS.md §4`.

**게이트 유형별 거동 원칙(위치·개수·종류 불변):**
- **gate1**은 유형 불문 항상 휴먼. 내용만: product=PRD/AC 검증, debt/investigation=경량 착수 인가(가치+스코프). id `validate_prd` 유지.
- **gate2**만 유형 조건부: product/debt 항상, investigation은 **코드 변경 시에만**(무변경 종결이면 N/A).
- **gate3**은 유형 불문 항상 발화. investigation에선 dissolve/spawn 종결 게이트.
- **재분류 소급 발화**: 유형 상향 시 상위 유형이 요구하는 게이트를 소급 발화(L-7 "스코프 재확인"의 게이트화).

**investigation 종결 분기:**
- **dissolve**: 실측 결과 무변경(D-3형). decision-queue 종결 주석 + State/Constraints note 정합 확인 + lessons. gate2 N/A·ADR 불요.
- **spawn**: 실측이 실작업을 드러냄 → 후속 feature로 decision-queue 적재(product/debt 태그), 실작업은 **새 회전으로 분리**(측정과 실작업은 게이트 프로파일이 다름). wrap-up 집행.
- **불변식**: "코드를 건드리는 순간 investigation이 아니다" — 인라인 수정하려면 유형이 재분류되고 게이트 소급 발화.
```

- [ ] **Step 3: 정합 오라클 — START.v2 자체 일관성 확인**

Read `START.v2.md`. 확인:
- 계약 스키마에 `applies_to`가 4필드 뒤에 있고, 새 절이 이를 참조하는가.
- 새 절이 뼈대 변경(새 step/새 게이트)을 도입하지 **않았는가**(step roster·게이트 3개 표는 원본 그대로인가).
- 3유형 정의가 Global Constraints의 canonical 정의와 **자구까지 일치**하는가.

Expected: 세 확인 모두 pass. 불일치 시 이 task 내에서 수정.

- [ ] **Step 4: Commit**

```bash
cd /home/bv_leedonghoon/programming/practice/frontend-team-governance/wizarding-world-archive
git add -A ../START.v2.md 2>/dev/null || git -C /home/bv_leedonghoon/programming/practice/frontend-team-governance add START.v2.md
# START.v2는 부모 dir(비-git)일 수 있음 — git 추적 밖이면 편집만 하고 커밋은 app repo 문서로 이 계획이 대체
git commit -q -m "docs(harness): START.v2 메타-템플릿에 feature 유형 스키마·원칙 절 추가

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" || echo "START.v2 is outside git repo — edit persists on disk; tracked reconciliation happens via AGENTS in Task 2"
```

> **주의**: `START.v2.md`는 app repo 상위 디렉터리(비-git)에 있다. git 추적 밖이면 디스크 편집만 유효하고, 버전 관리되는 정합 기록은 Task 2의 AGENTS 커밋이 담당한다. 커밋 실패는 정상 — 경고만 출력하고 진행.

---

### Task 2: AGENTS.md — 인스턴스에 유형 거동 표 + 분기 절

**Files:**
- Modify: `wizarding-world-archive/AGENTS.md` (§3 게이트 절, §4 step 스펙, §5 문서 계약, 새 절 §7 또는 §4 하위)

**Interfaces:**
- Consumes: Task 1의 유형 어휘·원칙(`applies_to`, 3유형, 게이트 거동 원칙).
- Produces: step별·게이트별 **구체 유형 거동 표**(어댑터가 그대로 참조), `tasks.md` 헤더 `[type:]` 문서 계약.

- [ ] **Step 1: §3 게이트 표 아래에 "유형별 게이트 거동" 소절 추가**

`AGENTS.md` §3의 게이트 표(gate1/gate2/gate3 행) 다음, "### 게이트 발화 모델" 앞에 삽입:

```markdown
### 게이트 유형별 거동 (feature 유형 분기)

게이트 위치·개수·종류는 불변. 유형별로 내용/적용만 다르다.

| 게이트 | product | debt | investigation |
|---|---|---|---|
| **gate1** (human) | PRD/AC 검증 | 경량 착수 인가(가치+스코프) | 경량 착수 인가(질문+측정 계획) |
| **gate2** (deterministic) | 항상 | 항상 | 코드 변경 시에만 — 무변경 종결이면 N/A |
| **gate3** (human) | AC·UIUX 대조 수용 | 회귀 없음+스코프 수용 | finding 수용 + dissolve/spawn 결정 |

- gate1은 유형 불문 항상 휴먼(§0.3 유지). id `validate_prd` 유지, 비-product는 경량 intake.
- **재분류 소급 발화**: architect가 유형을 올리면(debt→product 등) 하위에서 건너뛴 상위 게이트를 소급 발화(gate1을 PRD 검증 모드로).
```

- [ ] **Step 2: §4 서두에 유형 프로파일 표 추가**

`AGENTS.md` §4 "## 4. Step 스펙" 제목 아래 첫 문단("각 step은 아래 계약을 따른다...") 다음에 삽입:

```markdown
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

- 항상 실행(repurpose): spec·architect·verify·review·wrap-up. skip 가능: scaffold·build-ui·build-logic·test.
- **architect는 어떤 유형도 skip 안 함**(재분류 관문). investigation 종결: dissolve(무변경) 또는 spawn(후속 feature 적재·새 회전 분리).
- 아래 각 step 계약의 표기 뒤 `[applies_to]` 요약은 이 표를 가리킨다.
```

- [ ] **Step 3: §4 각 step done 절에 유형 거동 한 줄 추가**

다음 5개 step에 `- applies_to:` 줄을 각 step 블록 끝에 추가(나머지 step은 상단 표로 충분):

`spec` 블록에:
```markdown
- applies_to: product=full / debt·investigation=thin(WHY=큐항목 또는 질문 프레이밍). **유형을 잠정 분류해 tasks 헤더 `[type:]`에 기록.**
```
`architect` 블록에:
```markdown
- applies_to: 어떤 유형도 skip 없음. blast-radius 실측으로 spec 분류를 재확인, 어긋나면 재분류(session 흔적)+게이트 소급 발화. debt/investigation은 ADR·SDD 통상 불요.
```
`verify` 블록에:
```markdown
- applies_to: product=behavioral / debt=회귀 스모크 / investigation=증거 수집(측정 실행)이 핵심 산출.
```
`review` 블록에:
```markdown
- applies_to: investigation은 finding 대조 후 dissolve/spawn 권고.
```
`wrap-up` 블록에:
```markdown
- applies_to: debt=ADR 통상 불요. investigation=dissolve(무변경 종결 주석) 또는 spawn(후속 feature decision-queue 적재, 새 회전 분리).
```

- [ ] **Step 4: §5 문서 계약에 tasks 헤더 규약 추가**

`AGENTS.md` §5 "문서 계약 규칙"의 첫 불릿("완료의 단일 출처는 tasks.md...") 다음에 추가:

```markdown
- **tasks feature 헤더에 유형 태그.** spec이 `## 현재 feature: <이름> [type: product|debt|investigation]`로 잠정 기록, architect 재분류 시 갱신(전이는 session에).
```

- [ ] **Step 5: 정합 오라클 — AGENTS ↔ START.v2 일관성**

Read `AGENTS.md` + `START.v2.md`. 확인:
- AGENTS의 유형 프로파일 표(§4)·게이트 거동 표(§3)가 START.v2 원칙과 모순 없는가(gate1 항상 휴먼·gate2 investigation 조건부·architect 불-skip).
- AGENTS가 새 step/게이트를 발명하지 않고 인스턴스화만 했는가(§2 파이프라인·§3 게이트 3행 원본 불변).
- 3유형 정의 자구가 canonical과 일치하는가.

Expected: pass. 불일치 시 수정.

- [ ] **Step 6: Commit**

```bash
cd /home/bv_leedonghoon/programming/practice/frontend-team-governance/wizarding-world-archive
git add AGENTS.md ../START.v2.md 2>/dev/null; git add AGENTS.md
git commit -q -m "docs(harness): AGENTS에 feature 유형 프로파일·게이트 거동 인스턴스화

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: .claude/agents 어댑터 4종 반영

**Files:**
- Modify: `wizarding-world-archive/.claude/agents/spec.md`
- Modify: `wizarding-world-archive/.claude/agents/architect.md`
- Modify: `wizarding-world-archive/.claude/agents/verify.md`
- Modify: `wizarding-world-archive/.claude/agents/wrap-up.md`

**Interfaces:**
- Consumes: AGENTS §4 유형 프로파일·§3 게이트 거동.
- Produces: Claude 서브에이전트가 유형을 분류/재분류/측정/종결분기하도록 지시. reads/writes/gate/done은 불변(유형 거동만 추가).

- [ ] **Step 1: spec.md — 분류 지시 추가**

`.claude/agents/spec.md`의 "## 할 일" 마지막 불릿 다음에 추가:

```markdown
- **feature 유형을 잠정 분류**(product/debt/investigation, AGENTS §4 기준). `tasks.md` 헤더 `## 현재 feature: <이름> [type: …]`에 기록. debt/investigation이면 WHY는 thin(큐 항목/질문 프레이밍)으로 족하다. 모호하면 product로 기운다.
```

- [ ] **Step 2: architect.md — 재분류/blast-radius 지시 추가**

`.claude/agents/architect.md`의 "## 할 일" 마지막 불릿 다음에 추가:

```markdown
- **유형 재확인(재분류 관문)**: blast-radius를 수치로 실측해 spec의 잠정 유형을 재확인. 어긋나면 재분류하고 `session.md`에 전이를 남긴다. 유형을 올리면(debt→product 등) 건너뛴 게이트/step을 소급 발화(gate1 재발화 등). debt/investigation은 ADR·SDD 통상 불요 — "실측 후 불요 판정"까지는 반드시 수행(어떤 유형도 skip 없음).
```

- [ ] **Step 3: verify.md — investigation 측정 지시 추가**

`.claude/agents/verify.md`의 "## 할 일" 마지막 불릿 다음에 추가:

```markdown
- **유형별**: product=behavioral / debt=회귀 스모크 / **investigation=증거 수집(실측 실행)이 핵심 산출** — 측정 결과를 session에 정량 기록(dissolve/spawn 판단 근거).
```

- [ ] **Step 4: wrap-up.md — dissolve/spawn 지시 추가**

`.claude/agents/wrap-up.md`의 "## 할 일" 마지막 불릿 다음에 추가:

```markdown
- **유형별 종결**: debt=ADR 통상 불요. **investigation=dissolve**(무변경이면 decision-queue 종결 주석+State/Constraints note 정합 확인+lessons) 또는 **spawn**(실작업을 후속 feature로 decision-queue 적재·유형 태그, 새 회전으로 분리).
```

- [ ] **Step 5: 정합 오라클 — 어댑터 ↔ AGENTS**

Read 4개 수정 파일. 확인:
- 각 카드의 reads/writes/gate/done(권한)이 **불변**인가(유형 거동만 추가, 권한 미확대).
- 지시가 AGENTS §3/§4 유형 거동과 자구상 모순 없는가.

Expected: pass. 불일치 시 수정.

- [ ] **Step 6: Commit**

```bash
cd /home/bv_leedonghoon/programming/practice/frontend-team-governance/wizarding-world-archive
git add .claude/agents/spec.md .claude/agents/architect.md .claude/agents/verify.md .claude/agents/wrap-up.md
git commit -q -m "docs(harness): .claude 어댑터에 유형 분류·재분류·측정·종결분기 반영

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: .codex 어댑터 동기화

**Files:**
- Modify: `wizarding-world-archive/.codex/adapter.md` (Gates 절)
- Modify: `wizarding-world-archive/.codex/steps/spec.md`
- Modify: `wizarding-world-archive/.codex/steps/architect.md`
- Modify: `wizarding-world-archive/.codex/steps/verify.md`
- Modify: `wizarding-world-archive/.codex/steps/wrap-up.md`

**Interfaces:**
- Consumes: AGENTS §3/§4 유형 거동 (Task 2), .claude 반영 (Task 3).
- Produces: Codex 실행 경로의 유형 인지. 영문 카드 형식 유지(기존 .codex 톤).

- [ ] **Step 1: adapter.md Gates 절에 유형 거동 추가**

`.codex/adapter.md`의 "## Gates" 절 끝(gate3 불릿 다음)에 추가:

```markdown

### Feature type branching

Every feature is one of `product` / `debt` / `investigation` (see `AGENTS.md §4`).
`spec` tentatively classifies and records `[type: …]` in the `tasks.md` header;
`architect` re-confirms via blast-radius and may reclassify (record the transition
in `session.md`, re-fire skipped upper gates on upgrade).

- gate1: always human. product = validate PRD/AC; debt/investigation = lightweight
  intake approval (worth doing + scope).
- gate2: product/debt always; investigation only when code changed (N/A on a
  no-change close).
- gate3: always human. investigation = accept the finding and decide dissolve vs spawn.
```

- [ ] **Step 2: .codex/steps/spec.md — Work 절에 분류 추가**

`.codex/steps/spec.md`의 "## Work" 문단 끝에 추가:

```markdown

Classify the feature type (`product` / `debt` / `investigation`) and record it in
the `tasks.md` header as `[type: …]`. For debt/investigation a thin WHY suffices
(the queued item or the question to measure). When ambiguous, lean to `product`.
```

`## Write` 목록에 `docs/runtime/tasks.md` header가 없으면 추가:
```markdown
- `docs/runtime/tasks.md` feature header `[type: …]` only
```

- [ ] **Step 3: .codex/steps/architect.md — Work 절에 재분류 추가**

`.codex/steps/architect.md`의 "## Work" 끝에 추가:

```markdown

Re-confirm the feature type by measuring blast-radius numerically. If it diverges
from spec's tentative type, reclassify and record the transition in `session.md`;
upgrading the type (e.g. debt→product) re-fires skipped gates/steps. No type skips
architect — perform at least the measurement and the "ADR not needed" judgment.
```

- [ ] **Step 4: .codex/steps/verify.md — Work 절에 유형별 측정 추가**

`.codex/steps/verify.md`의 "## Work" 끝에 추가:

```markdown

By type: product = behavioral checks; debt = regression smoke; investigation =
evidence collection (running the measurement) is the primary deliverable — record
quantitative results in `session.md` as the basis for dissolve/spawn.
```

- [ ] **Step 5: .codex/steps/wrap-up.md — Work 절에 종결 분기 추가**

`.codex/steps/wrap-up.md`의 "## Work" 끝에 추가:

```markdown

By type: debt usually needs no ADR. investigation closes as either dissolve (no
code change → decision-queue closing note + State/Constraints note reconciliation
+ lesson) or spawn (queue the real work as a follow-up feature with a type tag,
split into a new rotation).
```

- [ ] **Step 6: 정합 오라클 — .codex ↔ .claude ↔ AGENTS 삼자 일관**

Read 5개 .codex 수정 파일 + Task 3 결과. 확인:
- .codex 유형 거동이 .claude 어댑터·AGENTS와 **의미상 동일**한가(언어만 영문, 내용 동치).
- reads/writes 권한 불변인가.

Expected: pass. 불일치 시 수정.

- [ ] **Step 7: Commit**

```bash
cd /home/bv_leedonghoon/programming/practice/frontend-team-governance/wizarding-world-archive
git add .codex/adapter.md .codex/steps/spec.md .codex/steps/architect.md .codex/steps/verify.md .codex/steps/wrap-up.md
git commit -q -m "docs(harness): .codex 어댑터에 feature 유형 분기 동기화

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: 역행 검증 — D-1~D-5 소급 매핑 (통합 오라클)

**Files:**
- Modify: `wizarding-world-archive/docs/runtime/lessons.md` (append 검증 결과 L-16)
- Modify: `wizarding-world-archive/docs/superpowers/specs/2026-07-10-feature-type-branching-design.md` (검증 절에 결과 주석)

**Interfaces:**
- Consumes: Task 1~4 전체(완성된 계약).
- Produces: "새 계약이 실측 이력과 일치한다"는 오라클 증거. 불일치 시 프로파일 버그 → 해당 task로 되돌려 수정.

- [ ] **Step 1: 5개 feature를 새 계약에 소급 매핑**

`docs/runtime/summary.md`를 읽고 D-1~D-5 각각을 새 유형 프로파일에 대조. 기대 매핑:

| feature | 기대 유형 | 밟은 경로가 프로파일과 일치? |
|---|---|---|
| D-1 필터 URL 일원화 | product | 풀 파이프라인·ADR-0007·SDD·gate1/2/3 — 일치 확인 |
| D-2 테마 토글 | product | 풀·ADR-0008·gate1/2/3 — 일치 확인 |
| D-5 즐겨찾기 | product | 풀·ADR-0009·gate2/3 — 일치 확인 |
| D-4 lint 상환 | debt | spec~architect 축약·ADR 불요·gate2 red→green·gate3 — 일치 확인 |
| D-3 이미지 호스트 | investigation | 측정(verify 핵심)·코드 무변경·gate2 N/A·**dissolve** 종결 — 일치 확인 |

각 행이 실제 이력(summary/ADR/커밋)과 맞는지 대조. **불일치 발견 시**: 프로파일이 현실을 못 담은 것 → Task 1~4 중 해당 문서를 수정하고 재검증(이 task의 진짜 목적).

- [ ] **Step 2: 검증 결과를 lessons에 기록**

`lessons.md`의 `<!-- 새 교훈은 아래에 append -->` 앞에 추가(L-15 다음 번호):

```markdown
### L-16. feature 유형 분기를 실측 이력으로 역행 검증했다 (L-4 도구화 종결)
L-4가 지적한 "debt/investigation에 풀 파이프라인은 과함"을 계약으로 도구화(product/debt/investigation 3분류, START.v2 원칙+AGENTS 인스턴스+어댑터). 도입 오라클은 **역행 검증**: 새 계약을 D-1~D-5에 소급 적용하니 product 3건(D-1·D-2·D-5)=풀, D-4=debt 축약, D-3=investigation dissolve로 실제 밟은 경로와 일치. → governance 변경의 검증은 "미래 feature를 기다리지 말고 과거 이력에 소급 적용해 프로파일이 현실을 담는지 확인"이 값싸고 확실하다. 뼈대(파이프라인·게이트·되감기)는 불변으로 유지해 검증된 구조를 재발명하지 않았다(A안).
```

- [ ] **Step 3: 설계 문서 검증 절에 결과 주석**

`docs/superpowers/specs/2026-07-10-feature-type-branching-design.md`의 "## 검증" 절 "역행 검증" 불릿 끝에 추가:

```markdown
  - **결과(2026-07-10)**: D-1~D-5 소급 매핑이 전부 일치(product 3=풀, D-4=debt 축약, D-3=investigation dissolve). 프로파일 교정 불요. lessons L-16.
```

- [ ] **Step 4: 정합 오라클 — 전체 SSOT 최종 스윕**

Read: `START.v2.md`, `AGENTS.md`, `.claude/agents/{spec,architect,verify,wrap-up}.md`, `.codex/adapter.md`, `.codex/steps/{spec,architect,verify,wrap-up}.md`. 최종 확인:
- 3유형 정의·게이트 거동·investigation 종결이 6+ 문서에서 서로 모순 없는가.
- 뼈대(step 순서·게이트 3개·되감기)가 원본 그대로인가.
- `applies_to` 어휘가 START.v2 스키마 → AGENTS 표 → 어댑터 지시로 일관 전파됐는가.

Expected: 전부 일관. 불일치 시 수정 후 재확인.

- [ ] **Step 5: Commit**

```bash
cd /home/bv_leedonghoon/programming/practice/frontend-team-governance/wizarding-world-archive
git add docs/runtime/lessons.md docs/superpowers/specs/2026-07-10-feature-type-branching-design.md
git commit -q -m "docs(harness): feature 유형 분기 역행 검증(D-1~D-5 일치)·L-16

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## 실행 후 (gate3 등가 — 휴먼 수용)

이 변경은 governance 문서라 build 오라클이 없다. Task 5의 역행 검증이 결정론 오라클을 대신하고, 최종 수용은 사람이 3유형 프로파일이 4회전 경험과 맞는지 확인한다. 수용되면 이 하네스 개선 회전 종결.

## Self-Review 체크(계획 작성자용, 실행 전)

- **스펙 커버리지**: 설계 §1(Task1·2·3 분류)·§2(Task2 표·Task3 지시)·§3(Task2 게이트표)·§4(Task2·3·4 종결분기)·변경범위(Task1~4)·검증(Task5) — 전 절이 task로 매핑됨. 갭 없음.
- **placeholder 스캔**: 삽입 마크다운은 전부 실제 문구(TBD 없음). 커밋 명령·경로 구체.
- **일관성**: `applies_to` 어휘·3유형 정의가 Task 전반에서 동일 자구. gate id `validate_prd` 유지 일관.
