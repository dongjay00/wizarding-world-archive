# UIUX

> 사용자가 **무엇을(WHAT)** 보고 겪는가. 화면·플로우·인터랙션·상태별 UX, UI 수용기준.
> review가 수용 판정의 기준으로 읽는다. 구현(HOW: 컴포넌트 구조·상태관리)은 여기 두지 않고 SDD로.
> architect 생성, Plan~Implement 초입에 freeze.
>
> ⚠ 프론트 특수성상 인터랙션·상태별 UX는 build 중 드러날 수 있다 — 그 경우 이 문서 재진입(review→UIUX 루프, AGENTS.md 참조).
>
> _재진입 로그: 2026-07-09 D-1 재진입(ADR-0007), UX-2 종결(→ U-7)._

## 디자인 언어

- **테마**: 다크 **기본** + 동작하는 라이트/다크 토글(ADR-0008). 색은 시맨틱 토큰(`content`/`muted`/`subtle`/`surface`, `:root`=라이트·`.dark`=다크)로 전환. 다크 배경 `slate-950→900→950` 그라디언트 + `bg-magic-pattern`, 라이트는 밝은 대응 팔레트. amber 강조·하우스 색은 양 테마 공용.
- **글래스모피즘**: `.glass`(반투명 + `backdrop-blur`) 카드·패널 표면 기본.
- **하우스 색 정체성**: Gryffindor/Slytherin/Ravenclaw/Hufflepuff 각 primary·secondary·gradient (`HOUSE_COLORS` + `@theme` 토큰). 강조·필터·카드 호버에 사용.
- **강조색**: amber(`amber-400/500`) = 액션·하이라이트·포커스 링.
- **타이포**: 제목 `Cinzel`(`--font-magic`, serif, 마법 느낌) / 본문 `Inter`(`--font-body`). `h1~h6`는 자동 Cinzel.
- **모션**(Framer Motion): 진입 fade/slide-up, 리스트 stagger(`delay: idx*0.05`), 카드 `hover-lift` + `card-shine`. `float/glow/shimmer` 커스텀 애니메이션 토큰.

## 전역 레이아웃

`Header`(네비 6항목: Home·Characters·Spells·Potions·Movies·Books, 각 이모지) → `main`(라우트) → `Footer`. 컨테이너 `container mx-auto px-4`.
즐겨찾기 도입 후 Header 네비는 Favorites를 포함한다. 데스크톱에서는 텍스트 메뉴로, 모바일에서는 기존 접힘 메뉴 안에 같은 항목으로 표시한다.

## 화면별 UX

### 목록 페이지 (`/{entity}`)
- 상단: 아이콘 + 엔티티 타이틀 + 한 줄 설명(진입 모션).
- 필터 패널(`.glass`): 검색 인풋(엔티티별) + 필터 칩(예: Characters의 House). 필터 변경 시 페이지 1로 리셋.
- 결과 카운트("Found N …"), 그 아래 반응형 그리드 카드: `grid-cols-1 sm:2 lg:3 xl:4 gap-6`.
- 각 카드 우상단: 하트 아이콘 토글. 저장 전은 비어 있는 하트, 저장 후는 amber 채움 하트. 카드 링크 이동과 독립적으로 동작한다.
- 하단: `Pagination`(현재/전체 페이지, 이동).

### 상세 페이지 (`/{entity}/{id}`)
- 히어로(이미지/포스터/커버 + 핵심 메타) + 속성 섹션들. null 속성은 숨김.
- 히어로 또는 사이드바 액션 영역에 즐겨찾기 토글을 제공한다. 목록 카드의 상태와 즉시 동기화된다.
- Book 상세는 Chapter 목록(order 순)을 추가로 노출.

### 즐겨찾기 페이지 (`/favorites`)
- 상단: 하트 아이콘 + Favorites 타이틀 + 저장 수 요약.
- 저장 항목이 있을 때: 엔티티 타입 뱃지, 제목, 보조문구, 썸네일/placeholder, 상세 이동 링크, 해제 버튼을 갖는 반응형 그리드.
- 저장 항목이 없을 때: 빈 상태와 탐색 시작 CTA(Characters 등)를 표시.

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
- **U-6**: Header 토글로 라이트↔다크가 **실제 색으로** 전환되고(배경·전경·표면), 선택이 새로고침 후 유지된다. **양 테마 모두** 본문 대비가 읽힌다(→ PRD AC-8·9, ADR-0008).

## UI 수용기준 (필터 URL 지속, D-1)

- **U-7**: 목록 페이지(`/characters`·`/spells`·`/potions`·`/movies`)의 검색어·필터 선택·현재 페이지가 URL에 반영되고, 그 URL을 새로고침·북마크·공유로 열면 동일한 필터·검색·페이지가 적용된 동일 목록이 복원된다. 기본값(검색 없음·필터 미선택·1페이지)은 URL에 파라미터가 붙지 않는다(깨끗한 공유 링크). → PRD AC-11~13, ADR-0007. _최종 시각 복원은 gate3 휴먼 위임._

## UI 수용기준 (로컬 즐겨찾기, D-5)

- **U-8**: 카드/상세의 즐겨찾기 토글은 현재 상태를 시각적으로 구분하고, 클릭 후 즉시 저장/해제 상태로 바뀐다.
- **U-9**: `/favorites`는 저장 항목과 빈 상태를 명확히 구분한다. 저장 항목은 엔티티 타입과 원래 상세 링크를 확인할 수 있어야 한다.

## 알려진 UX 결함 (재진입 후보)

- ~~**UX-1**: 다크/라이트 토글이 실제로 색을 바꾸지 못함.~~ **해소(2026-07-09, ADR-0008 → U-6).** D-2 option (a): `.dark` 클래스 + 시맨틱 토큰으로 기제 일원화.
- ~~**UX-2**: 검색·필터 상태가 URL에 없어 새로고침/공유 시 소실(local `useState`).~~ **해소(2026-07-09, ADR-0007 → U-7).** D-1 option (a) 변형: 필터 상태를 URL searchParams 단일 소유로 이전(nuqs 2.9.0), 공유 링크가 필터 상태를 포함. 死코드 `filterStore.ts` 제거. gate3 휴먼 시각 수용(4페이지 URL 복원 관찰) 완료 — 구현 종결.
