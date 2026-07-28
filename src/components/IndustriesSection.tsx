import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, Cpu, HeartPulse, ShoppingBag, Zap } from "lucide-react";

import SectionHeading from "./SectionHeading";
import { INDUSTRIES } from "@/lib/site";
import { localeHref } from "@/lib/href";

const ICONS = {
  retail: ShoppingBag,
  "healthcare-life-sciences": HeartPulse,
  "energy-infrastructure": Zap,
  "technology-innovation": Cpu,
} as const;

export default async function IndustriesSection() {
  const t = await getTranslations("Industries");
  const nav = await getTranslations("Navigation");
  const locale = await getLocale();

  return (
    <section id="industries" className="scroll-mt-24 space-y-8">
      <SectionHeading title={t("title")} description={t("description")} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {INDUSTRIES.map(({ slug, key }) => {
          const Icon = ICONS[slug];
          return (
            <article
              key={slug}
              className="group flex flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition hover:border-[#4a515a] hover:bg-[#1e242a]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#3a4047] bg-[#11171d] transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5 text-[#e1c19a]" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[#dee3ea]">{nav(key)}</h3>
              {/* Homepage cards carry their own wording, slightly longer than the nav menu's. */}
              <p className="mt-2 flex-1 text-sm leading-7 text-[#9a8f84]">{t(`card.${key}`)}</p>
              <a
                href={localeHref(locale, `/industries/${slug}`)}
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:text-[#f4d3ab]"
              >
                {t("readMore")}
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              </a>
            </article>
          );
        })}
      </div>

      <dl className="grid gap-px overflow-hidden rounded-2xl border border-[#30353b] bg-[#30353b] sm:grid-cols-2">
        {[1, 2].map((n) => (
          <div key={n} className="bg-[#11171d] px-6 py-8 text-center">
            <dt className="sr-only">{t(`stat${n}Label`)}</dt>
            <dd>
              <span className="block text-3xl font-extrabold text-[#e1c19a] sm:text-4xl">
                {t(`stat${n}Value`)}
              </span>
              <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7c746c]">
                {t(`stat${n}Label`)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
