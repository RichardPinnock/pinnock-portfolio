import { defaultLocale, type Locale, locales } from "./schemas/common.ts";

/** Path of a page in a given locale; `path` is the part after the locale segment ("" for the home page). */
export const localizedPath = (locale: Locale, path = "") => `/${locale}${path}`;

/**
 * `canonical` plus `hreflang` alternates for one page. Paths are relative so they resolve against
 * `metadataBase`. `x-default` points at the default locale: `/` only redirects by Accept-Language.
 */
export function alternatesFor(locale: Locale, path = "") {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localizedPath(l, path)])),
      "x-default": localizedPath(defaultLocale, path),
    },
  };
}
