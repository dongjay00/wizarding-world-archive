# tasks — 구현 분해

> **SDD와 session 사이의 구현 분해 계층**. SDD(설계)를 구현 단위로 쪼갠 목록 + 각 단위 완료 상태.
> 계층: `SDD(설계) → tasks(분해) → session(진행)`.
> - tasks = feature 전체 작업 단위·완료 여부(feature 스코프, 여러 세션 지속).
> - **완료 상태의 단일 출처는 tasks** — 같은 표시를 session에 중복 기록하지 않는다.
> - architect가 SDD에서 분해해 seed → build가 실행하며 완료 갱신 → feature 완료 시 wrap-up이 summary로 증류 후 폐기.

---

## 현재 feature: (없음)

> D-1(필터 상태 소유 일원화 + UX-2 해소)은 2026-07-09 파이프라인 1회전으로 T1~T8 전부 완료·gate3 수용 → summary로 증류 후 폐기. 다음 feature 착수 시 architect가 SDD에서 분해해 seed.
