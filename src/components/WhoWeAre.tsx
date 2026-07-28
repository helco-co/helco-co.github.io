import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, CalendarDays, Globe2, Scale, Users } from "lucide-react";

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
    <section id="about" className="scroll-mt-24 space-y-8 border-t border-[#30353b] pt-14">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
          <span className="h-px w-8 bg-[#e1c19a]" />
          {t("aboutHelco")}
        </span>
        <h2 className="text-3xl font-semibold text-[#dee3ea] sm:text-4xl">{t("title")}</h2>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <p className="text-base leading-8 text-[#9a8f84] sm:text-lg">{t("p1")}</p>
          <p className="text-sm leading-8 text-[#9a8f84]">{t("p2")}</p>
          <p className="text-sm leading-8 text-[#9a8f84]">{t("p3")}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={localeHref(locale, "/contact")}
              className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#39260a] transition hover:bg-[#e1c19a]"
            >
              {t("talkToTeam")}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
            <a
              href={localeHref(locale, "/services")}
              className="inline-flex items-center gap-2 rounded-md border border-[#4a4140] bg-[#141a20] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#d1c4b8] transition hover:border-[#e1c19a] hover:text-[#e1c19a]"
            >
              {t("ourServices")}
            </a>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {PILLARS.map(({ labelKey, descKey, Icon }) => (
              <div
                key={labelKey}
                className="rounded-xl border border-[#30353b] bg-[#1b2025] p-4 transition hover:border-[#4a515a]"
              >
                <Icon className="h-5 w-5 text-[#e1c19a]" aria-hidden="true" />
                <p className="mt-2.5 text-sm font-semibold text-[#dee3ea]">{t(labelKey)}</p>
                <p className="mt-1 text-xs leading-5 text-[#9a8f84]">{t(descKey)}</p>
              </div>
            ))}
          </div>

          <dl className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-lg border border-[#30353b] bg-[#171c21] px-3 py-4 text-center"
              >
                <dd className="text-2xl font-bold text-[#e1c19a] sm:text-3xl">
                  {t(`stat${n}Value`)}
                </dd>
                <dt className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[#7c746c]">
                  {t(`stat${n}Label`)}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
