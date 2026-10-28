// Generates the CV PDFs (one per locale) into public/cv/ from the same JSON as the website.
// Runs before every build (see `prebuild`); the output is git-ignored.
import { mkdirSync, writeFileSync } from "node:fs";
import { renderToBuffer } from "@react-pdf/renderer";
import { CvDocument } from "../src/cv/cv-document.tsx";
import { getCvData } from "../src/cv/cv-model.ts";
import { content } from "../src/lib/content.ts";
import { cvPath } from "../src/lib/cv.ts";
import { locales } from "../src/lib/schemas/common.ts";

const outDir = new URL("../public/cv/", import.meta.url);
mkdirSync(outDir, { recursive: true });

for (const locale of locales) {
  const buffer = await renderToBuffer(<CvDocument data={getCvData(locale)} />);
  const publicPath = cvPath(content.profile.name, locale);
  writeFileSync(new URL(`../public${publicPath}`, import.meta.url), buffer);
  console.log(`public${publicPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}
