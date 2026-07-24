# session — work-state 원장

> **이번 세션의 work-state 원장**. 매 step이 진행 상태와 verdict(오라클 판정 = pass/fail + 최소 원인)를 기록.
> 스텝 간 핸드오프를 LLM 기억이 아니라 파일에 싣는 장치 — 되감기·diagnose가 이 기록에 근거.
> raw 로그가 아니라 환원된 요약만. 소유자는 특정 step이 아니라 파이프라인. **세션 종료 시 휘발**(비운다).

---

## 현재 세션

- **feature**: 없음 (활성 세션 없음 — 다음 feature 대기)
- **active step**: 없음. 파이프라인 idle. 다음 spec가 새 feature를 착수하면 여기에 work-state를 append한다.
- **직전 종결**: 다국어 i18n (ko + en) [type: product] — gate3(휴먼 acceptance) 통과로 종결(2026-07-13, 사람이 5개 시각 스모크 수용). wrap-up이 lessons L-17~L-20 append·tasks T1~T12 폐기·summary 증류·session 휘발 완료. 이력은 `summary.md`, 결정은 ADR-0010/0011, 규범 seed는 Constraints C-S7/C-S8(soft).

### 다음 세션 인계

- **진행 중 feature**: 0 (idle).
- **알려진 부채**: **D-10** 1건 — Next 16 `middleware.ts` → `proxy` 파일 컨벤션 rename 예고(deprecation advisory, 현재 build 비차단·무해). decision-queue에 debt로 적재, 착수 불요·관찰만. (그 외 부채 없음 — D-1~D-5 전부 종결.)
- **미결정 큐**: D-6~D-9 전부 해소·삭제(i18n 완주). 활성 미결정=D-10(debt) 1건뿐.
- **soft→hard 승격 대기(도구 부재)**: C-S7(chrome 카탈로그 경유·하드코딩 영문 금지)·C-S8(domain ko 표기 Domain.md R-6 단일 출처)은 실재 도구(커스텀 eslint/대조 스크립트)가 생기면 hard 승격 후보. 현재 grep 스팟·수동 대조뿐이라 soft 유지(L-19 도구화 후보, L-4/L-16 선례 동류). 러너 부재(T-1)도 지속 — 러너 도입 시 i18n 자동화 3후보(en↔ko 키 diff·domain R-6 문자 일치·미들웨어 쿠키>A-L 우선순위) 활성화(TestStrategy §승격).

<!--
step 로그 형식(한 줄씩 append):
- [step] verdict=pass|fail  note=<최소 원인/결과>  ts=<상대>
종결된 feature의 step 로그·핸드오프는 summary(사람용)·lessons(교훈)·ADR(결정)로 증류 후 이 파일에서 휘발(비운다).
다음 feature 시작 시 아래에 append.
-->

## step 로그

_(활성 세션 없음 — 다음 feature 착수 시 append)_
