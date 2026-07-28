/** Next applies `basePath` to <Link> and next/image automatically, but not to raw
 *  <a href> strings. Every internal anchor in this site goes through `localeHref()`
 *  so the GitHub Pages path prefix is applied in exactly one place. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Build an internal URL.
 *   localeHref("en")                  -> /en
 *   localeHref("en", "/services")     -> /en/services
 *   localeHref("ar", "/contact#form") -> /ar/contact#form
 */
export function localeHref(locale: string, path = ""): string {
  return `${BASE}/${locale}${path}`;
}
