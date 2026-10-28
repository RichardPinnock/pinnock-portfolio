import { ImageResponse } from "next/og";
import { brand, initials } from "@/lib/brand";
import { content } from "@/lib/content";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        fontSize: 90,
        fontWeight: 700,
      }}
    >
      {initials(content.profile.name)}
    </div>,
    size,
  );
}
