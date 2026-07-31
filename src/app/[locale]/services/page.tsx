import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Building2, CircleCheck } from "lucide-react";

import services from "@/data/services.json";
import ServicesTabs from "@/components/ServicesTabs";
import { iconFor } from "@/lib/service-icons";
import { localeHref } from "@/lib/href";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OurServices" });
  return { title: `${t("title")} — HELCO`, description: services.intro.description };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const hero = await getTranslations("Hero");

  const tabs = services.pillars.map((p) => ({ slug: p.slug, title: p.title }));

  return (
    <main id="main" className="w-full pb-20 pt-28">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col px-4 sm:px-8 lg:px-14 2xl:px-20">
        <div className="mx-auto mb-8 max-w-4xl space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#dee3ea] sm:text-5xl lg:text-6xl">
            {services.intro.title}
          </h1>
          <p className="text-lg leading-8 text-[#b3a89c]">{services.intro.description}</p>
        </div>

        <ServicesTabs tabs={tabs} />

        {services.pillars.map((pillar) => (
          <div key={pillar.slug} id={pillar.slug} className="mb-24 scroll-mt-36 space-y-10">
            <section className="relative overflow-hidden rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 sm:p-8 lg:p-10">
              {/* Oversized watermark icon bleeding out of the top corner. */}
              <div className="pointer-events-none absolute end-0 top-0 p-12 opacity-5">
                <Building2 className="h-64 w-64" aria-hidden="true" />
              </div>
              <div className="relative z-10 max-w-4xl space-y-5">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
                  <span className="h-px w-8 bg-[#e1c19a]" />
                  {pillar.title}
                </span>
                <h2 className="text-3xl font-semibold leading-tight text-[#dee3ea] sm:text-4xl">
                  {pillar.title}
                </h2>
                <p className="text-base leading-8 text-[#b3a89c] sm:text-lg">
                  {pillar.description}
                </p>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              {pillar.groups.map((group) => {
                const Icon = iconFor(group.icon);
                return (
                  <article
                    key={group.slug}
                    id={group.slug}
                    className="group scroll-mt-28 rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition-all hover:border-[#4a515a] hover:bg-[#1e242a] sm:p-8"
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#3a4047] bg-[#11171d] shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-transform group-hover:scale-110">
                        <Icon
                          className="h-6 w-6"
                          style={{ color: group.color }}
                          aria-hidden="true"
                        />
                      </span>
                      <h3 className="text-2xl font-semibold text-[#dee3ea] sm:text-3xl">
                        {group.tab}
                      </h3>
                    </div>

                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#d1c4b8]">
                      {group.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#b3a89c]">{group.description}</p>

                    <ul className="mt-5 space-y-3">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-7 text-[#d1c4b8]">
                          <CircleCheck
                            className="mt-1 h-4 w-4 shrink-0 text-[#e1c19a] transition-colors group-hover:text-[#f4d3ab]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </section>
          </div>
        ))}

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-[#dee3ea] sm:text-3xl">
            {services.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#b3a89c]">
            {services.cta.description}
          </p>
          <a
            href={localeHref(locale, "/contact#enterprise-contact-form")}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a]"
          >
            {hero("bookConsultation")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
