import en from "@/data/careers.json";
import ar from "@/data/careers.ar.json";

/** Careers copy is long-form prose (the firm's story, mission, code of conduct,
 *  and values) rather than short UI labels, so it lives in data files per locale
 *  instead of the message catalogues. Reading `careers.json` directly is what
 *  left the whole Life at HELCO page in English for Arabic visitors. */
export function getCareers(locale: string): typeof en {
  return locale === "ar" ? (ar as typeof en) : en;
}
