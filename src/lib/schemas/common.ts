import { z } from "zod";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

/** A user-facing string that must exist in every supported locale. */
export const localizedString = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});
export type LocalizedString = z.infer<typeof localizedString>;

/** Kebab-case identifier, stable enough to be used in URLs and as a React key. */
export const slug = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "must be kebab-case (a-z, 0-9, hyphens)",
  );

/** Calendar month as `YYYY-MM`; rendered as `MM/YYYY` in the CV. */
export const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "must be YYYY-MM");

export const httpsUrl = z.url({ protocol: /^https$/ });

export const order = z.number().int().nonnegative();
