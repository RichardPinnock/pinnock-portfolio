import type { Locale } from "../lib/schemas/common.ts";

/** Standard section names, because applicant tracking systems look for exactly these. */
export const cvLabels: Record<
  Locale,
  {
    summary: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    languages: string;
    present: string;
    subject: string;
  }
> = {
  es: {
    summary: "Resumen",
    experience: "Experiencia",
    projects: "Proyectos",
    skills: "Habilidades",
    education: "Formación",
    languages: "Idiomas",
    present: "Actualidad",
    subject: "Currículum vitae",
  },
  en: {
    summary: "Summary",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
    languages: "Languages",
    present: "Present",
    subject: "Curriculum vitae",
  },
};
