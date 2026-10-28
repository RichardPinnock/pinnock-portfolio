import { z } from "zod";
import { localizedString, order, slug, yearMonth } from "./common.ts";

export const educationItemSchema = z
  .object({
    id: slug,
    title: localizedString,
    institution: z.string().min(1),
    start: yearMonth,
    /** `null` means still in progress. */
    end: yearMonth.nullable(),
    visible: z.boolean(),
    order,
  })
  .refine((item) => item.end === null || item.end >= item.start, {
    message: "end must not be earlier than start",
    path: ["end"],
  });

export const educationSchema = z.array(educationItemSchema);
export type EducationItem = z.infer<typeof educationItemSchema>;
