import { renderToBuffer } from "@react-pdf/renderer";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import { describe, expect, it } from "vitest";
import { CvDocument } from "../../src/cv/cv-document.tsx";
import { type CvData, getCvData } from "../../src/cv/cv-model.ts";
import { cvLabels } from "../../src/cv/labels.ts";
import { locales } from "../../src/lib/schemas/common.ts";

interface Extracted {
  text: string;
  pages: number;
  /** Distinct x positions where a line of text starts, per page (a layout column fingerprint). */
  lineStarts: Set<number>;
  info: Record<string, string>;
  raw: string;
}

/** Reads the PDF the way an applicant tracking system does: plain text in reading order. */
async function extract(data: CvData): Promise<Extracted> {
  const buffer = await renderToBuffer(<CvDocument data={data} />);
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: false,
  }).promise;

  let text = "";
  const lineStarts = new Set<number>();
  for (let n = 1; n <= doc.numPages; n++) {
    const content = await (await doc.getPage(n)).getTextContent();
    let startOfLine = true;
    for (const item of content.items) {
      if (!("str" in item)) continue;
      if (startOfLine && item.str.trim()) {
        lineStarts.add(Math.round(item.transform[4]));
        startOfLine = false;
      }
      text += item.str;
      if (item.hasEOL) {
        text += "\n";
        startOfLine = true;
      }
    }
    text += "\n";
  }
  const meta = await doc.getMetadata();
  return {
    text,
    pages: doc.numPages,
    lineStarts,
    info: meta.info as Record<string, string>,
    raw: Buffer.from(buffer).toString("latin1"),
  };
}

const fixture = (locale: CvData["locale"]): CvData => ({
  locale,
  name: "Ada Example",
  role: "Software engineer",
  contact: {
    email: "ada@example.com",
    location: "Havana, Cuba",
    links: [{ label: "GitHub", url: "https://github.com/ada-example" }],
  },
  summary: ["Builds reliable software for distributed teams."],
  experience: [
    {
      role: "Senior engineer",
      company: "Example Corp",
      location: "Remote",
      start: "2021-03",
      end: null,
      summary: "Led the migration of a legacy platform.",
      highlights: ["Reduced deploy time by half.", "Mentored four developers."],
      technologies: ["TypeScript", "PostgreSQL"],
    },
    {
      role: "Engineer",
      company: "Sample Ltd",
      location: null,
      start: "2018-01",
      end: "2021-02",
      summary: "Built internal tools.",
      highlights: [],
      technologies: ["React"],
    },
  ],
  projects: [
    {
      name: "Inventory system",
      year: 2024,
      description: "Stock management for a small retailer.",
      technologies: ["Next.js", "Prisma"],
    },
  ],
  skills: [
    { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
    { group: "DevOps", items: ["Docker", "GitHub Actions"] },
  ],
  education: [
    {
      title: "BSc Computer Science",
      institution: "Example University",
      start: "2013-09",
      end: "2018-06",
    },
  ],
  languages: [{ name: "Spanish", level: "Native" }],
});

describe.each(locales)("CV PDF (%s)", (locale) => {
  const labels = cvLabels[locale];

  it("lists the standard sections in a linear reading order", async () => {
    const { text } = await extract(fixture(locale));
    const order = [
      labels.summary,
      labels.experience,
      labels.projects,
      labels.skills,
      labels.education,
      labels.languages,
    ].map((heading) => text.indexOf(heading));

    expect(order.every((index) => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("keeps contact details in the body, before the first section", async () => {
    const { text } = await extract(fixture(locale));
    expect(text.indexOf("ada@example.com")).toBeGreaterThanOrEqual(0);
    expect(text.indexOf("ada@example.com")).toBeLessThan(
      text.indexOf(labels.summary),
    );
  });

  it("uses MM/YYYY dates and a localized 'present' for open positions", async () => {
    const { text } = await extract(fixture(locale));
    expect(text).toContain("03/2021");
    expect(text).toContain(labels.present);
    expect(text).not.toMatch(/\b\d{4}-\d{2}\b/);
  });

  it("is one column and at most two pages", async () => {
    const { pages, lineStarts } = await extract(fixture(locale));
    expect(pages).toBeLessThanOrEqual(2);
    // Left margin plus the bullet indent: a second column would add a start far to the right.
    expect(Math.max(...lineStarts)).toBeLessThan(80);
  });

  it("fills in metadata, document language and an embedded font", async () => {
    const { info, raw } = await extract(fixture(locale));
    expect(info.Title).toContain("Ada Example");
    expect(info.Author).toBe("Ada Example");
    expect(info.Subject).toBe(labels.subject);
    expect(info.Keywords).toContain("TypeScript");
    expect(raw).toContain(`/Lang (${locale})`);
    expect(raw).toMatch(/\/BaseFont\s*\/[A-Z]{6}\+Inter/);
  });

  it("renders the real content without placeholders", async () => {
    const { text, pages } = await extract(getCvData(locale));
    expect(text).not.toMatch(/\bTODO\b/);
    expect(text).toContain("@");
    expect(pages).toBeLessThanOrEqual(2);
  });
});
