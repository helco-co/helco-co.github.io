import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, CalendarDays, Globe2, Scale, Users } from "lucide-react";

import SectionHeading from "./SectionHeading";
import { localeHref } from "@/lib/href";

const PILLARS = [
  { labelKey: "estLabel", descKey: "estDesc", Icon: CalendarDays },
  { labelKey: "menaLabel", descKey: "menaDesc", Icon: Globe2 },
  { labelKey: "teamLabel", descKey: "teamDesc", Icon: Users },
  { labelKey: "regLabel", descKey: "regDesc", Icon: Scale },
] as const;

export default async function WhoWeAre() {
  const t = await getTranslations("WhoWeAre");
  const locale = await getLocale();

  return (
    <section id="about" className="scroll-mt-24 space-y-10">
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div className="space-y-6">
          <SectionHeading kicker={t("aboutHelco")} title={t("title")} />
          <div className="space-y-5 text-base leading-8 text-[#9a8f84]">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={localeHref(locale, "/contact")}
              className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
            >
              {t("talkToTeam")}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
            <a
              href={localeHref(locale, "/services")}
              className="inline-flex items-center gap-2 rounded-md border border-[#4e453c] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:border-[#e1c19a] hover:bg-[#1b2025]"
            >
              {t("ourServices")}
            </a>
          </div>
        </div>

        <ul className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {PILLARS.map(({ labelKey, descKey, Icon }) => (
            <li
              key={labelKey}
              className="rounded-2xl border border-[#30353b] bg-[#1b2025] p-5 transition hover:border-[#4a515a]"
            >
              <Icon className="h-5 w-5 text-[#e1c19a]" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-[#dee3ea]">{t(labelKey)}</p>
              <p className="mt-1.5 text-xs leading-6 text-[#7c746c]">{t(descKey)}</p>
            </li>
          ))}
        </ul>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-2xl border border-[#30353b] bg-[#30353b] sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
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
