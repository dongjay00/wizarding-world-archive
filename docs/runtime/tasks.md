# tasks — 구현 분해

> **SDD와 session 사이의 구현 분해 계층**. SDD(설계)를 구현 단위로 쪼갠 목록 + 각 단위 완료 상태.
> 계층: `SDD(설계) → tasks(분해) → session(진행)`.
> - tasks = feature 전체 작업 단위·완료 여부(feature 스코프, 여러 세션 지속).
> - **완료 상태의 단일 출처는 tasks** — 같은 표시를 session에 중복 기록하지 않는다.
> - architect가 SDD에서 분해해 seed → build가 실행하며 완료 갱신 → feature 완료 시 wrap-up이 summary로 증류 후 폐기.

---

## 현재 feature: 없음 (다음 feature 대기)

> 진행 중 feature 0. 직전 feature **다국어 i18n (ko + en) [type: product]**는 gate3(휴먼 acceptance, 2026-07-13 사람이 5개 시각 스모크 수용) 통과로 종결 → wrap-up이 T1~T12 폐기·`summary.md` 증류·`lessons.md`(L-17~L-20) append·session 휘발 완료(2026-07-13).
> i18n은 **하네스를 spec→wrap-up 처음부터 완주한 첫 product feature**(직전까지는 역복원 부채·비목표 승격 재진입). 결정=ADR-0010(next-intl)·ADR-0011(as-needed 프리픽스)·Domain R-6·SDD/i18n(frozen). 상세 이력=summary.md.
> 다음 spec가 새 feature를 착수하면 `## 현재 feature: <이름> [type: ...]`로 이 블록을 교체하고 SDD→구현 단위로 분해 seed한다.

<!-- 종결 이력(증류 완료, 참조는 summary.md):
D-4 부채상환 · D-2 테마 · D-1 필터 상태 일원화 · D-3 이미지 호스트(무변경) · D-5 로컬 즐겨찾기 · i18n 다국어(ko+en, 첫 완주 product feature) -->

<!-- i18n T1~T12(전부 done) 폐기: SDD/i18n→구현 단위 분해였고 gate3 종결로 증류 완료. 구현 사실은 코드·SDD/i18n(frozen)·summary가 보유. -->

### 알려진 부채 (다음 세션 인계)

- **D-10** (decision-queue): Next 16 `middleware.ts` → `proxy` 파일 컨벤션 이전(deprecation advisory, 현재 build 비차단·무해·관찰만). 유형=debt.

