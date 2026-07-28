import { getLocale, getTranslations } from "next-intl/server";
import { Award, ArrowRight, BookOpen, GraduationCap, UsersRound } from "lucide-react";

import SectionHeading from "./SectionHeading";
import { localeHref } from "@/lib/href";

const PILLARS = [
  { labelKey: "pillar1Label", descKey: "pillar1Desc", Icon: Award },
  { labelKey: "pillar2Label", descKey: "pillar2Desc", Icon: GraduationCap },
  { labelKey: "pillar3Label", descKey: "pillar3Desc", Icon: BookOpen },
  { labelKey: "pillar4Label", descKey: "pillar4Desc", Icon: UsersRound },
] as const;

export default async function OurLeadership() {
  const t = await getTranslations("OurLeadership");
  const locale = await getLocale();

  return (
    <section
      id="leadership"
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-[#30353b] bg-[#11171d]"
    >
      <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:p-14">
        <div className="space-y-6">
          <SectionHeading kicker={t("kicker")} title={t("title")} />
          <div className="space-y-5 text-base leading-8 text-[#9a8f84]">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>
          <div className="pt-2">
            <a
              href={localeHref(locale, "/careers")}
              className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
            >
              {t("cta")}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>
        </div>

        <ul className="grid content-start gap-4 sm:grid-cols-2">
          {PILLARS.map(({ labelKey, descKey, Icon }) => (
            <li
              key={labelKey}
              className="rounded-2xl border border-[#30353b] bg-[#0f1419] p-5 transition hover:border-[#4a515a]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#3a4047] bg-[#171c21]">
                <Icon className="h-4.5 w-4.5 text-[#e1c19a]" aria-hidden="true" />
              </span>
              <p className="mt-3.5 text-sm font-semibold text-[#dee3ea]">{t(labelKey)}</p>
              <p className="mt-1.5 text-xs leading-6 text-[#7c746c]">{t(descKey)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
