# wrap-up

You are executing `AGENTS.md §4` step `wrap-up`.

## Read

- `AGENTS.md`
- `docs/runtime/session.md`
- `docs/runtime/tasks.md`
- `docs/runtime/decision-queue.md`
- `docs/runtime/lessons.md`

## Write

- `docs/runtime/lessons.md` append-only
- `docs/runtime/summary.md`
- `docs/runtime/decision-queue.md`
- `docs/state/architecture/ADR/*` only for approved promotions
- `docs/state/Constraints.md` only for approved promotions
- `docs/runtime/tasks.md`

## Work

Distill the feature session into long-lived runtime/state documents. Promote
decisions only after human approval. Keep ADR history append-only.

By type: debt usually needs no ADR. investigation closes as either dissolve (no
code change → decision-queue closing note + State/Constraints note reconciliation
+ lesson) or spawn (queue the real work as a follow-up feature with a type tag,
split into a new rotation).

## Done

Lessons, summary, decision queue, approved ADR/Constraints promotions, and
tasks cleanup are complete. Leave `session.md` ready to be cleared at the next
session start.
