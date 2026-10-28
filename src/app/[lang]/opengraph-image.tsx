import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";
import { getProfile } from "@/lib/content";
import { hasLocale } from "@/lib/locale";
import { locales } from "@/lib/schemas/common";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const profile = getProfile(lang);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: `linear-gradient(135deg, ${brand.background} 0%, #1b1747 100%)`,
        color: brand.foreground,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 30,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: brand.accent,
        }}
      >
        {profile.role}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700 }}>
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            lineHeight: 1.3,
            maxWidth: 980,
            opacity: 0.85,
          }}
        >
          {profile.headline}
        </div>
      </div>
    </div>,
    size,
  );
}
