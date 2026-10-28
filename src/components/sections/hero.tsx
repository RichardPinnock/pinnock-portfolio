import { ArrowDownToLine, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorldMap from "@/components/ui/world-map";
import type { Messages } from "@/i18n/messages";
import { countryCenters } from "@/lib/countries";

interface HeroProps {
  name: string;
  role: string;
  headline: string;
  country: string;
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
  origin,
  clientCountries,
  cvHref,
  messages,
}: HeroProps) {
  const [originLat, originLng] = origin;
  const connections = clientCountries
    .map((code) => countryCenters[code])
    .filter((center): center is [number, number] => center !== undefined)
    .map(([lat, lng]) => ({
      start: { lat: originLat, lng: originLng },
      end: { lat, lng },
    }));

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
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:py-24">
        <div className="min-w-0">
          <p className="mb-5 font-medium text-brand-300 text-sm uppercase tracking-[0.14em]">
            {name} · {role} · {country}
          </p>
          <h1
            id="hero-title"
            className="max-w-3xl font-semibold text-4xl leading-[1.05] sm:text-5xl lg:text-3xl xl:text-4xl"
          >
            {headline}
          </h1>
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
        <div role="img" aria-label={messages.mapCaption} className="min-w-0">
          <WorldMap dots={connections} lineColor="oklch(0.7 0.15 285)" />
        </div>
      </div>
    </section>
  );
}
