import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { brandForHost } from "@/lib/brands";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Per-domain favicon: the brand initial on the brand accent. */
export default async function Icon() {
  const brand = brandForHost((await headers()).get("host"));
  const initial = brand.name.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase() || "•";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.palette.accent,
          color: brand.palette.accentInk,
          fontSize: 40,
          fontWeight: 700,
          borderRadius: 14,
          letterSpacing: "-0.05em",
        }}
      >
        {initial}
      </div>
    ),
    size
  );
}
