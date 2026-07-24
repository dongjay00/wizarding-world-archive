# ADR-0005 — Tailwind CSS v4 (@theme) + Glassmorphism Design System

- **status**: accepted (frozen)
- **date**: retro

## Context
세계관 몰입을 주는 강한 비주얼 정체성(하우스 색·마법 모션)이 목표(PRD G-3).

## Decision
**Tailwind CSS v4**를 `@theme` 지시자로 사용해 디자인 토큰(하우스 색, `--font-magic/body`, `--animate-*`)을 CSS에서 선언. 표면은 **글래스모피즘**(`.glass`, `backdrop-blur`) + 커스텀 유틸(`hover-lift`, `card-shine`, `magic-text`). 모션은 Framer Motion(ADR 아님, UIUX).

## Consequences
- (+) 토큰이 CSS 단일 출처, 유틸 재사용.
- (+) `HOUSE_COLORS`(constants.ts)와 `@theme` 토큰이 하우스 색의 유일 출처(Domain R-4).
- (−) 일부 컴포넌트가 `HOUSE_COLORS` hex를 inline `style`로 사용(토큰 우회) → soft C-S3.
- (−) `@theme` 색과 라이트/다크 전략의 상호작용 미정리 → ADR-0006.

## Alternatives rejected
- CSS Modules/styled-components: 토큰·유틸 재사용성·속도에서 Tailwind 우선.
