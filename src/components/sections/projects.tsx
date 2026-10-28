import { Section } from "@/components/section";
import type { Messages } from "@/i18n/messages";
import { ProjectsFilter } from "./projects-filter";

interface ProjectsProps {
  projects: React.ComponentProps<typeof ProjectsFilter>["projects"];
  categories: React.ComponentProps<typeof ProjectsFilter>["categories"];
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
        }}
      />
    </Section>
  );
}
