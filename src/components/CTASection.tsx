import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { localeHref } from "@/lib/href";

export default async function CTASection() {
  const t = await getTranslations("CTA");
  const locale = await getLocale();

  return (
    <section className="overflow-hidden rounded-3xl border border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
      <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-[#dee3ea] sm:text-3xl lg:text-4xl">
        {t("title")}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#9a8f84]">
        {t("description")}
      </p>
      <a
        href={localeHref(locale, "/contact")}
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
      >
        {t("contact")}
        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
      </a>
    </section>
  );
}
