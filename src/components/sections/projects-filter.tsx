"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProjectView {
  id: string;
  name: string;
  description: string;
  category: string;
  technologies: string[];
  year: number;
}

interface ProjectsFilterProps {
  projects: ProjectView[];
  categories: { id: string; name: string }[];
  labels: { filter: string; all: string; count: string; countOne: string };
}

const ALL = "all";

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
              "rounded-full border px-4 py-2 font-medium text-sm transition-colors",
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
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((project) => (
            <motion.li
              key={project.id}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardDescription>
                    {categories.find((c) => c.id === project.category)?.name} ·{" "}
                    {project.year}
                  </CardDescription>
                  <CardTitle className="font-heading text-xl">
                    <h3>{project.name}</h3>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <li key={tech}>
                        <Badge variant="secondary">{tech}</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
