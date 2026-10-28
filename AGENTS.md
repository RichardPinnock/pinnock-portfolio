<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio — agent guide

Personal open source portfolio of a freelance developer based in Cuba. The repo is
also a showcase of engineering practice, so process and quality matter as much as the UI.

## Stack

Next.js 16 (App Router, React Server Components), React 19, TypeScript strict,
Tailwind CSS 4 (CSS-first config), shadcn/ui (Radix base) + Cult UI via the shadcn
registry, Motion, Zod, Biome, Lefthook + commitlint, release-please. Deployed only on Vercel.
Package manager: pnpm. Node version in `.nvmrc`.

## Commands

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Lint / format | `pnpm lint` / `pnpm format` |
| Typecheck | `pnpm typecheck` |
| Contrast (WCAG AA) | `pnpm contrast` — run after touching theme tokens in `globals.css` |
| Unit tests | `pnpm test` (added in phase 4) |
| E2E tests | `pnpm e2e` (added in phase 9) |
| Generate CV PDFs | `pnpm cv` — writes the git-ignored `public/cv/*.pdf` from the content JSON; also runs in `prebuild` |
| Analyze repos | `pnpm analyze-repos [owner]` — read-only, writes the git-ignored `content/projects.draft.json` (needs `gh`; set `GH_BIN` if not on PATH) |

## Structure

- `content/` — all site content as JSON (single source of truth, also feeds the CV).
- `src/app/[lang]/` — every route lives under a locale (`/es`, `/en`); `src/proxy.ts` redirects URLs without one using `Accept-Language`. UI strings are in `src/i18n/messages/{es,en}.json` (both must define the same keys), site copy in `/content`. New pages must be added under `[lang]` and export `generateMetadata` with `alternatesFor()` from `src/lib/seo.ts`.
- `src/app/` — routes; `src/components/ui/` — shadcn/Cult UI; `src/components/` — own components.
- `src/lib/schemas/` — one Zod schema per content file; `src/lib/` — shared helpers.
- `scripts/` — repo analysis, CV generation, content validation.
- `docs/adr/` — architecture decision records.

## Conventions

- Server Components by default; add `"use client"` only where interaction requires it.
- Import with the `@/` alias. File names in kebab-case.
- **Content is edited in `/content`, never hardcoded in components.**
- Do not modify shadcn/Cult UI generated components except to adapt them to the theme; document any change in the file header.
- Check the installed Next.js docs (`node_modules/next/dist/docs/`) before using any API.
- Never expose client data or private repositories (no names, domains, internal data or links).
- Respect `prefers-reduced-motion` in every animation.
- Comments explain *why*, not *what*.

## SEO rules

Every new page must define metadata (title template, unique description), canonical URL,
`hreflang` alternates (`es`, `en`, `x-default`) and JSON-LD. One `<h1>` per page.

## Definition of done

Lint, typecheck, tests and build green; Lighthouse 100 in Performance, Accessibility,
Best Practices and SEO (mobile and desktop); WCAG AA contrast verified; no console errors.

## Git workflow

Never work on `main`. One branch per change (`feat/`, `fix/`, `chore/`, `docs/`), atomic
Conventional Commits in English, and a pull request using the template.
Ask the maintainer before any `git push`, force push, branch deletion or history rewrite.
