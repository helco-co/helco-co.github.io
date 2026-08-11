import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { getServices } from "@/lib/services";
import IndustriesGrid from "@/components/IndustriesGrid";
import { getIndustries } from "@/lib/industries";
import { localeHref } from "@/lib/href";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Industries" });
  return { title: `${t("title")} — HELCO`, description: t("pageDescription") };
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Industries");
  const contact = await getTranslations("Contact");
  const services = getServices(locale);

  return (
    <main id="main" className="w-full pb-20 pt-28">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-8 px-4 sm:px-8 lg:px-14 2xl:px-20">
        <section className="rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 sm:p-8 lg:p-10">
          <div className="max-w-4xl space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
              <span className="h-px w-8 bg-[#e1c19a]" />
              {t("kicker")}
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-[#e1c19a] sm:text-4xl lg:text-5xl">
              {t("pageTitle")}
            </h1>
            <p className="text-base leading-8 text-[#ffffff] sm:text-lg">{t("pageDescription")}</p>
          </div>
        </section>

        <IndustriesGrid
          industries={getIndustries(locale).map((ind) => ({
            slug: ind.slug,
            href: localeHref(locale, `/industries/${ind.slug}`),
            title: ind.title,
            family: ind.family,
            description: ind.description,
            tags: ind.tags,
            stats: ind.stats,
          }))}
          hoverHint={t("hoverForDetail")}
          allSectorsLabel={t("allSectors")}
        />

        <section className="overflow-hidden rounded-3xl border border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-[#e1c19a] sm:text-3xl">
            {services.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#ffffff]">
            {services.cta.description}
          </p>
          <a
            href={localeHref(locale, "/contact#enterprise-contact-form")}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a]"
          >
            {contact("talkToExpert")}
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
