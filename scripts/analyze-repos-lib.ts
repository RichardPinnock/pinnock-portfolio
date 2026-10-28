// Pure detection logic for scripts/analyze-repos.ts, kept free of I/O so it can be unit-tested.

export interface RepoFiles {
  /** Names at the repository root. */
  rootFiles: string[];
  packageJson: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  } | null;
  requirementsTxt: string | null;
  composerJson: { require?: Record<string, string> } | null;
}

/** npm dependency name -> display name. */
const NPM_TECHNOLOGIES: Record<string, string> = {
  next: "Next.js",
  react: "React",
  vue: "Vue",
  nuxt: "Nuxt",
  "@angular/core": "Angular",
  vite: "Vite",
  "react-native": "React Native",
  expo: "Expo",
  electron: "Electron",
  "@nestjs/core": "NestJS",
  express: "Express",
  fastify: "Fastify",
  "@trpc/server": "tRPC",
  graphql: "GraphQL",
  prisma: "Prisma",
  "@prisma/client": "Prisma",
  typeorm: "TypeORM",
  "drizzle-orm": "Drizzle",
  mongoose: "MongoDB",
  pg: "PostgreSQL",
  mysql2: "MySQL",
  redis: "Redis",
  ioredis: "Redis",
  bullmq: "BullMQ",
  "socket.io": "Socket.IO",
  tailwindcss: "Tailwind CSS",
  "@vendure/core": "Vendure",
  "@strapi/strapi": "Strapi",
  lucia: "Lucia",
  "next-auth": "Auth.js",
  stripe: "Stripe",
  twilio: "Twilio",
  "whatsapp-web.js": "WhatsApp",
  "@whiskeysockets/baileys": "WhatsApp",
  openai: "OpenAI API",
  langchain: "LangChain",
  typescript: "TypeScript",
};

/** Python package (lowercase, as it appears in requirements.txt) -> display name. */
const PYTHON_TECHNOLOGIES: Record<string, string> = {
  django: "Django",
  flask: "Flask",
  fastapi: "FastAPI",
  openai: "OpenAI API",
  langchain: "LangChain",
  pandas: "pandas",
  sqlalchemy: "SQLAlchemy",
  celery: "Celery",
};

export function detectTechnologies(
  files: RepoFiles,
  primaryLanguage: string | null,
): string[] {
  const found = new Set<string>();

  const npmDeps = {
    ...files.packageJson?.dependencies,
    ...files.packageJson?.devDependencies,
  };
  for (const [dep, name] of Object.entries(NPM_TECHNOLOGIES)) {
    if (dep in npmDeps) found.add(name);
  }

  for (const line of files.requirementsTxt?.split(/\r?\n/) ?? []) {
    const pkg = line
      .split(/[=<>~![;\s]/)[0]
      ?.trim()
      .toLowerCase();
    if (pkg && pkg in PYTHON_TECHNOLOGIES) found.add(PYTHON_TECHNOLOGIES[pkg]);
  }

  if (files.composerJson) found.add("PHP");
  if (
    files.rootFiles.some((f) =>
      /^(Dockerfile|docker-compose\.ya?ml|compose\.ya?ml)$/i.test(f),
    )
  ) {
    found.add("Docker");
  }
  if (files.rootFiles.includes("__manifest__.py")) found.add("Odoo");

  // The language is a fallback for repos without a manifest we understand.
  if (found.size === 0 && primaryLanguage) found.add(primaryLanguage);
  return [...found].sort();
}

export type CategoryId =
  | "web-apps"
  | "ecommerce"
  | "business-systems"
  | "mobile"
  | "ai"
  | "integrations"
  | "crm-erp"
  | "devops"
  | "todo";

const FRONTEND = ["Next.js", "React", "Vue", "Nuxt", "Angular", "Vite"];
const BACKEND = [
  "NestJS",
  "Express",
  "Fastify",
  "FastAPI",
  "Flask",
  "Django",
  "tRPC",
  "GraphQL",
];

/** Matches a whole word even when it is delimited by `_` or `-`, which `\b` would not treat as a boundary. */
const word = (...words: string[]) =>
  new RegExp(`(^|[^a-z])(${words.join("|")})([^a-z]|$)`, "i");

/**
 * First matching rule wins; order encodes priority (e.g. a mobile app is not a "web app").
 * `todo` means "could not tell": it is deliberately not a real category, so a draft entry
 * left unreviewed fails the cross-file validation instead of being published under a guess.
 */
export function classify(
  technologies: string[],
  repoName: string,
  description: string | null,
): CategoryId {
  const has = (...names: string[]) =>
    names.some((n) => technologies.includes(n));
  const text = `${repoName} ${description ?? ""}`;

  if (has("Odoo") || word("odoo", "erp", "crm").test(text)) return "crm-erp";
  if (has("React Native", "Expo")) return "mobile";
  if (has("OpenAI API", "LangChain")) return "ai";
  if (has("WhatsApp", "Twilio")) return "integrations";
  if (has("Stripe", "Vendure") || /commerce|shop|store|cosmetic/i.test(text))
    return "ecommerce";
  // Back-office apps share one shape here: login + database behind a Next.js UI.
  if (
    word("pos").test(text) ||
    (has("Next.js") && has("Prisma") && has("Auth.js") && has("PostgreSQL"))
  )
    return "business-systems";
  if (has(...FRONTEND)) return "web-apps";
  if (has(...BACKEND)) return "integrations";
  if (technologies.length > 0 && technologies.every((t) => t === "Docker"))
    return "devops";
  return "todo";
}
