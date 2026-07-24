# Codex Adapter

This adapter explains how Codex executes the harness defined by `AGENTS.md`.
The normative source remains `AGENTS.md`; files under `.codex/` only map that
contract to Codex workflow.

## Startup

Before work:

1. Read `AGENTS.md`.
2. Read `docs/runtime/session.md`.
3. Identify the active step. If no feature session is active, start at `spec`.
4. Read only the documents listed by the active step in `AGENTS.md §4`, plus
   the matching `.codex/steps/<step>.md` card.

Do not widen read/write scope because Codex can access more files. The step
contract controls the allowed context and mutation surface.

## Step Execution

Codex does not rely on Claude Code Task subagents. A Codex session executes one
step at a time by temporarily adopting the matching step card:

- `spec` -> `.codex/steps/spec.md`
- `requirement` -> `.codex/steps/requirement.md`
- `architect` -> `.codex/steps/architect.md`
- `scaffold` -> `.codex/steps/scaffold.md`
- `build-ui` -> `.codex/steps/build-ui.md`
- `build-logic` -> `.codex/steps/build-logic.md`
- `verify` -> `.codex/steps/verify.md`
- `test` -> `.codex/steps/test.md`
- `review` -> `.codex/steps/review.md`
- `wrap-up` -> `.codex/steps/wrap-up.md`

At the end of every step, write a compact verdict to
`docs/runtime/session.md` with `pass|fail` and the minimum useful cause. Update
`docs/runtime/tasks.md` only when the active step is allowed to do so.

## Gates

- gate1 `validate_prd`: human gate. Ask the user for approval and stop before
  Implement until approval is explicit.
- gate2 `build-verify`: deterministic gate. When `build-logic` is done, run
  `npm run gate2` once before entering Testing. Use `npm run gate2:fast` only
  as a cheap interim check.
- gate3 `acceptance`: human gate. `review` records the acceptance comparison;
  ask the user for final acceptance before `wrap-up`.

Do not treat Codex turn completion as a gate. Stop hooks are Claude-specific
safety nets; Codex uses explicit transition-triggered commands.

### Feature type branching

Every feature is one of `product` / `debt` / `investigation` (see `AGENTS.md §4`).
`spec` tentatively classifies and records `[type: …]` in the `tasks.md` header;
`architect` re-confirms via blast-radius and may reclassify (record the transition
in `session.md`, re-fire skipped upper gates on upgrade).

- gate1: always human. product = validate PRD/AC; debt/investigation = lightweight
  intake approval (worth doing + scope).
- gate2: product/debt always; investigation only when code changed (N/A on a
  no-change close).
- gate3: always human. investigation = accept the finding and decide dissolve vs spawn.

## Rewind

Follow the rewind paths in `AGENTS.md §2`:

- gate2 fail -> return to `build-logic`
- behavioral `verify` fail -> return to `build-logic`
- `test` fail -> return to implementation or test correction
- `scaffold` fail -> return to `architect`
- `review` fail -> classify as implementation, UX criteria, or WHY and rewind
  to `build-ui`, `architect`, or `spec`

Record the reason in `session.md` before rewinding.

## Codex Operating Rules

- Prefer existing project patterns and minimal edits.
- Keep State documents frozen unless the step contract explicitly allows
  re-entry; record re-entry in `session.md`.
- Keep ADR files append-only. Supersede with a new ADR instead of rewriting
  history.
- Never promote a soft constraint to hard unless a real deterministic tool
  exists and the human approves the promotion path.
