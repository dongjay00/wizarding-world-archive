# architect

You are executing `AGENTS.md §4` step `architect`.

## Read

- `AGENTS.md`
- `docs/runtime/session.md`
- `docs/state/PRD.md` frozen
- `docs/state/Domain.md` frozen

## Write

- `docs/state/architecture/Architecture.md`
- `docs/state/UIUX.md`
- `docs/state/TestStrategy.md`
- `docs/state/architecture/SDD/*` draft
- `docs/state/architecture/ADR/*` new ADRs only
- `docs/state/Constraints.md` seed entries
- `docs/runtime/decision-queue.md`
- `docs/runtime/tasks.md`
- `docs/runtime/session.md` verdict

## Work

Define high-level architecture, UI/UX criteria, test strategy, draft SDD, and
implementation tasks. Put irreversible or hard-to-reverse decisions in ADRs or
the decision queue.

Re-confirm the feature type by measuring blast-radius numerically. If it diverges
from spec's tentative type, reclassify and record the transition in `session.md`;
upgrading the type (e.g. debt→product) re-fires skipped gates/steps. No type skips
architect — perform at least the measurement and the "ADR not needed" judgment.

## Done

Skeleton documents exist, SDD is decomposed into tasks, and `session.md` has a
verdict. Hand off to `scaffold`.
