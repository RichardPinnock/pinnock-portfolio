import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { locales } from "@/lib/schemas/common";
import { alternatesFor } from "@/lib/seo";

const absolute = (path: string) => `${env.NEXT_PUBLIC_SITE_URL}${path}`;

// One entry per locale, each declaring its alternates, so crawlers see the whole language cluster.
// No `lastModified`: there is no honest per-page date to report for a statically built site.
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => {
    const { canonical, languages } = alternatesFor(locale);
    return {
      url: absolute(canonical),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(languages).map(([lang, path]) => [
            lang,
            absolute(path),
          ]),
        ),
      },
    };
  });
}
