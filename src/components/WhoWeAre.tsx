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
    <section className="space-y-8">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
          <span className="h-px w-8 bg-[#e1c19a]" />
          {t("aboutHelco")}
        </span>
        <h1 className="text-3xl font-semibold leading-tight text-[#e1c19a] sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <p className="text-base leading-8 text-[#ffffff] sm:text-lg">{t("p1")}</p>
          <p className="text-sm leading-8 text-[#ffffff]">{t("p2")}</p>
          <p className="text-sm leading-8 text-[#ffffff]">{t("p3")}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={localeHref(locale, "/contact")}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#a88c68] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f1400] transition hover:bg-[#e1c19a] sm:min-h-0"
            >
              {t("talkToTeam")}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
            <a
              href={localeHref(locale, "/services")}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#4a4140] bg-[#141a20] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#d1c4b8] transition hover:border-[#e1c19a] hover:text-[#e1c19a] sm:min-h-0"
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
                <p className="mt-2.5 text-sm font-semibold text-[#e1c19a]">{t(labelKey)}</p>
                <p className="mt-1 text-xs leading-5 text-[#ffffff]">{t(descKey)}</p>
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
                <dt className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[#a89d92]">
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
