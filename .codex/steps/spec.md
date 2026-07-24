# spec

You are executing `AGENTS.md §4` step `spec`.

## Read

- `AGENTS.md`
- `docs/runtime/session.md`
- `docs/state/PRD.md`
- `docs/runtime/decision-queue.md`
- `docs/runtime/lessons.md`

## Write

- `docs/state/PRD.md` WHY section only
- `docs/runtime/decision-queue.md`
- `docs/runtime/session.md` verdict
- `docs/runtime/tasks.md` feature header `[type: …]` only

## Work

Capture the user problem, goals, and non-goals. Put unresolved choices in the
decision queue instead of hiding them in prose.

Classify the feature type (`product` / `debt` / `investigation`) and record it in
the `tasks.md` header as `[type: …]`. For debt/investigation a thin WHY suffices
(the queued item or the question to measure). When ambiguous, lean to `product`.

## Done

Problem, goals, and non-goals exist in PRD, unresolved decisions are queued,
and `session.md` has a compact verdict. Hand off to `requirement`.
