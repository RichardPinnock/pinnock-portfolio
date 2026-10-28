@AGENTS.md

## Claude Code specifics

- Work phase by phase, each on its own branch; summarize what was done, remaining TODOs and decisions needed at the end of each phase.
- Use plan mode for architectural changes and wait for approval.
- Do not invent personal data (experience, dates, companies, achievements); use clearly marked `TODO` values instead.
- Run `pnpm lint && pnpm typecheck && pnpm build` before every commit that touches code.
- Permissions are configured in `.claude/settings.json`; pushes and destructive commands require confirmation.
