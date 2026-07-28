import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, CircleCheck, ShieldCheck, TrendingUp, Landmark } from "lucide-react";

import SectionHeading from "./SectionHeading";
import { localeHref } from "@/lib/href";

const CARDS = [
  {
    id: "audit-assurance",
    titleKey: "auditAssuranceTitle",
    descKey: "auditAssuranceDesc",
    itemPrefix: "auditItem",
    href: "/services#audit-assurance",
    Icon: ShieldCheck,
    color: "#6DA780",
  },
  {
    id: "advisory-consulting",
    titleKey: "advisoryTitle",
    descKey: "advisoryDesc",
    itemPrefix: "advisoryItem",
    href: "/services#advisory-consulting",
    Icon: TrendingUp,
    color: "#7FA0C4",
  },
  {
    id: "tax-services",
    titleKey: "taxTitle",
    descKey: "taxDesc",
    itemPrefix: "taxItem",
    href: "/services#tax-services",
    Icon: Landmark,
    color: "#C4A47F",
  },
] as const;

export default async function ServicesSection() {
  const t = await getTranslations("OurServices");
  const locale = await getLocale();

  return (
    <section id="services" className="scroll-mt-24 space-y-8">
      <SectionHeading kicker={t("whatWeDo")} title={t("title")} description={t("description")} />

      <div className="grid gap-6 lg:grid-cols-3">
        {CARDS.map(({ id, titleKey, descKey, itemPrefix, href, Icon, color }) => (
          <article
            key={id}
            className="group flex flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition hover:border-[#4a515a] hover:bg-[#1e242a] sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#3a4047] bg-[#11171d] shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
              </span>
              <h3 className="text-xl font-semibold text-[#dee3ea]">{t(titleKey)}</h3>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#9a8f84]">{t(descKey)}</p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <li key={n} className="flex gap-2.5 text-sm text-[#d1c4b8]">
                  <CircleCheck
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e1c19a] transition group-hover:text-[#f4d3ab]"
                    aria-hidden="true"
                  />
                  {t(`${itemPrefix}${n}`)}
                </li>
              ))}
            </ul>

            <a
              href={localeHref(locale, href)}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:text-[#f4d3ab]"
            >
              {t("explorePrefix")} {t(titleKey)}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <a
          href={localeHref(locale, "/services")}
          className="inline-flex items-center gap-2 rounded-md border border-[#4a4140] bg-[#141a20] px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#d1c4b8] transition hover:border-[#e1c19a] hover:text-[#e1c19a]"
        >
          {t("viewAll")}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
