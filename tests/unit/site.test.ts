import { describe, expect, it } from "vitest";
import en from "../../src/i18n/messages/en.json";
import es from "../../src/i18n/messages/es.json";
import {
  content,
  getEducation,
  getExperience,
  getProfile,
  getProjectsView,
  getServices,
  getSkillGroups,
} from "../../src/lib/content.ts";
import { countryCenters } from "../../src/lib/countries.ts";
import { cvPath } from "../../src/lib/cv.ts";
import { locales } from "../../src/lib/schemas/common.ts";

/** Flattens nested messages into dotted key paths. */
function keys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    keys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("UI messages", () => {
  it("define the same keys in Spanish and English", () => {
    expect(keys(en).sort()).toEqual(keys(es).sort());
  });

  it("have no empty strings", () => {
    for (const messages of [es, en]) {
      expect(JSON.stringify(messages)).not.toContain('""');
    }
  });
});

describe("globe data", () => {
  it("knows the coordinates of every client country in the profile", () => {
    for (const code of content.profile.clientCountries) {
      expect(countryCenters, `missing coordinates for ${code}`).toHaveProperty(
        code,
      );
    }
  });
});

describe("rendered content selectors", () => {
  it.each(locales)("never expose TODO placeholders (%s)", (locale) => {
    const rendered = JSON.stringify({
      profile: getProfile(locale),
      services: getServices(locale),
      experience: getExperience(locale),
      education: getEducation(locale),
      skills: getSkillGroups(locale),
      projects: getProjectsView(locale),
    });
    expect(rendered).not.toMatch(/\bTODO\b/);
  });

  it("derive the stack from the technologies of the published projects", () => {
    const { projects } = getProjectsView("es");
    const [group] = getSkillGroups("es");
    const used = new Set(projects.flatMap((p) => p.technologies));
    expect(group.items.length).toBe(used.size);
    expect(group.items.every((item) => used.has(item))).toBe(true);
  });

  it("only list categories that have visible projects", () => {
    const { projects, categories } = getProjectsView("es");
    const used = new Set(projects.map((p) => p.category));
    expect(categories.every((c) => used.has(c.id))).toBe(true);
  });
});

describe("cvPath", () => {
  it("builds an accent-free, kebab-case file name per locale", () => {
    expect(cvPath("Álvaro Núñez", "es")).toBe("/cv/alvaro-nunez-cv-es.pdf");
    expect(cvPath("Richard Pinnock", "en")).toBe(
      "/cv/richard-pinnock-cv-en.pdf",
    );
  });
});
