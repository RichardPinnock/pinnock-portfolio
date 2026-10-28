import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ContentError,
  type ContentName,
  contentSchemas,
  findTodos,
  parseContent,
  type RawContent,
} from "../../src/lib/content-parse.ts";

function loadRaw(): RawContent {
  const raw = {} as RawContent;
  for (const name of Object.keys(contentSchemas) as ContentName[]) {
    raw[name] = JSON.parse(readFileSync(`content/${name}.json`, "utf8"));
  }
  return raw;
}

/** Deep copy so each test can mutate its own fixture. */
function fixture(): RawContent {
  return structuredClone(loadRaw());
}

describe("content files", () => {
  it("are valid against their schemas", () => {
    expect(() => parseContent(loadRaw())).not.toThrow();
  });

  it("never expose repository or client URLs in projects", () => {
    const raw = loadRaw();
    for (const project of raw.projects as Record<string, unknown>[]) {
      expect(Object.keys(project)).not.toContain("url");
      expect(Object.keys(project)).not.toContain("repo");
    }
  });
});

describe("parseContent", () => {
  it("rejects a project whose category does not exist", () => {
    const raw = fixture();
    (raw.projects as { category: string }[])[0].category = "nope";
    expect(() => parseContent(raw)).toThrow(/unknown category "nope"/);
  });

  it("rejects duplicate ids", () => {
    const raw = fixture();
    const services = raw.services as { id: string }[];
    services.push({ ...services[0] } as never);
    expect(() => parseContent(raw)).toThrow(
      /duplicate id "custom-development"/,
    );
  });

  it("reports the file and field of the first problem", () => {
    const raw = fixture();
    (raw.profile as { email: string }).email = "not-an-email";
    expect(() => parseContent(raw)).toThrow(ContentError);
    expect(() => parseContent(raw)).toThrow(/content\/profile\.json -> email/);
  });

  it("requires every localized string in both languages", () => {
    const raw = fixture();
    (raw.profile as { headline: { en: string } }).headline.en = "";
    expect(() => parseContent(raw)).toThrow(
      /content\/profile\.json -> headline\.en/,
    );
  });

  it("rejects a WhatsApp number that is not in international format", () => {
    const raw = fixture();
    (raw.profile as { whatsapp: string }).whatsapp = "54687716";
    expect(() => parseContent(raw)).toThrow(
      /content\/profile\.json -> whatsapp/,
    );
  });

  it("rejects non-https social links", () => {
    const raw = fixture();
    (raw.profile as { socials: { url: string }[] }).socials[0].url =
      "http://example.com";
    expect(() => parseContent(raw)).toThrow(
      /content\/profile\.json -> socials\.0\.url/,
    );
  });

  it("rejects experience that ends before it starts", () => {
    const raw = fixture();
    const item = (raw.experience as { start: string; end: string | null }[])[0];
    item.start = "2024-05";
    item.end = "2023-01";
    expect(() => parseContent(raw)).toThrow(
      /end must not be earlier than start/,
    );
  });

  it("rejects dates that are not YYYY-MM", () => {
    const raw = fixture();
    (raw.experience as { start: string }[])[0].start = "05/2024";
    expect(() => parseContent(raw)).toThrow(/must be YYYY-MM/);
  });
});

describe("findTodos", () => {
  it("returns the paths of strings containing TODO", () => {
    expect(
      findTodos({ a: "ok", b: ["x", "TODO: fill"], c: { d: "TODO" } }),
    ).toEqual(["b[1]", "c.d"]);
  });

  it("ignores words that merely contain todo", () => {
    expect(findTodos({ a: "mastodon", b: "Todoist" })).toEqual([]);
  });
});
