import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  // Keep /en and /ar explicit in the URL, matching the previous deployment.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

export const isRtl = (locale: string) => locale === "ar";
