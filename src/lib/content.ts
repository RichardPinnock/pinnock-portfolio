import categories from "../../content/categories.json";
import education from "../../content/education.json";
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
  education,
  projects,
  categories,
  skills,
});

export function localize(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

/** Draft content keeps `TODO` markers; they must never reach the rendered site. */
const isPlaceholder = (value: string) => /^TODO\b/.test(value);
const real = (values: string[]) => values.filter((v) => !isPlaceholder(v));

const byOrder = <T extends { order: number }>(items: T[]) =>
  items.toSorted((a, b) => a.order - b.order);

export function getProfile(locale: Locale) {
  const { profile: p } = content;
  return {
    name: p.name,
    headline: localize(p.headline, locale),
    role: localize(p.role, locale),
    bio: real(p.bio[locale]),
    country: localize(p.location.country, locale),
    city: p.location.city ? localize(p.location.city, locale) : null,
    email: p.email,
    agency: p.agency,
    repositoryUrl: p.repositoryUrl,
    socials: p.socials,
    languages: p.languages
      .filter((l) => !isPlaceholder(localize(l.level, locale)))
      .map((l) => ({
        code: l.code,
        name: localize(l.name, locale),
        level: localize(l.level, locale),
      })),
    origin: p.location.coordinates,
    clientCountries: p.clientCountries,
  };
}

export function getServices(locale: Locale) {
  return byOrder(content.services).map((s) => ({
    id: s.id,
    title: localize(s.title, locale),
    description: localize(s.description, locale),
    stack: real(s.stack),
  }));
}

export function getExperience(locale: Locale) {
  return byOrder(content.experience)
    .filter((item) => item.visible && !isPlaceholder(item.company))
    .map((item) => ({
      id: item.id,
      role: localize(item.role, locale),
      company: item.company,
      location: item.location ? localize(item.location, locale) : null,
      start: item.start,
      end: item.end,
      summary: localize(item.summary, locale),
      highlights: item.highlights.map((h) => localize(h, locale)),
      technologies: real(item.technologies),
    }));
}

/**
 * Skills written by hand in skills.json win. Until there are any, the stack is derived from the
 * technologies of the published projects (most used first), so nothing is invented. A derived group has
 * an empty `name`: the UI renders it as one flat list.
 */
export function getSkillGroups(locale: Locale) {
  const authored = byOrder(content.skills)
    .map((group) => ({
      id: group.id,
      name: localize(group.name, locale),
      items: real(group.items),
    }))
    .filter((group) => group.items.length > 0);
  if (authored.length > 0) return authored;

  const counts = new Map<string, number>();
  for (const project of getProjectsView(locale).projects) {
    for (const tech of project.technologies) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  const items = [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tech]) => tech);
  return items.length > 0 ? [{ id: "from-projects", name: "", items }] : [];
}

export function getProjectsView(locale: Locale) {
  const visible = byOrder(content.projects)
    .filter((p) => p.visible && !isPlaceholder(localize(p.name, locale)))
    .map((p) => ({
      id: p.id,
      name: localize(p.name, locale),
      description: localize(p.description, locale),
      category: p.category,
      technologies: real(p.technologies),
      year: p.year,
      featured: p.featured,
    }));
  const used = new Set(visible.map((p) => p.category));
  const filters = byOrder(content.categories)
    .filter((c) => used.has(c.id))
    .map((c) => ({ id: c.id, name: localize(c.name, locale) }));
  return { projects: visible, categories: filters };
}

export function getEducation(locale: Locale) {
  return byOrder(content.education)
    .filter((item) => item.visible && !isPlaceholder(item.institution))
    .map((item) => ({
      id: item.id,
      title: localize(item.title, locale),
      institution: item.institution,
      start: item.start,
      end: item.end,
    }));
}
