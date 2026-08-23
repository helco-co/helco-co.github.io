import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, ShieldCheck, TrendingUp, Landmark } from "lucide-react";

import SectionHeading from "./SectionHeading";
import ServiceSummaryCard from "./ServiceSummaryCard";
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
          <ServiceSummaryCard
            key={id}
            icon={<Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />}
            title={t(titleKey)}
            description={t(descKey)}
            items={[1, 2, 3, 4, 5].map((n) => t(`${itemPrefix}${n}`))}
            href={localeHref(locale, href)}
            exploreLabel={`${t("explorePrefix")} ${t(titleKey)}`}
            tapHint={t("tapForServices")}
          />
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <a
          href={localeHref(locale, "/services")}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#4a4140] bg-[#141a20] px-6 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#d1c4b8] transition hover:border-[#e1c19a] hover:text-[#e1c19a] sm:min-h-0"
        >
          {t("viewAll")}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
