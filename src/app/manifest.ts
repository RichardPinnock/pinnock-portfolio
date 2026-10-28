import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { content } from "@/lib/content";
import { defaultLocale } from "@/lib/schemas/common";

export default function manifest(): MetadataRoute.Manifest {
  const { profile } = content;
  return {
    name: `${profile.name} · ${profile.role[defaultLocale]}`,
    short_name: profile.name,
    description: profile.headline[defaultLocale],
    start_url: `/${defaultLocale}`,
    display: "standalone",
    background_color: brand.background,
    theme_color: brand.background,
    lang: defaultLocale,
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
      {
        src: "/icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
