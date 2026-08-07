import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import industries from "@/data/industries.json";
import { localeHref } from "@/lib/href";

export default async function IndustriesSection() {
  const t = await getTranslations("Industries");
  const about = await getTranslations("WhoWeAre");
  const nav = await getTranslations("Navigation");
  const locale = await getLocale();

  const stats = [
    { value: String(industries.length), label: t("sectorsLabel") },
    { value: about("stat1Value"), label: about("stat1Label") },
    { value: about("stat2Value"), label: about("stat2Label") },
  ];

  return (
    <section id="industries" className="scroll-mt-24 border-t border-[#30353b] pt-14">
      <div className="rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
              <span className="h-px w-8 bg-[#e1c19a]" />
              {t("kicker")}
            </span>
            <h2 className="text-3xl font-semibold leading-tight text-[#e1c19a] sm:text-4xl">
              {t("pageTitle")}
            </h2>
            <p className="text-base leading-8 text-[#ffffff] sm:text-lg">{t("pageDescription")}</p>

            <a
              href={localeHref(locale, "/industries")}
              className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a]"
            >
              {nav("seeAllIndustries")}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:shrink-0">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[#2a2f35] bg-[#12181e] px-4 py-4 sm:px-5"
              >
                <p className="text-2xl font-bold leading-none text-[#e1c19a] sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-2 text-[10px] uppercase leading-snug tracking-[0.08em] text-[#a89d92]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
