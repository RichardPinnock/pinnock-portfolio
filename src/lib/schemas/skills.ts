import { z } from "zod";
import { localizedString, order, slug } from "./common.ts";

export const skillGroupSchema = z.object({
  id: slug,
  name: localizedString,
  /** Plain keyword list: also rendered as text in the ATS-friendly CV. */
  items: z.array(z.string().min(1)).min(1),
  order,
});

export const skillsSchema = z.array(skillGroupSchema);
export type SkillGroup = z.infer<typeof skillGroupSchema>;
