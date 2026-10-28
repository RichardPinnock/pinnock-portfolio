import { content, getProfile } from "./content.ts";
import { type Locale, locales } from "./schemas/common.ts";

/**
 * schema.org graph for the home page of one locale: Person, WebSite, ProfilePage and BreadcrumbList,
 * linked by `@id` so crawlers see a single entity instead of four unrelated blobs.
 */
export function buildJsonLd(
  locale: Locale,
  siteUrl: string,
  homeLabel: string,
) {
  const profile = getProfile(locale);
  const pageUrl = `${siteUrl}/${locale}`;
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        jobTitle: profile.role,
        description: profile.headline,
        url: pageUrl,
        email: `mailto:${profile.email}`,
        address: {
          "@type": "PostalAddress",
          addressCountry: content.profile.location.countryCode,
        },
        knowsLanguage: profile.languages.map((l) => l.code),
        worksFor: {
          "@type": "Organization",
          name: profile.agency.name,
          url: profile.agency.url,
        },
        sameAs: profile.socials.map((s) => s.url),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: profile.name,
        inLanguage: [...locales],
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        name: `${profile.name} · ${profile.role}`,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeLabel, item: pageUrl },
        ],
      },
    ],
  };
}
