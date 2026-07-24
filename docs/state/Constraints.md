# Constraints

> hard invariant + soft 선호를 한 파일에. `enforcement: hard | soft` 태그로 구분.
> - **hard** = 도구가 pass/fail로 측정하는 결정론적 제약. `enforced_by`는 실재하는 도구+config를 가리킨다. 게이트가 차단.
> - **soft** = 측정 불가한 스타일 선호. 게이트는 차단하지 않고 build step의 policy가 참고만.
>
> 강도는 2값뿐 — "덜 빡세게"는 `hard→soft` 태그 변경으로만. 얇게 시작해 반복 위반이 도구화되면 soft→hard로 자란다(moving boundary). architect가 seed, wrap-up이 승격.
>
> freeze: Plan 게이트에서 seed, 이후 append/승격은 wrap-up 경유.

---

## Hard (게이트 차단)

이 프로젝트에 **실재하는 도구만** hard로 둔다. 테스트 러너가 아직 없으므로(§soft T-1 참조) 행위 검증은 hard가 아니다.

### C-1. 타입 안전성
- **rule**: 프로덕션 코드는 타입 에러 0.
- **enforcement**: hard
- **enforced_by**: `npx tsc --noEmit` (tsconfig.json `strict: true`, `noEmit: true`)
- **gate**: gate2(build-verify)

### C-2. 린트 통과
- **rule**: eslint 에러 0. `next/core-web-vitals` + `next/typescript` 규칙 위반 없음.
- **enforcement**: hard
- **enforced_by**: `npm run lint` (eslint.config.mjs)
- **gate**: gate2(build-verify)

### C-3. 프로덕션 빌드 성공
- **rule**: `next build`가 실패 없이 완료된다(React Compiler 컴파일 포함).
- **enforcement**: hard
- **enforced_by**: `npm run build` (next.config.ts, `reactCompiler: true`)
- **gate**: gate2(build-verify)

### C-4. 원격 이미지 도메인 화이트리스트
- **rule**: `next/image`에 넣는 모든 원격 호스트는 `next.config.ts`의 `images.remotePatterns`에 등재돼야 한다. 미등재 호스트는 런타임에서 터진다.
- **enforcement**: hard
- **enforced_by**: `next build` / 런타임(등재되지 않은 호스트 사용 시 이미지 렌더 실패). 현재 등재: `static.wikia.nocookie.net`, `www.wizardingworld.com`.
- **gate**: gate2(build-verify) — 단, 빌드가 잡지 못하는 데이터-의존 호스트는 review에서 확인.
- **note**: 실측 정합 확인(2026-07-09, D-3 종결). PotterDB 전 엔티티 이미지 필드를 수집한 결과 실제 호스트는 2개뿐이며 현재 등재와 완전 정합 — characters/spells/potions `image`=`static.wikia.nocookie.net` (경로 `/harrypotter/images/**`, 221샘플 0 불일치), movies `poster`·books `cover`=`www.wizardingworld.com`. 신규 호스트·프록시 불요. `www.wizardingworld.com`은 `/**`로 넓게 열려 있으나 CDN 경로 변경 대비 의도적 유지(하드닝 보류).

---

## Soft (게이트 비차단, build policy 참고)

### C-S1. 서버/클라이언트 컴포넌트 경계
- 데이터 표시 뼈대는 Server Component 우선. `"use client"`는 상호작용(useState/이벤트/브라우저 API)이 필요한 잎 컴포넌트로 국한.
- 현재 위반 다수(list 페이지 전체가 `"use client"`) → `lessons` L-2. 반복되면 hard 승격 후보.

### C-S2. 상태 소유 단일화
- 서버 상태는 TanStack Query가, 지속 필터 상태는 URL searchParams가(ADR-0007), 테마는 next-themes가(ADR-0008) 단일 소유. 같은 **지속** 상태를 두 소유처에 이중 보관하지 않는다.
- ~~현재 위반: `filterStore`가 있으나 페이지들은 local `useState` 사용 → D-1.~~ **해소 완료(2026-07-09, ADR-0007, gate3 수용)**: 필터 소유를 URL 단일로 이전, `filterStore.ts` 삭제(grep 소비자 0 실측), 4페이지가 공용 팩토리 `useListFilters` 경유. 검색 입력의 커밋 전 순간값을 컴포넌트 local view 상태로 미러하는 것은 이중화가 아님(URL이 유일 지속 출처, SDD/state-management 경계 명시).
- **soft→hard 승격 후보(도구 부재로 미승격, L-2/L-7 계열)**: "필터 지속 상태 local `useState` 이중 보유 금지 / `filterStore`류 死코드 재발 금지"를 커스텀 eslint 규칙으로 도구화하면 hard 승격 가능. 현재 이를 pass/fail로 측정하는 실재 도구가 **없으므로 hard 금지**(soft 유지). 반복 위반이 관찰되면 규칙 작성 후 승격.

### C-S6. 지속 필터 상태는 URL이 소유 (ADR-0007, 2026-07-09 seed)
- 목록의 검색어·필터·페이지 등 **지속되어야 할 필터 상태**는 URL searchParams(nuqs)가 소유한다. 새 목록 페이지·필터 차원은 local `useState` 지속 대신 공용 팩토리 훅(`useListFilters`)을 경유한다. 기본값은 URL 미부착(`clearOnDefault`).
- **예외(local 허용)**: 검색 입력의 커밋 전 순간 텍스트, 순수 view 토글(패널 열림 등)은 컴포넌트 local `useState`가 정답(지속 대상 아님).
- 현재 enforcement: soft(리뷰 policy 참고). 반복 위반 시 도구화 후 hard 승격 후보.
- **note (L-2 관련)**: `useSearchParams`/nuqs는 App Router에서 목록 페이지에 **Suspense 경계**를 요구할 수 있다. 이 경계 추가는 C-S1(서버/클라 경계) 개선이 아니라 nuqs 배선의 부산물이며 **L-2 스코프(페이지 use client 축소)를 확대하지 않는다** — 흔적만 남긴다.

### C-S3. 디자인 토큰 사용
- 색·폰트·애니메이션은 `globals.css`의 `@theme` 토큰과 `constants.ts`의 `HOUSE_COLORS`를 쓴다. 컴포넌트에 하드코딩 hex 최소화(현재 `CharacterCard`의 `style={{ color: houseColor.secondary }}` 등 예외 존재).

### C-S4. import 경로
- 절대경로 `@/*`(tsconfig paths) 사용. 깊은 상대경로(`../../..`) 지양.

### C-S5. 테마 색은 시맨틱 토큰 경유 (ADR-0008, 2026-07-09 seed)
- 전경/표면 색은 시맨틱 유틸(`text-content`/`text-muted`/`text-subtle`, `bg-surface`)을 쓴다. 신규 코드에서 하드코딩 `text-gray-*`/`text-white`/`bg-white/*`(다크 전제) 금지.
- **예외(리터럴 허용)**: 이미지 스크림 위 오버레이 텍스트, 고정 컬러 배경(amber/하우스 버튼·뱃지) 위 텍스트, 이미지 placeholder 아이콘 — 이들은 테마와 무관하게 색 고정이 정답.
- 현재 enforcement: soft(리뷰 policy 참고). 반복 위반 시 eslint 커스텀 규칙으로 hard 승격 후보(L-7).

### T-1. 테스트 러너 부재 (승격 대기)
- 현재 테스트 프레임워크/스크립트 없음. `TestStrategy.md`가 도입 전략을 정의하며, 러너가 들어오면 관련 항목이 hard(C-*)로 승격된다.
