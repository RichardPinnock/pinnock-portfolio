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
    <Section id="about" eyebrow={messages.eyebrow} title={messages.title}>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="reveal max-w-prose space-y-5 text-lg text-muted-foreground leading-relaxed">
          {bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="reveal grid gap-6 self-start rounded-xl border border-border bg-card p-6">
          <div>
            <dt className="text-muted-foreground text-sm">
              {messages.location}
            </dt>
            <dd className="mt-1 font-medium text-lg">
              {city ? `${city}, ${country}` : country}
            </dd>
          </div>
          {languages.length > 0 ? (
            <div>
              <dt className="text-muted-foreground text-sm">
                {messages.languages}
              </dt>
              <dd className="mt-1">
                <ul className="space-y-1">
                  {languages.map((language) => (
                    <li key={language.code}>
                      <span className="font-medium">{language.name}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        · {language.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Section>
  );
}
