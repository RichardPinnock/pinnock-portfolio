import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import type { Messages } from "@/i18n/messages";

interface SkillsProps {
  groups: { id: string; name: string; items: string[] }[];
  messages: Messages["stack"];
}

export function Skills({ groups, messages }: SkillsProps) {
  return (
    <Section id="stack" eyebrow={messages.eyebrow} title={messages.title}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="reveal rounded-xl border border-border bg-card p-6"
          >
            <h3 className="mb-4 text-lg font-semibold">{group.name}</h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li key={item}>
                  <Badge variant="outline">{item}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
