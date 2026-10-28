import { Mail } from "lucide-react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import type { Messages } from "@/i18n/messages";

interface ContactProps {
  email: string;
  socials: { network: string; url: string; handle: string }[];
  messages: Messages["contact"];
}

export function Contact({ email, socials, messages }: ContactProps) {
  return (
    <Section id="contact" eyebrow={messages.eyebrow} title={messages.title}>
      <div className="reveal max-w-2xl">
        <p className="text-lg text-muted-foreground">{messages.intro}</p>
        <Button asChild size="lg" className="mt-6">
          <a href={`mailto:${email}`}>
            <Mail aria-hidden />
            {email}
          </a>
        </Button>
        {socials.length > 0 ? (
          <div className="mt-10">
            <h3 className="mb-3 text-muted-foreground text-sm">
              {messages.elsewhere}
            </h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((social) => (
                <li key={social.network}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                  >
                    {social.network}
                    <span className="sr-only"> ({social.handle})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
