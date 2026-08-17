import type { Metadata } from "next";

// The live business domain — always the canonical target, even when a page
// is actually being served from the GitHub Pages preview mirror. That way
// both copies point search engines at the one page that should get indexed,
// instead of competing as duplicate content.
export const SITE_URL = "https://hanyelaraby.com";

/**
 * Builds the full per-page metadata block (title, description, canonical,
 * hreflang alternates, Open Graph). `path` is the route below the locale,
 * e.g. "" for the homepage or "/services" — matching what `localeHref`
 * expects everywhere else in this app.
 */
export function pageMetadata(locale: string, path: string, title: string, description: string): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/en${path}`,
        ar: `${SITE_URL}/ar${path}`,
        "x-default": `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale,
      // The opengraph-image file convention only auto-applies to its own
      // exact route ([locale]'s own index page) — nested pages don't
      // inherit it, so every page references the generated image directly.
      images: [{ url: `${SITE_URL}/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}
