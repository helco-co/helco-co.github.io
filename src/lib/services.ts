import en from "@/data/services.json";
import ar from "@/data/services.ar.json";

/** Service copy is prose (pillar descriptions, group blurbs, and the full
 *  capability lists) rather than short UI labels, so it lives in a data file
 *  per locale. Reading services.json directly left the Arabic services page,
 *  and the service blocks on every sector page, in English.
 *
 *  Both files share the same slugs, ordering, icons, and colours — the Arabic
 *  file is generated from the English one so only the wording differs. */
export function getServices(locale: string): typeof en {
  return locale === "ar" ? (ar as typeof en) : en;
}
