import { describe, expect, it } from "vitest";
import {
  hasLocale,
  negotiateLocale,
  otherLocale,
} from "../../src/lib/locale.ts";
import { alternatesFor, localizedPath } from "../../src/lib/seo.ts";

describe("negotiateLocale", () => {
  it("defaults to Spanish without a header", () => {
    expect(negotiateLocale(null)).toBe("es");
    expect(negotiateLocale("")).toBe("es");
  });

  it("matches regional variants to the base language", () => {
    expect(negotiateLocale("en-GB,en;q=0.9")).toBe("en");
    expect(negotiateLocale("es-CU")).toBe("es");
  });

  it("honours q-values instead of header order", () => {
    expect(negotiateLocale("fr;q=0.9,en;q=0.8,es;q=0.7")).toBe("en");
    expect(negotiateLocale("es;q=0.4,en;q=0.9")).toBe("en");
  });

  it("falls back to Spanish when no supported language is accepted", () => {
    expect(negotiateLocale("fr-FR,de;q=0.8")).toBe("es");
  });

  it("ignores languages with q=0", () => {
    expect(negotiateLocale("en;q=0,es;q=0.5")).toBe("es");
  });
});

describe("locale helpers", () => {
  it("recognizes supported locales only", () => {
    expect(hasLocale("es")).toBe(true);
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("fr")).toBe(false);
    expect(hasLocale("")).toBe(false);
  });

  it("returns the other locale", () => {
    expect(otherLocale("es")).toBe("en");
    expect(otherLocale("en")).toBe("es");
  });
});

describe("alternatesFor", () => {
  it("sets a self canonical and hreflang entries for every locale plus x-default", () => {
    expect(alternatesFor("en")).toEqual({
      canonical: "/en",
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    });
  });

  it("keeps the sub-path in every alternate", () => {
    expect(alternatesFor("es", "/privacy").languages).toEqual({
      es: "/es/privacy",
      en: "/en/privacy",
      "x-default": "/es/privacy",
    });
    expect(localizedPath("en", "/privacy")).toBe("/en/privacy");
  });
});
