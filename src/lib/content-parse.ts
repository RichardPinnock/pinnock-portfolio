import type { z } from "zod";
import { categoriesSchema } from "./schemas/categories.ts";
import { educationSchema } from "./schemas/education.ts";
import { experienceSchema } from "./schemas/experience.ts";
import { profileSchema } from "./schemas/profile.ts";
import { projectsSchema } from "./schemas/projects.ts";
import { servicesSchema } from "./schemas/services.ts";
import { skillsSchema } from "./schemas/skills.ts";

// Relative `.ts` imports keep this module runnable by Node directly (scripts/validate-content.ts)
// as well as by Next.js.

export const contentSchemas = {
  profile: profileSchema,
  services: servicesSchema,
  experience: experienceSchema,
  education: educationSchema,
  projects: projectsSchema,
  categories: categoriesSchema,
  skills: skillsSchema,
} as const;

export type ContentName = keyof typeof contentSchemas;
export type Content = {
  [K in ContentName]: z.infer<(typeof contentSchemas)[K]>;
};
export type RawContent = Record<ContentName, unknown>;

export class ContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentError";
  }
}

function duplicates(ids: string[]): string[] {
  return ids.filter((id, index) => ids.indexOf(id) !== index);
}

/** Validates every content file and the references between them; throws a readable ContentError. */
export function parseContent(raw: RawContent): Content {
  const problems: string[] = [];
  const parsed: Partial<Content> = {};

  for (const name of Object.keys(contentSchemas) as ContentName[]) {
    const result = contentSchemas[name].safeParse(raw[name]);
    if (result.success) {
      (parsed as Record<string, unknown>)[name] = result.data;
      continue;
    }
    for (const issue of result.error.issues) {
      const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      problems.push(`content/${name}.json -> ${path}: ${issue.message}`);
    }
  }

  if (problems.length === 0) {
    const content = parsed as Content;
    const categoryIds = new Set(content.categories.map((c) => c.id));

    for (const [file, items] of [
      ["services", content.services],
      ["experience", content.experience],
      ["education", content.education],
      ["projects", content.projects],
      ["categories", content.categories],
      ["skills", content.skills],
    ] as const) {
      for (const id of new Set(duplicates(items.map((item) => item.id)))) {
        problems.push(`content/${file}.json: duplicate id "${id}"`);
      }
    }

    for (const project of content.projects) {
      if (!categoryIds.has(project.category)) {
        problems.push(
          `content/projects.json -> "${project.id}": unknown category "${project.category}" (known: ${[...categoryIds].join(", ")})`,
        );
      }
    }
  }

  if (problems.length > 0) {
    throw new ContentError(
      `Invalid content:\n${problems.map((p) => `  - ${p}`).join("\n")}`,
    );
  }
  return parsed as Content;
}

/** Paths of string values still containing the `TODO` marker, so placeholders are never forgotten. */
export function findTodos(value: unknown, path = ""): string[] {
  if (typeof value === "string") return /\bTODO\b/.test(value) ? [path] : [];
  if (Array.isArray(value))
    return value.flatMap((item, i) => findTodos(item, `${path}[${i}]`));
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      findTodos(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}
