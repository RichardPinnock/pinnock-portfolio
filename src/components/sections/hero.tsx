import { ArrowDownToLine, Mail } from "lucide-react";
import { GlobeLazy } from "@/components/globe/globe-lazy";
import { Button } from "@/components/ui/button";
import type { Messages } from "@/i18n/messages";
import { countryCenters } from "@/lib/countries";

interface HeroProps {
  name: string;
  role: string;
  headline: string;
  country: string;
  agency: { name: string; url: string };
  origin: [number, number];
  clientCountries: string[];
  cvHref: string;
  messages: Messages["hero"];
}

export function Hero({
  name,
  role,
  headline,
  country,
  agency,
  origin,
  clientCountries,
  cvHref,
  messages,
}: HeroProps) {
  const destinations = clientCountries
    .map((code) => countryCenters[code])
    .filter((center): center is [number, number] => center !== undefined);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-border border-b"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,var(--color-brand-900),transparent_70%)] opacity-70"
      />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="min-w-0">
          <p className="mb-5 font-medium text-brand-300 text-sm uppercase tracking-[0.14em]">
            {name} · {role} · {country}
          </p>
          <h1
            id="hero-title"
            className="max-w-3xl font-semibold text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            {headline}
          </h1>
          <p className="mt-6 text-muted-foreground">
            {messages.agencyPrefix}{" "}
            <a href={agency.url} target="_blank" rel="noopener noreferrer">
              {agency.name}
            </a>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#contact">
                <Mail aria-hidden />
                {messages.contact}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={cvHref} download>
                <ArrowDownToLine aria-hidden />
                {messages.downloadCv}
              </a>
            </Button>
          </div>
        </div>
        <GlobeLazy
          origin={origin}
          destinations={destinations}
          caption={messages.globeCaption}
        />
      </div>
    </section>
  );
}
