import type { Locale } from "./schemas/common.ts";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Public path of the generated CV PDF; the generator in phase 8 writes to the same name. */
export function cvPath(name: string, locale: Locale): string {
  return `/cv/${slugify(name)}-cv-${locale}.pdf`;
}
