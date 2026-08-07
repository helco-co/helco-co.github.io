import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import industries from "@/data/industries.json";
import IndustryCard from "@/components/IndustryCard";
import { localeHref } from "@/lib/href";

export default async function IndustriesSection() {
  const t = await getTranslations("Industries");
  const nav = await getTranslations("Navigation");
  const locale = await getLocale();

  return (
    <section
      id="industries"
      className="grid scroll-mt-24 gap-8 border-t border-[#30353b] pt-14 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div className="space-y-5">
        <h2 className="text-3xl font-semibold text-[#e1c19a] sm:text-4xl">{t("title")}</h2>
        <p className="max-w-2xl text-base leading-8 text-[#ffffff] sm:text-lg">
          {t("description")}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {industries.map((ind, i) => (
            <IndustryCard
              key={ind.slug}
              href={localeHref(locale, `/industries/${ind.slug}`)}
              number={i + 1}
              title={ind.title}
              family={ind.family}
              description={ind.description}
              stats={ind.stats}
              hoverHint={t("hoverForDetail")}
            />
          ))}
        </div>

        <a
          href={localeHref(locale, "/industries")}
          className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a]"
        >
          {nav("seeAllIndustries")}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {[1, 2].map((n) => (
          <article
            key={n}
            className="rounded-xl border border-[#30353b] bg-[#171c21] p-6 sm:p-8"
          >
            <p className="text-4xl font-bold text-[#e1c19a] sm:text-5xl">{t(`stat${n}Value`)}</p>
            <p className="mt-3 text-sm text-[#b3a89c] sm:text-base">{t(`stat${n}Label`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
