import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Quote } from "lucide-react";

import careers from "@/data/careers.json";
import SectionHeading from "@/components/SectionHeading";
import { localeHref } from "@/lib/href";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return {
    title: `${t("lifeAtHelcoTitle")} — HELCO`,
    description: careers.story.title,
  };
}

export default async function LifeAtHelcoPage({
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
          <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#e1c19a] sm:text-base">
            <span className="h-px w-10 bg-[#e1c19a] sm:w-12" />
            {careers.story.kicker}
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-[#dee3ea] sm:text-4xl lg:text-5xl">
            {careers.story.title}
          </h1>
        </div>
      </section>

      <div className="flex w-full flex-col gap-16 px-4 pt-16 sm:px-8 lg:px-14 xl:px-20 2xl:px-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {careers.story.paragraphs.map((p) => (
            <p key={p.slice(0, 32)} className="text-base leading-8 text-[#b3a89c]">
              {p}
            </p>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-[#30353b] bg-[#11171d] p-6 sm:p-10">
            <Quote className="h-6 w-6 text-[#e1c19a]" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-[#dee3ea] sm:text-2xl">
              {careers.mission.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-[#b3a89c]">{careers.mission.body}</p>
          </section>

          <section className="rounded-3xl border border-[#30353b] bg-[#11171d] p-6 sm:p-10">
            <h2 className="text-xl font-semibold text-[#dee3ea] sm:text-2xl">
              {careers.conduct.title}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-[#b3a89c]">
              {careers.conduct.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </section>
        </div>

        <section className="space-y-8">
          <SectionHeading
            kicker={careers.values.kicker}
            title={careers.values.title}
            description={careers.values.intro}
          />
          <div className="divide-y divide-[#30353b] overflow-hidden rounded-3xl border border-[#30353b] bg-[#11171d]">
            {careers.values.items.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-2 p-6 sm:flex-row sm:items-baseline sm:gap-10 sm:p-8"
              >
                <h3 className="shrink-0 text-base font-semibold text-[#e1c19a] sm:w-56">
                  {v.title}
                </h3>
                <p className="text-sm leading-7 text-[#b3a89c] sm:text-base">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-[#30353b] bg-[#11171d] p-8 text-center sm:p-10">
            <h2 className="text-xl font-semibold text-[#dee3ea] sm:text-2xl">
              {t("opportunitiesTitle")}
            </h2>
            <a
              href={localeHref(locale, "/careers/opportunities")}
              className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
            >
              {t("openPositions")}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>

          <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] p-8 text-center sm:p-10">
            <h2 className="text-xl font-semibold text-[#dee3ea] sm:text-2xl">
              {t("strengthenTitle")}
            </h2>
            <a
              href={localeHref(locale, "/contact")}
              className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
            >
              {t("contactExperts")}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
