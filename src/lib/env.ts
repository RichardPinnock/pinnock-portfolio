import { z } from "zod";

const envSchema = z.object({
  /** Public canonical URL, without a trailing slash (see .env.example). */
  NEXT_PUBLIC_SITE_URL: z
    .url()
    .default("http://localhost:3000")
    .transform((url) => url.replace(/\/+$/, "")),
});

// NEXT_PUBLIC_* variables are inlined at build time, so each one has to be read literally.
export const env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
});
