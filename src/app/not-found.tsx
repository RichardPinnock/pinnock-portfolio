import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/messages";
import { defaultLocale } from "@/lib/schemas/common";

export default function NotFound() {
  const t = getMessages(defaultLocale).notFound;
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-6 px-4 sm:px-6">
      <p
        className="font-heading font-semibold text-8xl text-brand-400"
        aria-hidden
      >
        404
      </p>
      <h1 className="font-semibold text-3xl sm:text-4xl">{t.title}</h1>
      <p className="text-muted-foreground">{t.text}</p>
      <Button asChild size="lg">
        <a href="/">{t.back}</a>
      </Button>
    </main>
  );
}
