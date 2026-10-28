import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import type { Messages } from "@/i18n/messages";

interface ExperienceProps {
  items: {
    id: string;
    role: string;
    company: string;
    location: string | null;
    start: string;
    end: string | null;
    summary: string;
    highlights: string[];
    technologies: string[];
  }[];
  messages: Messages["experience"];
}

/** `2024-05` -> `05/2024`, the same format the CV uses. */
const formatMonth = (value: string) => `${value.slice(5)}/${value.slice(0, 4)}`;

export function Experience({ items, messages }: ExperienceProps) {
  return (
    <Section id="experience" title={messages.title}>
      <ul className="flex flex-col gap-8">
        {items.map((item) => (
          <li key={item.id} className="reveal">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-heading font-semibold text-lg">
                {item.company}
              </h3>
              <p className="shrink-0 text-muted-foreground text-xs tabular-nums">
                <time dateTime={item.start}>{formatMonth(item.start)}</time>
                {" - "}
                {item.end ? (
                  <time dateTime={item.end}>{formatMonth(item.end)}</time>
                ) : (
                  messages.present
                )}
              </p>
            </div>
            <p className="text-muted-foreground text-sm">
              {item.role}
              {item.location ? `, ${item.location}` : ""}
            </p>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              {item.summary}
            </p>
            {item.highlights.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground text-sm">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
            {item.technologies.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {item.technologies.map((tech) => (
                  <li key={tech}>
                    <Badge variant="outline">{tech}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
