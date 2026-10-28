import { fileURLToPath } from "node:url";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ReactNode } from "react";
import type { CvData } from "./cv-model.ts";
import { cvLabels } from "./labels.ts";

// ATS-friendly by construction: one column, real text, standard headings, no tables, icons,
// images, skill bars, headers/footers or backgrounds. The only decoration is a heading accent.

const fontFile = (weight: 400 | 600 | 700) =>
  fileURLToPath(
    new URL(
      `../../node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`,
      import.meta.url,
    ),
  );

Font.register({
  family: "Inter",
  fonts: [
    { src: fontFile(400), fontWeight: 400 },
    { src: fontFile(600), fontWeight: 600 },
    { src: fontFile(700), fontWeight: 700 },
  ],
});
// Never hyphenate: soft hyphens would split words in the text an ATS extracts.
Font.registerHyphenationCallback((word) => [word]);

const ACCENT = "#4f46c8";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    lineHeight: 1.4,
    color: "#1a1a1a",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 46,
  },
  // Explicit line heights: the page-level one is not scaled for the larger sizes and the lines overlap.
  name: { fontSize: 22, fontWeight: 700, lineHeight: 1.2 },
  role: { fontSize: 11.5, lineHeight: 1.3, marginTop: 3 },
  contact: { marginTop: 6, color: "#333333" },
  heading: {
    fontSize: 12,
    fontWeight: 700,
    color: ACCENT,
    marginTop: 16,
    marginBottom: 5,
  },
  entry: { marginBottom: 8 },
  entryTitle: { fontWeight: 600 },
  meta: { color: "#444444" },
  paragraph: { marginBottom: 4 },
  bullet: { marginLeft: 10 },
});

/** `2024-05` -> `05/2024` */
const formatMonth = (value: string) => `${value.slice(5)}/${value.slice(0, 4)}`;

function dateRange(start: string, end: string | null, present: string): string {
  return `${formatMonth(start)} - ${end ? formatMonth(end) : present}`;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View>
      <Text style={styles.heading}>{title}</Text>
      {children}
    </View>
  );
}

export function CvDocument({ data }: { data: CvData }) {
  const t = cvLabels[data.locale];
  const keywords = [
    ...new Set([
      ...data.skills.flatMap((g) => g.items),
      ...data.experience.flatMap((e) => e.technologies),
    ]),
  ].join(", ");

  return (
    <Document
      title={`${data.name} - ${data.role}`}
      author={data.name}
      subject={t.subject}
      keywords={keywords}
      creator={data.name}
      producer={data.name}
      language={data.locale}
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.role}>{data.role}</Text>
        {/* Contact details live in the body, never in a page header or footer. */}
        <Text style={styles.contact}>
          {[
            data.contact.email,
            data.contact.location,
            ...data.contact.links.map((l) => l.url.replace(/^https:\/\//, "")),
          ].join(" | ")}
        </Text>

        {data.summary.length > 0 ? (
          <Section title={t.summary}>
            {data.summary.map((paragraph) => (
              <Text key={paragraph} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </Section>
        ) : null}

        {data.experience.length > 0 ? (
          <Section title={t.experience}>
            {data.experience.map((item) => (
              <View
                key={`${item.company}-${item.start}`}
                style={styles.entry}
                wrap={false}
              >
                <Text style={styles.entryTitle}>
                  {item.role} - {item.company}
                </Text>
                <Text style={styles.meta}>
                  {dateRange(item.start, item.end, t.present)}
                  {item.location ? ` | ${item.location}` : ""}
                </Text>
                <Text>{item.summary}</Text>
                {item.highlights.map((highlight) => (
                  <Text key={highlight} style={styles.bullet}>
                    - {highlight}
                  </Text>
                ))}
                {item.technologies.length > 0 ? (
                  <Text style={styles.meta}>
                    {item.technologies.join(", ")}
                  </Text>
                ) : null}
              </View>
            ))}
          </Section>
        ) : null}

        {data.projects.length > 0 ? (
          <Section title={t.projects}>
            {data.projects.map((project) => (
              <View key={project.name} style={styles.entry} wrap={false}>
                <Text style={styles.entryTitle}>
                  {project.name} ({project.year})
                </Text>
                <Text>{project.description}</Text>
                {project.technologies.length > 0 ? (
                  <Text style={styles.meta}>
                    {project.technologies.join(", ")}
                  </Text>
                ) : null}
              </View>
            ))}
          </Section>
        ) : null}

        {data.skills.length > 0 ? (
          <Section title={t.skills}>
            {data.skills.map((group) => (
              <Text key={group.items.join()} style={styles.paragraph}>
                {group.group ? `${group.group}: ` : ""}
                {group.items.join(", ")}
              </Text>
            ))}
          </Section>
        ) : null}

        {data.education.length > 0 ? (
          <Section title={t.education}>
            {data.education.map((item) => (
              <View
                key={`${item.institution}-${item.start}`}
                style={styles.entry}
                wrap={false}
              >
                <Text style={styles.entryTitle}>
                  {item.title} - {item.institution}
                </Text>
                <Text style={styles.meta}>
                  {dateRange(item.start, item.end, t.present)}
                </Text>
              </View>
            ))}
          </Section>
        ) : null}

        {data.languages.length > 0 ? (
          <Section title={t.languages}>
            {data.languages.map((language) => (
              <Text key={language.name}>
                {language.name}: {language.level}
              </Text>
            ))}
          </Section>
        ) : null}
      </Page>
    </Document>
  );
}
