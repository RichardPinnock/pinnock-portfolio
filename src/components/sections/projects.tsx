import dynamic from "next/dynamic";
import { Section } from "@/components/section";
import type { Messages } from "@/i18n/messages";
import type { ProjectsFilterProps } from "./projects-filter";

// Split into its own chunk: it pulls in Motion, which the rest of the page does not need, and it is
// only downloaded when there is at least one visible project to filter.
const ProjectsFilter = dynamic(() =>
  import("./projects-filter").then((module) => module.ProjectsFilter),
);

interface ProjectsProps {
  projects: ProjectsFilterProps["projects"];
  categories: ProjectsFilterProps["categories"];
  messages: Messages["projects"];
}

export function Projects({ projects, categories, messages }: ProjectsProps) {
  return (
    <Section id="projects" eyebrow={messages.eyebrow} title={messages.title}>
      <ProjectsFilter
        projects={projects}
        categories={categories}
        labels={{
          filter: messages.filterLabel,
          all: messages.all,
          count: messages.count,
          countOne: messages.countOne,
          featured: messages.featured,
        }}
      />
    </Section>
  );
}
