import { z } from "zod";
import { localizedString, order, slug, yearMonth } from "./common.ts";

export const experienceItemSchema = z
  .object({
    id: slug,
    role: localizedString,
    company: z.string().min(1),
    location: localizedString.optional(),
    start: yearMonth,
    /** `null` means the position is current. */
    end: yearMonth.nullable(),
    summary: localizedString,
    highlights: z.array(localizedString),
    technologies: z.array(z.string().min(1)),
    visible: z.boolean(),
    order,
  })
  .refine((item) => item.end === null || item.end >= item.start, {
    message: "end must not be earlier than start",
    path: ["end"],
  });

export const experienceSchema = z.array(experienceItemSchema);
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
