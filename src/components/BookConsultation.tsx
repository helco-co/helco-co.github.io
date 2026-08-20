"use client";

import { Calendar } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { localeHref } from "@/lib/href";

/** Floating CTA carried over from the previous deployment. Routes to the contact
 *  form — there is no booking system or payment behind it. */
export default function BookConsultation() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  return (
    <a
      href={localeHref(locale, "/contact#enterprise-contact-form")}
      aria-label={t("bookConsultation")}
      // bottom offset clears the iPhone home-indicator strip; env() resolves to
      // 0px on every device without one, so this is a no-op elsewhere.
      className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] end-6 z-[70] flex items-center gap-2.5 rounded-full bg-[#a88c68] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f1400] shadow-[0_8px_30px_rgba(168,140,104,0.35)] transition hover:bg-[#e1c19a] hover:shadow-[0_8px_40px_rgba(225,193,154,0.4)] active:scale-95"
    >
      <Calendar className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{t("bookConsultation")}</span>
    </a>
  );
}
