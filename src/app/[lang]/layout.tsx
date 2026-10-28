import type { Metadata } from "next";
import "../globals.css";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/content";
import { env } from "@/lib/env";
import { hasLocale } from "@/lib/locale";
import { locales } from "@/lib/schemas/common";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
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

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: {
      default: `${profile.name} · ${profile.role}`,
      template: `%s | ${profile.name}`,
    },
    description: profile.headline,
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={cn("dark font-sans", geist.variable, bricolage.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
