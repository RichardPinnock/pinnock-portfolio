import { Section } from "@/components/section";
import type { Messages } from "@/i18n/messages";

interface AboutProps {
  bio: string[];
  country: string;
  city: string | null;
  languages: { code: string; name: string; level: string }[];
  messages: Messages["about"];
}

export function About({ bio, country, city, languages, messages }: AboutProps) {
  return (
    <Section id="about" title={messages.title}>
      <div className="reveal space-y-4 text-muted-foreground leading-relaxed">
        {bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <dl className="reveal mt-6 flex flex-wrap gap-x-10 gap-y-4 text-sm">
        <div>
          <dt className="text-muted-foreground">{messages.location}</dt>
          <dd className="mt-1 font-medium">
            {city ? `${city}, ${country}` : country}
          </dd>
        </div>
        {languages.length > 0 ? (
          <div>
            <dt className="text-muted-foreground">{messages.languages}</dt>
            <dd className="mt-1 font-medium">
              {languages.map((l) => `${l.name} (${l.level})`).join(", ")}
            </dd>
          </div>
        ) : null}
      </dl>
    </Section>
  );
}
