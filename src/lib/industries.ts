import en from "@/data/industries.json";
import ar from "@/data/industries.ar.json";

/** Sector copy is prose (titles, descriptions, capability tags, stat labels)
 *  rather than short UI labels, so it lives in a data file per locale. Reading
 *  industries.json directly is what left the Arabic industries index, all nine
 *  sector pages, and the homepage marquee in English.
 *
 *  Both files are keyed by the same slugs and kept in the same order, so a
 *  sector's position — used for the numbered badges — is identical either way. */
export function getIndustries(locale: string): typeof en {
  return locale === "ar" ? (ar as typeof en) : en;
}
