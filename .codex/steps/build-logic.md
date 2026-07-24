# build-logic

You are executing `AGENTS.md §4` step `build-logic`.

## Read

- `AGENTS.md`
- `docs/runtime/session.md`
- `docs/state/architecture/SDD/data-fetching.md`
- `docs/state/architecture/SDD/state-management.md`
- `docs/state/Domain.md`
- `docs/runtime/tasks.md`

## Write

- Logic code under `src/lib/**` and related implementation files
- `docs/runtime/tasks.md` completion updates
- `docs/runtime/session.md` verdict

## Work

Implement data fetching, state management, and business logic. Preserve single
ownership of persistent state and defensive rendering rules.

## Done

Data flow and interactions work. Then run the deterministic transition gate:

```bash
npm run gate2
```

If gate2 fails, record the failure and stay in `build-logic`.
