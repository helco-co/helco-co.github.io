import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Cpu, HeartPulse, ShoppingBag, Zap, type LucideIcon } from "lucide-react";

import industries from "@/data/industries.json";
import services from "@/data/services.json";
import { localeHref } from "@/lib/href";

const ICONS: Record<string, LucideIcon> = {
  retail: ShoppingBag,
  "healthcare-life-sciences": HeartPulse,
  "energy-infrastructure": Zap,
  "technology-innovation": Cpu,
};

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

  return (
    <main id="main" className="w-full pb-20 pt-28">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-8 px-4 sm:px-8 lg:px-14 2xl:px-20">
        <section className="rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 sm:p-8 lg:p-10">
          <div className="max-w-4xl space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
              <span className="h-px w-8 bg-[#e1c19a]" />
              {t("kicker")}
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-[#dee3ea] sm:text-4xl lg:text-5xl">
              {t("pageTitle")}
            </h1>
            <p className="text-base leading-8 text-[#b3a89c] sm:text-lg">{t("pageDescription")}</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {industries.map((ind) => {
            const Icon = ICONS[ind.slug] ?? ShoppingBag;
            return (
              <a
                key={ind.slug}
                href={localeHref(locale, `/industries/${ind.slug}`)}
                className="group rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition hover:border-[#a88c68]/60 hover:bg-[#1e242a] sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#3a4047] bg-[#11171d] shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 text-[#e1c19a]" aria-hidden="true" />
                  </span>
                  <h2 className="text-xl font-semibold text-[#dee3ea] sm:text-2xl">{ind.title}</h2>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#b3a89c]">{ind.description}</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {ind.stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg border border-[#2a2f35] bg-[#12181e] px-4 py-3"
                    >
                      <p className="text-xl font-bold text-[#e1c19a]">{s.value}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[#a89d92]">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </a>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-[#dee3ea] sm:text-3xl">
            {services.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#b3a89c]">
            {services.cta.description}
          </p>
          <a
            href={localeHref(locale, "/contact#enterprise-contact-form")}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
          >
            {contact("talkToExpert")}
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
