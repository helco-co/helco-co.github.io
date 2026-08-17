import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Briefcase, Clock, MapPin } from "lucide-react";

import CareersForm from "@/components/CareersForm";
import SectionHeading from "@/components/SectionHeading";
import { getCareers } from "@/lib/careers";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return pageMetadata(locale, "/careers", t("metaTitle"), t("opportunitiesDescription"));
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Careers");
  const careers = getCareers(locale);

  return (
    <main id="main" className="w-full pb-20 pt-20">
      <section className="border-b border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-4 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20 2xl:px-24">
        <div className="max-w-4xl space-y-5">
          <span className="kicker block">{t("joinOurTeam")}</span>
          <h1 className="text-3xl font-extrabold leading-tight text-[#e1c19a] sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[#ffffff] sm:text-lg">
            {t("opportunitiesDescription")}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#submit-profile"
              className="rounded-md bg-[#a88c68] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a]"
            >
              {t("submitGeneralProfile")}
            </a>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[#4e453c] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:border-[#e1c19a] hover:bg-[#1b2025]"
            >
              {t("viewOnLinkedIn")}
            </a>
          </div>
        </div>
      </section>

      <div className="flex w-full flex-col gap-16 px-4 pt-16 sm:px-8 lg:px-14 xl:px-20 2xl:px-24">
        {/* Open roles first, then the general-profile form directly beneath —
            a visitor who finds a role applies to it, and one who doesn't can
            still leave their CV without changing pages. */}
        <section id="open-positions" className="scroll-mt-24 space-y-8">
          <h2 className="text-2xl font-semibold text-[#e1c19a] sm:text-3xl">
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
                  <h3 className="text-lg font-semibold text-[#e1c19a]">{p.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#a89d92]">
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
        </section>

        <section className="space-y-8 border-t border-[#30353b] pt-14">
          <SectionHeading title={t("formTitle")} description={t("formDescription")} />
          <CareersForm />
        </section>
      </div>
    </main>
  );
}
