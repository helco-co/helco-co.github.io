import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import industries from "@/data/industries.json";
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

  return (
    <main id="main" className="w-full pb-20 pt-20">
      <section className="border-b border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-4 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20 2xl:px-24">
        <div className="max-w-4xl space-y-5">
          <span className="kicker block">{t("kicker")}</span>
          <h1 className="text-3xl font-extrabold leading-tight text-[#dee3ea] sm:text-4xl lg:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[#9a8f84] sm:text-lg">
            {t("pageDescription")}
          </p>
        </div>
      </section>

      <div className="grid gap-6 px-4 pt-16 sm:px-8 lg:grid-cols-2 lg:px-14 xl:px-20 2xl:px-24">
        {industries.map((ind) => (
          <article
            key={ind.slug}
            className="group flex flex-col rounded-3xl border border-[#30353b] bg-[#1b2025] p-6 transition hover:border-[#4a515a] hover:bg-[#1e242a] sm:p-10"
          >
            <h2 className="text-xl font-semibold text-[#dee3ea] sm:text-2xl">{ind.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-7 text-[#9a8f84] sm:text-base sm:leading-8">
              {ind.description}
            </p>

            <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[#30353b] bg-[#30353b] sm:grid-cols-2">
              {ind.stats.map((s) => (
                <div key={s.label} className="bg-[#11171d] px-5 py-6 text-center">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-2xl font-extrabold text-[#e1c19a]">{s.value}</span>
                    <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7c746c]">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href={localeHref(locale, `/industries/${ind.slug}`)}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:text-[#f4d3ab]"
            >
              {t("explorePrefix")} {ind.title}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
