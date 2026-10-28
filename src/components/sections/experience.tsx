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
    <Section id="experience" eyebrow={messages.eyebrow} title={messages.title}>
      <ol className="relative space-y-10 border-border border-l pl-6 sm:pl-8">
        {items.map((item) => (
          <li key={item.id} className="reveal relative">
            <span
              aria-hidden
              className="absolute top-2 -left-[1.9rem] size-3 rounded-full border-2 border-brand-400 bg-background sm:-left-[2.4rem]"
            />
            <p className="text-muted-foreground text-sm">
              <time dateTime={item.start}>{formatMonth(item.start)}</time>
              {" – "}
              {item.end ? (
                <time dateTime={item.end}>{formatMonth(item.end)}</time>
              ) : (
                messages.present
              )}
            </p>
            <h3 className="mt-1 text-xl font-semibold">
              {item.role} · {item.company}
            </h3>
            {item.location ? (
              <p className="text-muted-foreground text-sm">{item.location}</p>
            ) : null}
            <p className="mt-3 max-w-prose text-muted-foreground">
              {item.summary}
            </p>
            {item.highlights.length > 0 ? (
              <ul className="mt-3 max-w-prose list-disc space-y-1 pl-5 text-muted-foreground">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
            {item.technologies.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {item.technologies.map((tech) => (
                  <li key={tech}>
                    <Badge variant="secondary">{tech}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
