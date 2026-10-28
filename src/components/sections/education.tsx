import { Section } from "@/components/section";
import type { Messages } from "@/i18n/messages";

interface EducationProps {
  items: {
    id: string;
    title: string;
    institution: string;
    start: string;
    end: string | null;
  }[];
  messages: Messages["education"];
}

const formatMonth = (value: string) => `${value.slice(5)}/${value.slice(0, 4)}`;

export function Education({ items, messages }: EducationProps) {
  return (
    <Section id="education" title={messages.title}>
      <ul className="flex flex-col gap-6">
        {items.map((item) => (
          <li key={item.id} className="reveal flex justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold">{item.institution}</h3>
              <p className="text-muted-foreground text-sm">{item.title}</p>
            </div>
            <p className="shrink-0 text-muted-foreground text-xs tabular-nums">
              {formatMonth(item.start)} -{" "}
              {item.end ? formatMonth(item.end) : messages.present}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
