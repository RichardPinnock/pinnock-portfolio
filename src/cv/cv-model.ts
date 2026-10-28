import {
  getEducation,
  getExperience,
  getProfile,
  getProjectsView,
  getSkillGroups,
} from "../lib/content.ts";
import type { Locale } from "../lib/schemas/common.ts";

/** Everything the CV renders, already localized and free of placeholders. */
export interface CvData {
  locale: Locale;
  name: string;
  role: string;
  contact: {
    email: string;
    /** International format, shown in the CV body for recruiters. */
    phone?: string;
    location: string;
    links: { label: string; url: string }[];
  };
  summary: string[];
  experience: {
    role: string;
    company: string;
    location: string | null;
    start: string;
    end: string | null;
    summary: string;
    highlights: string[];
    technologies: string[];
  }[];
  projects: {
    name: string;
    year: number;
    description: string;
    technologies: string[];
  }[];
  skills: { group: string; items: string[] }[];
  education: {
    title: string;
    institution: string;
    start: string;
    end: string | null;
  }[];
  languages: { name: string; level: string }[];
}

/** Single source of truth: the CV is built from the same JSON as the website. */
export function getCvData(locale: Locale): CvData {
  const profile = getProfile(locale);
  return {
    locale,
    name: profile.name,
    role: profile.role,
    contact: {
      email: profile.email,
      phone: profile.whatsapp,
      location: profile.city
        ? `${profile.city}, ${profile.country}`
        : profile.country,
      links: profile.socials.map((s) => ({ label: s.network, url: s.url })),
    },
    summary: profile.bio,
    experience: getExperience(locale).map((item) => ({
      role: item.role,
      company: item.company,
      location: item.location,
      start: item.start,
      end: item.end,
      summary: item.summary,
      highlights: item.highlights,
      technologies: item.technologies,
    })),
    projects: getProjectsView(locale).projects.map((p) => ({
      name: p.name,
      year: p.year,
      description: p.description,
      technologies: p.technologies,
    })),
    skills: getSkillGroups(locale).map((g) => ({
      group: g.name,
      items: g.items,
    })),
    education: getEducation(locale),
    languages: profile.languages.map((l) => ({
      name: l.name,
      level: l.level,
    })),
  };
}
