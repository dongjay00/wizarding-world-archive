# ADR-0011 — locale 프리픽스 정책: as-needed (기본 en 무프리픽스)

- **status**: accepted
- **date**: 2026-07-10
- **근거**: decision-queue D-9, PRD AC-20/AC-21, AC-13(깨끗한 URL 정신), ADR-0010(next-intl `localePrefix`)
- **관계**: ADR-0010(next-intl)의 `localePrefix` 옵션 확정. ADR-0007(D-1)의 "기본값은 파라미터 없는 깨끗한 URL"(AC-13) 선례와 정합.

## Context

라우팅을 `/[locale]/`로 옮기되(AC-20·i18n-G4), 기본 언어(en)도 프리픽스를 **항상** 붙일지(always: `/en/characters`) vs 기본은 **생략**할지(as-needed: `/characters` = en, `/ko/characters` = ko) 미정(D-9). next-intl은 `localePrefix: 'always' | 'as-needed' | 'never'`로 이를 제어한다.

정합 판단 축:
- **AC-13 정신(D-1/ADR-0007)**: "기본값은 파라미터 없는 깨끗한 경로." 필터 기본값을 URL에 미부착한 선례와 결을 맞추면, 기본 로케일(en)도 프리픽스 미부착이 자연스럽다.
- **기존 링크·북마크 보존**: 현재 전 라우트가 `/characters`류 무프리픽스. as-needed면 en URL이 **그대로 유지**되어 기존 공유 링크·북마크·SEO 인덱스가 리다이렉트 없이 계속 유효. always면 전 URL이 `/en/...`으로 이동해 대량 리다이렉트·인덱스 churn 발생.
- **AC-20 요구**: "언어가 URL 경로로 표현·공유·복원"만 요구하고 always/as-needed 표기 정책은 요구하지 않음(AC 본문 명시). ko는 `/ko/` 프리픽스로 언어가 URL에 표현되므로 as-needed로도 AC-20 충족.
- **AC-21 상호작용**: 첫 방문 Accept-Language 감지·쿠키 우선순위는 미들웨어가 처리 → en 사용자는 무프리픽스 경로로 서빙, ko 감지·선택 시 `/ko/`로 리다이렉트. 쿠키가 있으면 쿠키 우선(AC-21).

## Decision

**`localePrefix: 'as-needed'`** 를 채택한다.

- 기본 로케일 **en = 무프리픽스**(`/`, `/characters`, `/movies/{id}` …). 기존 URL 형태 완전 보존.
- 비기본 로케일 **ko = `/ko/` 프리픽스**(`/ko`, `/ko/characters` …). 언어가 URL 경로로 표현·공유·복원(AC-20).
- `next-intl/middleware`가 감지·쿠키·리다이렉트를 처리: 쿠키 부재 첫 방문은 Accept-Language로 초기 로케일 결정, 쿠키 존재 시 쿠키 우선(AC-21).

## Consequences

- **양성**: AC-13 "깨끗한 기본 경로" 선례와 정합. 기존 en 링크·북마크·SEO 인덱스가 리다이렉트 없이 유효(무-churn 마이그레이션). ko는 프리픽스로 언어 URL 표현(AC-20) — 공유 링크 복원 성립.
- **음성/비용**: 로케일 판별이 "프리픽스 유무"에 의존 → 미들웨어·`createNavigation` 배선이 en/ko를 정확히 분기해야 함(next-intl이 표준 처리). always 대비 en/ko 경로 형태가 비대칭(en 무프리픽스·ko 프리픽스)이라, 링크 생성은 반드시 로케일 인지 `Link`(ADR-0010 네비게이션 래퍼) 경유 — 생짜 `href="/characters"`는 활성 로케일을 잃을 수 있음(전 링크 사용처 치환 필요, §session blast-radius).
- **회귀 위험**: 미들웨어 `matcher`가 ko 프리픽스 경로를 놓치면 ko 진입이 en으로 샘. 로케일 인지 Link 누락 시 ko→클릭→en 유출. → verify 스모크 + gate3 휴먼(공유 링크 언어 복원, AC-20)로 위임.

## Alternatives rejected

- **`always`(en도 `/en/` 프리픽스)**: en/ko 대칭·로케일 판별 단순이라는 이점은 있으나, **AC-13 깨끗한 URL 정신에 역행**하고 기존 전 URL을 `/en/`으로 강제 이동시켜 대량 리다이렉트·SEO 인덱스 churn 발생. 무프리픽스 en 링크 보존 가치가 더 큼. → 기각.
- **`never`(프리픽스 없이 쿠키·헤더로만 로케일 판별)**: 언어가 URL 경로에 표현되지 않아 **AC-20("언어가 URL로 표현·공유·복원") 위반**. 공유 링크로 언어 복원 불가. → 기각(AC 정면 충돌).

<!-- append-only. 이 ADR 승격으로 decision-queue D-9 해소 방향 확정(항목 삭제는 wrap-up 소유). -->
