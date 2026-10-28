import { z } from "zod";
import { httpsUrl, localizedString } from "./common.ts";

export const socialSchema = z.object({
  network: z.string().min(1),
  url: httpsUrl,
  handle: z.string().min(1),
});

export const languageSchema = z.object({
  code: z.enum(["es", "en"]),
  name: localizedString,
  level: localizedString,
});

export const profileSchema = z.object({
  name: z.string().min(1),
  /** One-sentence introduction used in the hero and as the meta description seed. */
  headline: localizedString,
  role: localizedString,
  /** Paragraphs of the "who I am" section; also the CV summary. */
  bio: z.object({
    es: z.array(z.string().min(1)).min(1),
    en: z.array(z.string().min(1)).min(1),
  }),
  location: z.object({
    city: localizedString.optional(),
    country: localizedString,
    /** ISO 3166-1 alpha-2 and coordinates, used to place the origin point on the globe. */
    countryCode: z.string().length(2),
    coordinates: z.tuple([
      z.number().min(-90).max(90),
      z.number().min(-180).max(180),
    ]),
  }),
  /** ISO 3166-1 alpha-2 codes of client countries, drawn as connections on the globe. */
  clientCountries: z.array(z.string().length(2)),
  email: z.email(),
  agency: z.object({ name: z.string().min(1), url: httpsUrl }),
  socials: z.array(socialSchema),
  languages: z.array(languageSchema).min(1),
});

export type Profile = z.infer<typeof profileSchema>;
