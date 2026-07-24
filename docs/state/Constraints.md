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
- **note**: PotterDB가 반환하는 실제 이미지 호스트와 화이트리스트가 어긋날 수 있음 → `decision-queue` D-3 참조.

---

## Soft (게이트 비차단, build policy 참고)

### C-S1. 서버/클라이언트 컴포넌트 경계
- 데이터 표시 뼈대는 Server Component 우선. `"use client"`는 상호작용(useState/이벤트/브라우저 API)이 필요한 잎 컴포넌트로 국한.
- 현재 위반 다수(list 페이지 전체가 `"use client"`) → `lessons` L-2. 반복되면 hard 승격 후보.

### C-S2. 상태 소유 단일화
- 전역 상태는 Zustand store가, 서버 상태는 TanStack Query가 소유. 같은 상태를 local `useState`와 store에 이중 보관하지 않는다.
- 현재 위반: `filterStore`가 있으나 페이지들은 local `useState` 사용 → `decision-queue` D-1.

### C-S3. 디자인 토큰 사용
- 색·폰트·애니메이션은 `globals.css`의 `@theme` 토큰과 `constants.ts`의 `HOUSE_COLORS`를 쓴다. 컴포넌트에 하드코딩 hex 최소화(현재 `CharacterCard`의 `style={{ color: houseColor.secondary }}` 등 예외 존재).

### C-S4. import 경로
- 절대경로 `@/*`(tsconfig paths) 사용. 깊은 상대경로(`../../..`) 지양.

### T-1. 테스트 러너 부재 (승격 대기)
- 현재 테스트 프레임워크/스크립트 없음. `TestStrategy.md`가 도입 전략을 정의하며, 러너가 들어오면 관련 항목이 hard(C-*)로 승격된다.
