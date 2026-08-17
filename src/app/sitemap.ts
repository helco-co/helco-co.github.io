import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const PATHS = [
  "",
  "/services",
  "/industries",
  "/careers",
  "/contact",
  "/about",
  "/about/our-experts",
  "/about/life-at-helco",
  "/legal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ["en", "ar"].flatMap((locale) =>
    PATHS.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${path}`,
          ar: `${SITE_URL}/ar${path}`,
        },
      },
    }))
  );
}
