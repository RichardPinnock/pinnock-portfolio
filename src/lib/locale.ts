import { defaultLocale, type Locale, locales } from "./schemas/common.ts";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/**
 * Picks the best supported locale from an `Accept-Language` header, honouring q-values and
 * region subtags (`en-GB` matches `en`). Falls back to the default locale.
 */
export function negotiateLocale(
  acceptLanguage: string | null | undefined,
): Locale {
  if (!acceptLanguage) return defaultLocale;

  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return {
        language: tag.trim().toLowerCase().split("-")[0],
        quality: q ? Number(q.slice(2)) : 1,
      };
    })
    .filter((p) => p.language && p.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of preferences) {
    if (hasLocale(language)) return language;
  }
  return defaultLocale;
}

export const otherLocale = (locale: Locale): Locale =>
  locale === "es" ? "en" : "es";
