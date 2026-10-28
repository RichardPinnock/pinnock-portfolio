import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Messages } from "@/i18n/messages";

interface ServicesProps {
  services: {
    id: string;
    title: string;
    description: string;
    stack: string[];
  }[];
  messages: Messages["services"];
}

export function Services({ services, messages }: ServicesProps) {
  return (
    <Section id="services" eyebrow={messages.eyebrow} title={messages.title}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id} className="reveal">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  <h3>{service.title}</h3>
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              {service.stack.length > 0 ? (
                <CardContent>
                  <p className="sr-only">{messages.stack}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {service.stack.map((tech) => (
                      <li key={tech}>
                        <Badge variant="secondary">{tech}</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
