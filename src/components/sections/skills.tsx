import { Section } from "@/components/section";
import type { Messages } from "@/i18n/messages";

interface SkillsProps {
  groups: { id: string; name: string; items: string[] }[];
  messages: Messages["stack"];
}

function Chip({ children }: { children: string }) {
  return (
    <li className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 font-medium text-sm ring-2 ring-border/20">
      {children}
    </li>
  );
}

export function Skills({ groups, messages }: SkillsProps) {
  return (
    <Section id="stack" title={messages.title}>
      <div className="reveal flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.id}>
            {/* Derived groups have no name and render as one flat list. */}
            {group.name ? (
              <h3 className="mb-3 text-muted-foreground text-sm">
                {group.name}
              </h3>
            ) : null}
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
