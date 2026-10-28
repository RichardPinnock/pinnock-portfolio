import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Bricolage_Grotesque } from "next/font/google";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import { getProfile } from "@/lib/content";
import { env } from "@/lib/env";
import { hasLocale } from "@/lib/locale";
import { type Locale, locales } from "@/lib/schemas/common";
import { cn } from "@/lib/utils";

/** Open Graph wants language_TERRITORY values. */
const openGraphLocale: Record<Locale, string> = { es: "es_ES", en: "en_US" };

// Only the heading font is a web font (one static weight). Body text uses the system font stack (see
// --font-sans in globals.css): every font file downloaded before the LCP costs simulated mobile LCP.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: "600",
});

// Unknown locales are rejected with notFound() below; the proxy redirects URLs that lack one.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const profile = getProfile(lang);

  const title = `${profile.name} · ${profile.role}`;

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: title, template: `%s | ${profile.name}` },
    description: profile.headline,
    authors: [{ name: profile.name }],
    creator: profile.name,
    openGraph: {
      type: "website",
      siteName: profile.name,
      title,
      description: profile.headline,
      url: `/${lang}`,
      locale: openGraphLocale[lang],
      alternateLocale: locales
        .filter((l) => l !== lang)
        .map((l) => openGraphLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: profile.headline,
    },
  };
}

export const viewport: Viewport = {
  themeColor: brand.background,
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={cn("dark font-sans", bricolage.variable)}>
      <body>{children}</body>
    </html>
  );
}
