import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Award, ArrowRight, BookOpen, GraduationCap, UsersRound } from "lucide-react";

import SectionHeading from "@/components/SectionHeading";
import { localeHref } from "@/lib/href";
import { pageMetadata } from "@/lib/seo";

const PILLARS = [
  { labelKey: "pillar1Label", descKey: "pillar1Desc", Icon: Award },
  { labelKey: "pillar2Label", descKey: "pillar2Desc", Icon: GraduationCap },
  { labelKey: "pillar3Label", descKey: "pillar3Desc", Icon: BookOpen },
  { labelKey: "pillar4Label", descKey: "pillar4Desc", Icon: UsersRound },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OurLeadership" });
  return pageMetadata(locale, "/about/our-experts", `${t("title")} — HELCO`, t("p1"));
}

export default async function OurExpertsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("OurLeadership");

  return (
    <main id="main" className="w-full pb-20 pt-28">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-16 px-4 sm:px-8 lg:px-14 2xl:px-20">
        <header className="space-y-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
            <span className="h-px w-8 bg-[#e1c19a]" />
            {t("kicker")}
          </span>
          <h1 className="text-3xl font-semibold leading-tight text-[#e1c19a] sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
        </header>

        {/* Our Leadership — placeholder until executive photos and bios are ready. */}
        <section className="scroll-mt-24 space-y-8">
          <h2 className="text-2xl font-semibold text-[#e1c19a] sm:text-3xl">
            {t("leadershipHeading")}
          </h2>
          <div className="rounded-3xl border border-[#30353b] bg-[#11171d] p-8 sm:p-10">
            <p className="text-sm leading-7 text-[#ffffff]">{t("leadershipComingSoon")}</p>
          </div>
        </section>

        {/* Our Team — the certification pillars now live here, alongside the CTA. */}
        <section className="overflow-hidden rounded-3xl border border-[#30353b] bg-[#11171d]">
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:p-14">
            <div className="space-y-6">
              <SectionHeading kicker={t("kicker")} title={t("teamHeading")} />
              <div className="space-y-5 text-base leading-8 text-[#ffffff]">
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
              </div>
              <div className="pt-2">
                <a
                  href={localeHref(locale, "/careers")}
                  className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a]"
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
                  <p className="mt-3.5 text-sm font-semibold text-[#e1c19a]">{t(labelKey)}</p>
                  <p className="mt-1.5 text-xs leading-6 text-[#a89d92]">{t(descKey)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
