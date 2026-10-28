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
  const countFor = (id: string) =>
    id === ALL
      ? projects.length
      : projects.filter((p) => p.category === id).length;

  return (
    <div>
      <fieldset className="m-0 mb-10 flex min-w-0 flex-wrap gap-2 border-0 p-0">
        <legend className="sr-only">{labels.filter}</legend>
        {[{ id: ALL, name: labels.all }, ...categories].map((category) => {
          const selected = active === category.id;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(category.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-sm transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-brand-400 hover:text-foreground",
              )}
            >
              {category.name}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  selected ? "bg-white/20" : "bg-muted",
                )}
              >
                {countFor(category.id)}
              </span>
            </button>
          );
        })}
      </fieldset>
      <p className="sr-only" aria-live="polite">
        {countLabel}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project, index) => {
            const Icon = categoryIcons[project.category] ?? Globe;
            // Featured work gets a wider card; the rhythm repeats so any filter still looks balanced.
            const wide = project.featured && index % 2 === 0;
            return (
              <motion.li
                key={project.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "lg:col-span-2",
                  wide && "sm:col-span-2 lg:col-span-3",
                  project.featured && !wide && "lg:col-span-3",
                )}
              >
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-6 transition duration-200",
                    "hover:-translate-y-0.5 hover:border-brand-700 hover:shadow-brand-950/50 hover:shadow-xl",
                    project.featured &&
                      "bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,var(--color-brand-950),transparent_70%)]",
                  )}
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-950 text-brand-300 ring-1 ring-brand-800/60 transition group-hover:bg-brand-900">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <div className="flex items-center gap-2">
                      {project.featured ? (
                        <Badge>{labels.featured}</Badge>
                      ) : null}
                      <span className="text-muted-foreground text-sm tabular-nums">
                        {project.year}
                      </span>
                    </div>
                  </div>
                  <p className="mb-2 font-medium text-brand-300 text-xs uppercase tracking-[0.12em]">
                    {categoryName(project.category)}
                  </p>
                  <h3 className="font-heading font-semibold text-xl leading-snug">
                    {project.name}
                  </h3>
                  <p className="mt-3 flex-1 text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <Badge variant="secondary">{tech}</Badge>
                      </li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
