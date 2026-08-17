import { ImageResponse } from "next/og";

import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static-generated at build time (this file takes no request-time input),
// which is what makes it compatible with `output: "export"` — no server
// renders it on demand. Applies to every page under this locale segment
// that doesn't define its own opengraph-image.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f13",
          backgroundImage: "linear-gradient(135deg, #0b0f13 0%, #171c21 100%)",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#e1c19a",
          }}
        >
          HELCO
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "#b3a89c",
          }}
        >
          Hany ElAraby &amp; Co — Audit, Tax &amp; Advisory
        </div>
      </div>
    ),
    { ...size }
  );
}
