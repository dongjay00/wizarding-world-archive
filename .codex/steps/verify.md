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

## Done

Core behavior matches expectations. Failures rewind to `build-logic`.
