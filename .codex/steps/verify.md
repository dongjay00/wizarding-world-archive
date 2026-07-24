# verify

You are executing `AGENTS.md §4` step `verify`.

## Read

- `AGENTS.md`
- `docs/runtime/session.md`
- `docs/state/TestStrategy.md`
- `docs/state/PRD.md`
- `docs/state/UIUX.md`

## Write

- `docs/runtime/session.md` verdict only

## Work

Check behavior against acceptance criteria and UIUX criteria. This is not
gate2; gate2 is the static `build-verify` gate. Use dev/prod smoke checks when
there is no formal runner and record any remaining human-only gap.

By type: product = behavioral checks; debt = regression smoke; investigation =
evidence collection (running the measurement) is the primary deliverable — record
quantitative results in `session.md` as the basis for dissolve/spawn.

## Done

Core behavior matches expectations. Failures rewind to `build-logic`.
