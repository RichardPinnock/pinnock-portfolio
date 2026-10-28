import { z } from "zod";
import { localizedString, order, slug } from "./common.ts";

export const categorySchema = z.object({
  id: slug,
  name: localizedString,
  order,
});

export const categoriesSchema = z.array(categorySchema);
export type Category = z.infer<typeof categorySchema>;
