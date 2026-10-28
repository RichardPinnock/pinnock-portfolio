import {
  ClipboardList,
  Code2,
  LayoutDashboard,
  type LucideIcon,
  Network,
  Server,
  Sparkles,
} from "lucide-react";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";

interface ServicesProps {
  services: {
    id: string;
    title: string;
    description: string;
    stack: string[];
  }[];
  messages: Messages["services"];
}

/** Purely presentational, so it lives here and not in /content. Unknown ids fall back to a generic icon. */
const serviceIcons: Record<string, LucideIcon> = {
  "custom-development": Code2,
  frontend: LayoutDashboard,
  architecture: Network,
  devops: Server,
  "project-management": ClipboardList,
};

export function Services({ services, messages }: ServicesProps) {
  return (
    <Section id="services" title={messages.title}>
      <BentoGrid className="max-w-none gap-3 md:auto-rows-auto md:grid-cols-2">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.id] ?? Sparkles;
          return (
            <BentoGridItem
              key={service.id}
              // The first card spans both columns: 5 services fill a 2-column grid with no empty cell.
              className={cn("reveal", index === 0 && "md:col-span-2")}
              icon={
                <span className="inline-flex size-10 items-center justify-center rounded-md bg-brand-950 text-brand-300 ring-1 ring-brand-800/60">
                  <Icon aria-hidden className="size-5" />
                </span>
              }
              title={<h3 className="font-heading text-lg">{service.title}</h3>}
              description={
                <>
                  {service.description}
                  {service.stack.length > 0 ? (
                    <>
                      <span className="sr-only"> {messages.stack}:</span>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {service.stack.map((tech) => (
                          <li key={tech}>
                            <Badge variant="secondary">{tech}</Badge>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </>
              }
            />
          );
        })}
      </BentoGrid>
    </Section>
  );
}
