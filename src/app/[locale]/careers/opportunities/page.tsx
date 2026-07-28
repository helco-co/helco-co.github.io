import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Briefcase, Clock, MapPin } from "lucide-react";

import careers from "@/data/careers.json";
import { localeHref } from "@/lib/href";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return {
    title: `${t("opportunitiesTitle")} — HELCO`,
    description: t("opportunitiesDescription"),
  };
}

export default async function OpportunitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Careers");

  return (
    <main id="main" className="w-full pb-20 pt-20">
      <section className="border-b border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-4 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20 2xl:px-24">
        <div className="max-w-4xl space-y-5">
          <span className="kicker block">{t("kicker")}</span>
          <h1 className="text-3xl font-extrabold leading-tight text-[#dee3ea] sm:text-4xl lg:text-5xl">
            {t("opportunitiesTitle")}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[#9a8f84] sm:text-lg">
            {t("opportunitiesDescription")}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={localeHref(locale, "/careers#submit-profile")}
              className="rounded-md bg-[#a88c68] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
            >
              {t("submitGeneralProfile")}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="rounded-md border border-[#4e453c] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:border-[#e1c19a] hover:bg-[#1b2025]"
            >
              {t("viewOnLinkedIn")}
            </a>
          </div>
        </div>
      </section>

      <div className="flex w-full flex-col gap-8 px-4 pt-16 sm:px-8 lg:px-14 xl:px-20 2xl:px-24">
        <h2 className="text-2xl font-semibold text-[#dee3ea] sm:text-3xl">
          {t("openPositions")}
        </h2>

        <ul className="grid gap-4 lg:grid-cols-2">
          {careers.positions.map((p) => (
            <li
              key={p.title}
              className="group flex flex-col gap-4 rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition hover:border-[#4a515a] hover:bg-[#1e242a] sm:flex-row sm:items-center sm:justify-between sm:p-8"
            >
              <div className="space-y-2">
                <span className="inline-flex w-fit rounded-full border border-[#3a4047] bg-[#11171d] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
                  {p.team}
                </span>
                <h3 className="text-lg font-semibold text-[#dee3ea]">{p.title}</h3>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#7c746c]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {p.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {p.type}
                  </span>
                </div>
              </div>

              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(p.title)}`}
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md border border-[#4e453c] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:border-[#e1c19a] hover:bg-[#11171d]"
              >
                <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                {t("applyNow")}
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
