import { ArrowDownToLine, Mail } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import WorldMap from "@/components/ui/world-map";
import type { Messages } from "@/i18n/messages";
import { format } from "@/i18n/messages";
import { countryCenters } from "@/lib/countries";

interface HeroProps {
  name: string;
  headline: string;
  origin: [number, number];
  clientCountries: string[];
  cvHref: string;
  messages: Messages["hero"];
}

export function Hero({
  name,
  headline,
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
    <section id="top" aria-labelledby="hero-title" className="space-y-10">
      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <h1
            id="hero-title"
            className="font-heading font-semibold text-4xl tracking-tighter sm:text-5xl"
          >
            {format(messages.greeting, { name: name.split(" ")[0] })}
          </h1>
          <p className="max-w-[34rem] text-lg text-muted-foreground leading-relaxed sm:text-xl">
            {headline}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
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
        {/* The one round element on the page: a photo is the usual exception to the square shape language. */}
        <Image
          src="/profile.jpg"
          alt={name}
          width={256}
          height={256}
          priority
          unoptimized
          className="size-24 shrink-0 rounded-full border object-cover shadow-lg ring-4 ring-muted sm:size-28"
        />
      </div>
      <div role="img" aria-label={messages.mapCaption}>
        <WorldMap dots={connections} lineColor="oklch(0.7 0.15 285)" />
      </div>
    </section>
  );
}
