import { describe, expect, it } from "vitest";
import { initials } from "../../src/lib/brand.ts";
import { buildJsonLd } from "../../src/lib/json-ld.ts";
import { locales } from "../../src/lib/schemas/common.ts";

const SITE = "https://example.com";

describe.each(locales)("JSON-LD (%s)", (locale) => {
  type Node = { "@type": string; [key: string]: unknown };
  const graph = buildJsonLd(locale, SITE, "Home")["@graph"] as Node[];
  const byType = (type: string) => graph.find((node) => node["@type"] === type);

  it("includes Person, WebSite, ProfilePage and BreadcrumbList", () => {
    expect(graph.map((node) => node["@type"]).sort()).toEqual([
      "BreadcrumbList",
      "Person",
      "ProfilePage",
      "WebSite",
    ]);
  });

  it("links the page, the site and the person by @id", () => {
    const person = byType("Person");
    const page = byType("ProfilePage");
    const site = byType("WebSite");
    expect(page?.mainEntity).toEqual({ "@id": person?.["@id"] });
    expect(page?.isPartOf).toEqual({ "@id": site?.["@id"] });
    expect(site?.publisher).toEqual({ "@id": person?.["@id"] });
  });

  it("points the page and the breadcrumb at the localized URL", () => {
    expect(byType("ProfilePage")?.url).toBe(`${SITE}/${locale}`);
    expect(byType("ProfilePage")?.inLanguage).toBe(locale);
    expect(
      (byType("BreadcrumbList")?.itemListElement as { item: string }[])[0].item,
    ).toBe(`${SITE}/${locale}`);
  });

  it("lists the social profiles as sameAs and never leaks placeholders", () => {
    expect((byType("Person")?.sameAs as string[]).length).toBeGreaterThan(0);
    expect(JSON.stringify(graph)).not.toMatch(/\bTODO\b/);
  });
});

describe("initials", () => {
  it("uses the first letters of the first two words", () => {
    expect(initials("Richard Pinnock")).toBe("RP");
    expect(initials("ada")).toBe("A");
    expect(initials("Ana María López")).toBe("AM");
  });
});
