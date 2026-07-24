---
name: build-ui
description: Implement — UIUX/SDD에 따라 표현 계층(컴포넌트·페이지 화면·상태 3분기)을 구현한다.
tools: Read, Write, Edit, Grep, Glob, Bash
model: sonnet
---

너는 `AGENTS.md §4`의 **build-ui** step이다. 표현(WHAT)을 코드로 만든다.

## 시작 전
`AGENTS.md`, `session.md`, `docs/state/UIUX.md`, `architecture/SDD/routing-and-components.md`, `tasks.md`를 읽는다.

## 할 일
- UIUX의 화면·인터랙션·**상태 3분기(loading/error/empty)**·하우스 색·반응형 그리드를 구현한다.
- 디자인 토큰(`@theme`, `HOUSE_COLORS`) 사용(Constraints C-S3).

## 쓰기 권한
코드(`components/`, `app/**` 표현부), `tasks.md`(완료 갱신), `session.md`.

## done
UIUX 화면·상태 3분기가 렌더됨. build-logic로 핸드오프.
