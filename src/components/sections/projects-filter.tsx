"use client";

import {
  Bot,
  Boxes,
  Globe,
  type LucideIcon,
  Plug,
  Server,
  ShoppingCart,
  Smartphone,
  Store,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectView {
  id: string;
  name: string;
  description: string;
  category: string;
  technologies: string[];
  year: number;
  featured: boolean;
}

export interface ProjectsFilterProps {
  projects: ProjectView[];
  categories: { id: string; name: string }[];
  labels: {
    filter: string;
    all: string;
    count: string;
    countOne: string;
    featured: string;
  };
}

const ALL = "all";

/** Purely presentational, so it lives here and not in /content. */
const categoryIcons: Record<string, LucideIcon> = {
  "web-apps": Globe,
  ecommerce: ShoppingCart,
  "business-systems": Store,
  mobile: Smartphone,
  ai: Bot,
  integrations: Plug,
  "crm-erp": Boxes,
  devops: Server,
};

export function ProjectsFilter({
  projects,
  categories,
  labels,
}: ProjectsFilterProps) {
  const [active, setActive] = useState<string>(ALL);
  const reduceMotion = useReducedMotion();
  const shown =
    active === ALL ? projects : projects.filter((p) => p.category === active);
  const countLabel =
    shown.length === 1
      ? labels.countOne
      : labels.count.replace("{count}", String(shown.length));
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  return (
    <div>
      <fieldset className="m-0 mb-8 flex min-w-0 flex-wrap gap-2 border-0 p-0">
        <legend className="sr-only">{labels.filter}</legend>
        {[{ id: ALL, name: labels.all }, ...categories].map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={active === category.id}
            onClick={() => setActive(category.id)}
            className={cn(
              "h-8 rounded-md border px-3 font-medium text-sm transition-colors",
              active === category.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-brand-400 hover:text-foreground",
            )}
          >
            {category.name}
          </button>
        ))}
      </fieldset>
      <p className="sr-only" aria-live="polite">
        {countLabel}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project) => {
            const Icon = categoryIcons[project.category] ?? Globe;
            return (
              <motion.li
                key={project.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition duration-200 hover:ring-2 hover:ring-muted">
                  {/* No screenshots to show (client work), so the header is a dotted pattern with the category icon. */}
                  <div
                    aria-hidden
                    className="relative flex h-28 items-center justify-center border-border border-b bg-[radial-gradient(circle,var(--color-brand-800)_1px,transparent_1px)] bg-brand-950/60 [background-size:14px_14px]"
                  >
                    <span className="inline-flex size-12 items-center justify-center rounded-md border border-brand-800 bg-background text-brand-300 shadow-lg">
                      <Icon className="size-6" />
                    </span>
                    {project.featured ? (
                      <Badge className="absolute top-3 right-3">
                        {labels.featured}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <h3 className="font-heading font-semibold leading-snug">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {categoryName(project.category)}
                        <span className="tabular-nums"> ({project.year})</span>
                      </p>
                    </div>
                    <p className="flex-1 text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <ul className="flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <li key={tech}>
                          <Badge variant="outline">{tech}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
