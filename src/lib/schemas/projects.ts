import { z } from "zod";
import { localizedString, order, slug } from "./common.ts";

// Deliberately has no `url` or `repo` field: many projects are client work, and nothing
// that could identify a client or a private repository belongs in this file.
export const projectSchema = z.object({
  id: slug,
  name: z.string().min(1),
  description: localizedString,
  /** Must match a category `id` in categories.json (checked in parseContent). */
  category: slug,
  technologies: z.array(z.string().min(1)).min(1),
  year: z.number().int().min(2000).max(2100),
  featured: z.boolean(),
  visible: z.boolean(),
  order,
});

export const projectsSchema = z.array(projectSchema);
export type Project = z.infer<typeof projectSchema>;
