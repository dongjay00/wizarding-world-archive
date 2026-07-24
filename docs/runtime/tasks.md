# tasks — 구현 분해

> **SDD와 session 사이의 구현 분해 계층**. SDD(설계)를 구현 단위로 쪼갠 목록 + 각 단위 완료 상태.
> 계층: `SDD(설계) → tasks(분해) → session(진행)`.
> - tasks = feature 전체 작업 단위·완료 여부(feature 스코프, 여러 세션 지속).
> - **완료 상태의 단일 출처는 tasks** — 같은 표시를 session에 중복 기록하지 않는다.
> - architect가 SDD에서 분해해 seed → build가 실행하며 완료 갱신 → feature 완료 시 wrap-up이 summary로 증류 후 폐기.

---

## 현재 feature: D-5 로컬 즐겨찾기

- [x] T1 문서 재진입: PRD AC-14~16, UIUX U-8~9, SDD/state-management, ADR-0009, tasks seed
- [x] T2 상태 골격: `favoritesStore`(Zustand persist, hydration flag, toggle/remove/isFavorite)
- [x] T3 공용 UI: 즐겨찾기 토글 버튼 + 즐겨찾기 카드
- [x] T4 목록 카드 5종에 토글 배선
- [x] T5 상세 페이지 5종에 토글 배선
- [x] T6 `/favorites` 라우트 + Header 네비 추가
- [x] T7 gate2(`tsc·lint·build`) 통과
- [x] T8 review/wrap-up: AC-14~16·U-8~9 대조, summary 증류
