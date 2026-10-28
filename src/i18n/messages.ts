import type { Locale } from "../lib/schemas/common.ts";
import en from "./messages/en.json";
import es from "./messages/es.json";

/** Spanish is the source of truth for the shape; the test suite checks that English matches it. */
export type Messages = typeof es;

const messages: Record<Locale, Messages> = { es, en };

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ""),
  );
}
