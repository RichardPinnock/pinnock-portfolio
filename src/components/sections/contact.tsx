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
    <Section id="contact" title={messages.title}>
      <div className="reveal">
        <p className="text-muted-foreground leading-relaxed">
          {messages.intro}
        </p>
        <Button asChild size="lg" className="mt-6">
          <a href={`mailto:${email}`}>
            <Mail aria-hidden />
            {email}
          </a>
        </Button>
        {socials.length > 0 ? (
          <p className="mt-8 text-muted-foreground text-sm">
            {messages.elsewhere}{" "}
            {socials.map((social, index) => (
              <span key={social.network}>
                {index > 0 ? ", " : ""}
                <a
                  href={social.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  {social.network}
                  <span className="sr-only"> ({social.handle})</span>
                </a>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </Section>
  );
}
