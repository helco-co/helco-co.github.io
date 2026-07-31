import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { INDUSTRIES } from "@/lib/site";
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
        <h2 className="text-3xl font-semibold text-[#dee3ea] sm:text-4xl">{t("title")}</h2>
        <p className="max-w-2xl text-base leading-8 text-[#b3a89c] sm:text-lg">
          {t("description")}
        </p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {INDUSTRIES.map(({ slug, key }) => (
            <li key={slug}>
              <a
                href={localeHref(locale, `/industries/${slug}`)}
                className="group flex h-full flex-col justify-between rounded-lg border border-[#30353b] bg-[#1b2025] px-4 py-4 transition hover:border-[#a88c68]/60 hover:bg-[#1e242a]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#dee3ea]">{nav(key)}</p>
                  <p className="mt-1.5 text-xs leading-5 text-[#b3a89c]">{t(`card.${key}`)}</p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition group-hover:gap-2.5">
                  {t("readMore")}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
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
