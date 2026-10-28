# Contributing

Thanks for your interest. This repository doubles as a showcase of how I work, so
the process below is followed strictly.

## Setup

```bash
nvm use            # Node version from .nvmrc
pnpm install       # also installs the Git hooks (Lefthook)
pnpm dev
```

## Workflow

1. Never commit to `main`. Create a branch: `feat/...`, `fix/...`, `chore/...`, `docs/...`.
2. Make atomic commits: one logical change each, building and passing tests.
3. Write [Conventional Commits](https://www.conventionalcommits.org) in English,
   imperative mood, with a scope when it applies: `feat(cv): add English template`.
   Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`, `style`.
   A `commit-msg` hook (commitlint) rejects anything else.
4. Open a pull request using the template. CI must be green.
5. Rebase interactively only on local, unpublished branches.

## Before opening a PR

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Content lives in `/content`; never hardcode copy in components. Never include
client names, private repository details or secrets.

## Releases

Versioning follows SemVer and is automated by
[release-please](https://github.com/googleapis/release-please): merging to `main`
opens or updates a release PR; merging that PR tags the release and updates
`CHANGELOG.md`.

## Branch protection (maintainer setup)

In GitHub, go to **Settings → Branches → Add branch ruleset** (or classic rule)
for `main` and enable:

- Require a pull request before merging (at least 1 approval once there are collaborators).
- Require status checks to pass before merging: select the `CI` job
  (`Lint, typecheck and build`) and `CodeQL`.
- Require branches to be up to date before merging.
- Require linear history (use "Squash" or "Rebase" merge, disable merge commits).
- Block force pushes and deletions.

## Code of conduct

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).
