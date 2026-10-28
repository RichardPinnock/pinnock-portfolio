import { ImageResponse } from "next/og";
import { brand, initials } from "@/lib/brand";
import { content } from "@/lib/content";

const sizes = [32, 192, 512] as const;

export function generateImageMetadata() {
  return sizes.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: brand.primary,
        color: "#fff",
        fontSize: size * 0.5,
        fontWeight: 700,
        letterSpacing: -size * 0.02,
      }}
    >
      {initials(content.profile.name)}
    </div>,
    { width: size, height: size },
  );
}
