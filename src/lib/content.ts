import categories from "../../content/categories.json";
import experience from "../../content/experience.json";
import profile from "../../content/profile.json";
import projects from "../../content/projects.json";
import services from "../../content/services.json";
import skills from "../../content/skills.json";
import { type Content, parseContent } from "./content-parse.ts";
import type { Locale, LocalizedString } from "./schemas/common.ts";

// Parsed once per process; an invalid JSON file fails the build with a ContentError.
export const content: Content = parseContent({
  profile,
  services,
  experience,
  projects,
  categories,
  skills,
});

export function localize(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

/** Visible projects ordered by their `order` field. */
export function getVisibleProjects(): Content["projects"] {
  return content.projects
    .filter((p) => p.visible)
    .toSorted((a, b) => a.order - b.order);
}
