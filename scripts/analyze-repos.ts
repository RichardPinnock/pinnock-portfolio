// Drafts content/projects.draft.json from the GitHub repositories of an owner.
// Read-only: it only calls `gh repo list` and `gh api` GET endpoints and never touches
// content/projects.json, which stays hand-edited.
//
// Usage: pnpm analyze-repos [owner] [--include-forks]
// Set GH_BIN if `gh` is not on PATH.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import {
  type CategoryId,
  classify,
  detectTechnologies,
  type RepoFiles,
} from "./analyze-repos-lib.ts";

interface RepoSummary {
  name: string;
  description: string | null;
  primaryLanguage: { name: string } | null;
  isPrivate: boolean;
  isFork: boolean;
  isArchived: boolean;
  createdAt: string;
  pushedAt: string;
}

const GH = process.env.GH_BIN ?? "gh";
const args = process.argv.slice(2);
const includeForks = args.includes("--include-forks");

function gh(...ghArgs: string[]): string | null {
  try {
    return execFileSync(GH, ghArgs, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

function ghJson<T>(...ghArgs: string[]): T | null {
  const out = gh(...ghArgs);
  return out ? (JSON.parse(out) as T) : null;
}

function ghFile(owner: string, repo: string, path: string): string | null {
  const b64 = gh(
    "api",
    `repos/${owner}/${repo}/contents/${path}`,
    "--jq",
    ".content",
  );
  return b64 ? Buffer.from(b64.trim(), "base64").toString("utf8") : null;
}

function parseJson<T>(text: string | null): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

const owner =
  args.find((a) => !a.startsWith("--")) ??
  gh("api", "user", "--jq", ".login")?.trim();
if (!owner) {
  console.error(
    "Could not resolve the owner. Run `gh auth login` or pass the username as an argument.",
  );
  process.exit(1);
}

const repos = ghJson<RepoSummary[]>(
  "repo",
  "list",
  owner,
  "--limit",
  "1000",
  "--json",
  "name,description,primaryLanguage,isPrivate,isFork,isArchived,createdAt,pushedAt",
);
if (!repos) {
  console.error(
    "`gh repo list` failed. Is gh installed and authenticated (`gh auth status`)?",
  );
  process.exit(1);
}

// The owner-named repo is the GitHub profile README, not a project.
const candidates = repos.filter(
  (r) => r.name !== owner && (includeForks || !r.isFork),
);
console.log(
  `${repos.length} repos found, analyzing ${candidates.length} (forks ${includeForks ? "included" : "excluded"}).`,
);

function inspect(repo: RepoSummary) {
  const rootFiles = (
    gh("api", `repos/${owner}/${repo.name}/contents`, "--jq", ".[].name") ?? ""
  )
    .split(/\r?\n/)
    .filter(Boolean);
  const files: RepoFiles = {
    rootFiles,
    packageJson: rootFiles.includes("package.json")
      ? parseJson(ghFile(owner as string, repo.name, "package.json"))
      : null,
    requirementsTxt: rootFiles.includes("requirements.txt")
      ? ghFile(owner as string, repo.name, "requirements.txt")
      : null,
    composerJson: rootFiles.includes("composer.json")
      ? parseJson(ghFile(owner as string, repo.name, "composer.json"))
      : null,
  };
  const technologies = detectTechnologies(
    files,
    repo.primaryLanguage?.name ?? null,
  );
  return {
    repo,
    technologies,
    category: classify(technologies, repo.name, repo.description),
  };
}

const analyzed = candidates
  .map(inspect)
  .sort((a, b) => b.repo.pushedAt.localeCompare(a.repo.pushedAt));

const draft = analyzed.map(({ repo, technologies, category }, index) => ({
  // Neutral ids/names on purpose: repo names and descriptions can identify clients.
  // A short hash keeps ids stable between runs without exposing the repo name.
  id: `project-${createHash("sha256").update(`${owner}/${repo.name}`).digest("hex").slice(0, 8)}`,
  name: { es: "TODO", en: "TODO" },
  description: {
    es: "TODO: descripción genérica, sin datos del cliente.",
    en: "TODO: generic description, no client data.",
  },
  category,
  technologies: technologies.length > 0 ? technologies : ["TODO"],
  year: Number(repo.createdAt.slice(0, 4)),
  featured: false,
  visible: false,
  order: index,
  // Review aid only. Ignored by the Zod schema and never copy it into projects.json.
  _source: {
    repo: repo.name,
    visibility: repo.isPrivate ? "private" : "public",
    fork: repo.isFork,
    archived: repo.isArchived,
    githubDescription: repo.description,
    lastPush: repo.pushedAt.slice(0, 10),
  },
}));

writeFileSync(
  new URL("../content/projects.draft.json", import.meta.url),
  `${JSON.stringify(draft, null, 2)}\n`,
);

const counts = new Map<CategoryId, number>();
for (const { category } of analyzed)
  counts.set(category, (counts.get(category) ?? 0) + 1);
console.log("\nProposed categories:");
for (const [category, count] of [...counts].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(3)}  ${category}`);
}
console.log(
  "\nWrote content/projects.draft.json (git-ignored). Review it, then copy entries you want into projects.json.",
);
