# UIUX

> 사용자가 **무엇을(WHAT)** 보고 겪는가. 화면·플로우·인터랙션·상태별 UX, UI 수용기준.
> review가 수용 판정의 기준으로 읽는다. 구현(HOW: 컴포넌트 구조·상태관리)은 여기 두지 않고 SDD로.
> architect 생성, Plan~Implement 초입에 freeze.
>
> ⚠ 프론트 특수성상 인터랙션·상태별 UX는 build 중 드러날 수 있다 — 그 경우 이 문서 재진입(review→UIUX 루프, AGENTS.md 참조).

## 디자인 언어

- **테마**: 다크 우선. 배경 `slate-950→900→950` 그라디언트 + `bg-magic-pattern`.
- **글래스모피즘**: `.glass`(반투명 + `backdrop-blur`) 카드·패널 표면 기본.
- **하우스 색 정체성**: Gryffindor/Slytherin/Ravenclaw/Hufflepuff 각 primary·secondary·gradient (`HOUSE_COLORS` + `@theme` 토큰). 강조·필터·카드 호버에 사용.
- **강조색**: amber(`amber-400/500`) = 액션·하이라이트·포커스 링.
- **타이포**: 제목 `Cinzel`(`--font-magic`, serif, 마법 느낌) / 본문 `Inter`(`--font-body`). `h1~h6`는 자동 Cinzel.
- **모션**(Framer Motion): 진입 fade/slide-up, 리스트 stagger(`delay: idx*0.05`), 카드 `hover-lift` + `card-shine`. `float/glow/shimmer` 커스텀 애니메이션 토큰.

## 전역 레이아웃

`Header`(네비 6항목: Home·Characters·Spells·Potions·Movies·Books, 각 이모지) → `main`(라우트) → `Footer`. 컨테이너 `container mx-auto px-4`.

## 화면별 UX

### 목록 페이지 (`/{entity}`)
- 상단: 아이콘 + 엔티티 타이틀 + 한 줄 설명(진입 모션).
- 필터 패널(`.glass`): 검색 인풋(엔티티별) + 필터 칩(예: Characters의 House). 필터 변경 시 페이지 1로 리셋.
- 결과 카운트("Found N …"), 그 아래 반응형 그리드 카드: `grid-cols-1 sm:2 lg:3 xl:4 gap-6`.
- 하단: `Pagination`(현재/전체 페이지, 이동).

### 상세 페이지 (`/{entity}/{id}`)
- 히어로(이미지/포스터/커버 + 핵심 메타) + 속성 섹션들. null 속성은 숨김.
- Book 상세는 Chapter 목록(order 순)을 추가로 노출.

## 상태별 UX (모든 목록·상세 공통)

| 상태 | 표현 |
|---|---|
| loading | `FullPageLoader` / 스피너 |
| error | `ErrorMessage`("Failed to load …") |
| empty(0건) | 🔍 + "No … Found" + 안내 문구 |
| 이미지 없음 | Sparkles 아이콘 대체 (카드), 상세는 플레이스홀더 |

## UI 수용기준

- **U-1**: 모든 목록/상세가 loading·error·empty 3상태를 시각적으로 구분해 렌더.
- **U-2**: 카드 호버 시 lift + shine, 이미지 scale 인터랙션 동작.
- **U-3**: House 보유 캐릭터 카드/필터 칩이 하우스 gradient·secondary 색을 반영.
- **U-4**: 그리드가 mobile(1열)~xl(4열)로 반응형.
- **U-5**: 제목은 Cinzel, 본문은 Inter로 렌더(폰트 변수 적용).

## 알려진 UX 결함 (재진입 후보)

- **UX-1**: 다크/라이트 토글이 실제로 색을 바꾸지 못함(next-themes class ↔ CSS `prefers-color-scheme` 불일치, → Architecture A-2). 현재는 사실상 다크 고정.
- **UX-2**: 검색·필터 상태가 URL에 없어 새로고침/공유 시 소실(local `useState`, → A-1).
