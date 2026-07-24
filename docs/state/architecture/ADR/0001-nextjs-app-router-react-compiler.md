# ADR-0001 — Next.js 16 App Router + React Compiler

- **status**: accepted (frozen)
- **date**: retro (구현에서 역복원)

## Context
SEO·이미지 최적화·라우팅이 필요한 콘텐츠 열람 앱. 팀은 React 생태계를 사용.

## Decision
Next.js 16 App Router(React 19)를 채택하고 **React Compiler를 켠다**(`next.config.ts: reactCompiler: true`, `babel-plugin-react-compiler`).

## Consequences
- (+) App Router의 레이아웃·서버 컴포넌트·`next/image`·fetch 캐시 활용 가능.
- (+) React Compiler가 메모이제이션을 자동화 → 수동 `useMemo/useCallback` 의존 감소.
- (−) 빌드에 컴파일 단계 추가 → `next build`가 hard 오라클로서 더 중요(Constraints C-3).
- (−) App Router의 서버/클라이언트 경계 규율 필요 — 현재 미준수(C-S1).

## Alternatives rejected
- Pages Router: 신규 기능(RSC·캐시) 미활용.
- Vite SPA: SEO·이미지 최적화·서버 캐시 직접 구현 부담.
