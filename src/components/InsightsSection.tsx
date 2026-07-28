import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import SectionHeading from "./SectionHeading";

export default async function InsightsSection() {
  const t = await getTranslations("Insights");

  return (
    <section id="insights" className="scroll-mt-24 space-y-8">
      <SectionHeading title={t("title")} description={t("description")} />

      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <article
            key={n}
            className="group flex flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition hover:border-[#4a515a] hover:bg-[#1e242a] sm:p-8"
          >
            <span className="h-px w-10 gold-rule" aria-hidden="true" />
            <h3 className="mt-5 text-lg font-semibold leading-8 text-[#dee3ea] group-hover:text-[#e1c19a]">
              {t(`insight${n}Title`)}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-7 text-[#9a8f84]">{t(`insight${n}Desc`)}</p>
            <a
              href="#insights"
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:text-[#f4d3ab]"
            >
              {t("readInsight")}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
