import { z } from "zod";
import { localizedString, order, slug } from "./common.ts";

export const serviceSchema = z.object({
  id: slug,
  title: localizedString,
  description: localizedString,
  stack: z.array(z.string().min(1)).min(1),
  order,
});

export const servicesSchema = z.array(serviceSchema);
export type Service = z.infer<typeof serviceSchema>;
