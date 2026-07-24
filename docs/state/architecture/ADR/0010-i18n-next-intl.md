# ADR-0010 — i18n 라이브러리: next-intl 채택 (App Router / RSC)

- **status**: accepted
- **date**: 2026-07-10
- **근거**: decision-queue D-6, PRD i18n-G1~G5 / AC-17~22, Domain R-6, lessons L-11(신규 의존성=ADR+폴백 클로즈)·L-3(미묘한 로직은 battle-tested 라이브러리로)
- **관계**: ADR-0001(Next.js 16 App Router + React Compiler)의 제약 위에서 동작. 신규 런타임 의존성 도입(nuqs=ADR-0007에 이은 두 번째 product feature 신규 의존성).

## Context

i18n(ko+en) feature는 **UI 추(chrome) 전면 번역 + 고정 도메인 어휘 ko 매핑 + `/[locale]/` 라우팅 + Accept-Language 감지 + 쿠키 지속**을 요구한다(AC-17~22). spec가 WHY 단계에서 방향으로 **next-intl**을 잠정 지목했고, 최종 라이브러리·기제 확정은 architect의 HOW/ADR 몫으로 큐(D-6)에 넘어왔다.

제약 환경(실측):
- **Next.js 16.0.10 App Router + React 19.2.1 + React Compiler on**(ADR-0001). 서버 컴포넌트(RSC) 우선, 목록/상세 페이지는 현재 다수 `"use client"`(L-2).
- **테스트 러너 부재(T-1)**. 자작 직렬화·파싱 로직을 잡을 그물이 없다(L-3). 정적 오라클 3종(tsc·lint·build)과 gate3 휴먼 스모크만이 검증 수단.
- 카탈로그는 서버(RSC metadata·`<html lang>`)와 클라이언트(스위처·인터랙션) 양쪽에서 소비된다 — **서버/클라 경계를 넘는 메시지 전달**이 필요.

## Decision

**i18n 라이브러리 = `next-intl`** 을 채택하고 `package.json`에 런타임 의존성으로 추가한다.

- **App Router 네이티브 · RSC-first**: `next-intl`은 App Router `[locale]` 세그먼트, RSC에서의 `getTranslations`/서버 메시지 로딩, 클라이언트 `NextIntlClientProvider`+`useTranslations`를 1급으로 지원한다. 서버에서 `<html lang>`·`generateMetadata`를 로케일로 렌더하고(AC-18), 클라이언트 잎에서 스위처·상호작용 문자열을 소비하는 우리 경계와 맞는다.
- **미들웨어 제공**: `next-intl/middleware`가 Accept-Language 감지·프리픽스 리다이렉트·로케일 쿠키(read/write)를 표준 구현으로 제공한다(AC-21) — 자작 감지/쿠키 우선순위 로직(L-3 위험)을 대체.
- **네비게이션 래퍼**: `next-intl`의 `createNavigation`(`Link`/`usePathname`/`useRouter`/`redirect`)이 활성 로케일을 자동 유지 → 기존 `next/link`·`usePathname` 사용처를 로케일 인지 버전으로 치환하면 전환 시 현재 경로가 보존된다(AC-20, 스위처 UX).
- **React Compiler 정합**: next-intl 훅은 표준 React 훅 규약을 따르므로 컴파일러 자동 메모이제이션과 충돌하지 않는다(수동 메모 불요, ADR-0001 정신). build(C-3)가 컴파일 단계에서 위반을 잡는다.

## 폴백 클로즈 (fallback close) — L-11

next-intl이 gate2(build)/gate3(스모크)에서 깨지면 → **자작 경량 카탈로그 로더 + `useSearchParams`/미들웨어 직접 배선**으로 폴백한다. 트리거:
- Next 16 / React Compiler(on)와 next-intl 플러그인(`createNextIntlPlugin`)이 build 또는 런타임 스모크에서 충돌하는 경우.
- `[locale]` 세그먼트 정적 파라미터(`generateStaticParams`)·RSC 메시지 로딩이 우리 라우트 트리에서 깨지는 경우.

**폴백 비용이 낮은 이유**: 설계 shape(메시지 **키 계약**=D-7 네임스페이스, `[locale]` 라우팅, as-needed 프리픽스, 쿠키 우선순위, 도메인 어휘 단일 출처=Domain.md)가 라이브러리와 **무관하게 동일**하다. 폴백은 **로더/미들웨어 내부 구현만** 교체하고 카탈로그 파일·키 구조·SDD 계약·페이지 소비 코드는 불변. 단 자작 i18n은 nuqs 폴백보다 표면이 크므로(서버/클라 경계 로딩·metadata·미들웨어) **1순위는 어디까지나 next-intl**, 자작은 최후 안전망.

## Consequences

- **양성**: chrome 번역·`[locale]` 라우팅·감지·쿠키를 검증된 단일 라이브러리로 흡수(L-3/L-11 정신). 서버/클라 경계 메시지 전달과 metadata·`<html lang>` 로케일화가 표준 API로 해결. 3번째 언어 확장은 로케일 배열+카탈로그 추가만으로 열림(구조는 열되 구현 안 함 — 비목표 준수).
- **음성/비용**: 두 번째 신규 런타임 의존성. `createNextIntlPlugin`이 `next.config.ts`를 래핑(빌드 파이프라인 진입점 변경) → build(C-3)가 이 배선을 잡는 hard 그물. 전 라우트가 `[locale]` 하위로 이동하는 큰 blast-radius(§session 실측) — 이는 라이브러리 선택과 무관한 i18n 본질 비용이며 config·공용 팩토리로 흡수(L-12 정신).
- **회귀 위험**: 미들웨어 `matcher`가 정적 자산·API를 잘못 포함하면 리다이렉트 루프. 카탈로그 키 누락 시 런타임 fallback 문자열 노출(en 키 대칭=AC-17 정적 대조로 가드). 최종 시각 동치(전환·복원·지속)는 gate3 휴먼 위임(L-8 계승).
- **Constraints**: "chrome 문자열은 카탈로그 경유(하드코딩 영문 금지)"를 soft로 seed(도구화 시 hard 승격 후보). 도메인 어휘 ko 값은 Domain.md R-6 단일 출처 정합(soft).

## Alternatives rejected

- **next-i18next / react-i18next**: Pages Router·CSR 생태에서 성숙했으나 App Router RSC·서버 메시지 로딩·`generateMetadata` 로케일화가 1급 지원이 아니라 추가 배선이 필요. RSC-first(ADR-0001)와 결이 어긋남. → 기각.
- **자작 경량 카탈로그(1순위 채택)**: 미들웨어 감지·쿠키 우선순위·서버/클라 경계 로딩·프리픽스 리다이렉트를 손으로 구현 → L-3가 경고한 "미묘한 규칙, 러너 부재(T-1)에서 회귀 못 잡음"에 정면 충돌. → 폴백(2차 안전망)으로 강등.
- **Paraglide/기타 컴파일형 i18n**: 번들 최적화 이점은 있으나 App Router 미들웨어·metadata 통합 성숙도와 팀 친숙도에서 next-intl 대비 이득이 불명확. 이번 스코프(2언어·chrome)엔 과함. → 기각.

<!-- append-only. 이 ADR 승격으로 decision-queue D-6 해소 방향 확정(항목 삭제는 wrap-up 소유). -->
