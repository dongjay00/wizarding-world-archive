# tasks — 구현 분해

> **SDD와 session 사이의 구현 분해 계층**. SDD(설계)를 구현 단위로 쪼갠 목록 + 각 단위 완료 상태.
> 계층: `SDD(설계) → tasks(분해) → session(진행)`.
> - tasks = feature 전체 작업 단위·완료 여부(feature 스코프, 여러 세션 지속).
> - **완료 상태의 단일 출처는 tasks** — 같은 표시를 session에 중복 기록하지 않는다.
> - architect가 SDD에서 분해해 seed → build가 실행하며 완료 갱신 → feature 완료 시 wrap-up이 summary로 증류 후 폐기.

---

## 현재 feature: (없음)

> 진행 중 feature 없음. 직전 feature **D-5 로컬 즐겨찾기**는 gate3(휴먼 수용) 통과로 종결 → `summary.md`로 증류·폐기(2026-07-09).
> 다음 feature가 architect의 SDD 분해에 진입하면 여기에 T1~Tn을 seed 한다.

<!-- 종결 이력(증류 완료, 참조는 summary.md):
D-4 부채상환 · D-2 테마 · D-1 필터 상태 일원화 · D-3 이미지 호스트(무변경) · D-5 로컬 즐겨찾기 -->

