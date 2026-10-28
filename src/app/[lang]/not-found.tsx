import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/messages";
import { locales } from "@/lib/schemas/common";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
};

// Next does not pass the locale to not-found, so the page speaks both languages.
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-8 px-4 sm:px-6">
      <p
        className="font-heading font-semibold text-8xl text-brand-400"
        aria-hidden
      >
        404
      </p>
      {locales.map((locale, index) => {
        const t = getMessages(locale).notFound;
        const Heading = index === 0 ? "h1" : "h2";
        return (
          <section key={locale} lang={locale} className="space-y-3">
            <Heading className="font-semibold text-3xl sm:text-4xl">
              {t.title}
            </Heading>
            <p className="text-muted-foreground">{t.text}</p>
            <Button asChild size="lg">
              <a href={`/${locale}`} hrefLang={locale}>
                {t.back}
              </a>
            </Button>
          </section>
        );
      })}
    </main>
  );
}
