import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Building2 } from "lucide-react";

import { getServices } from "@/lib/services";
import ServicesTabs from "@/components/ServicesTabs";
import ServiceGroupCard from "@/components/ServiceGroupCard";
import ServiceCarousel from "@/components/ServiceCarousel";
import { iconFor } from "@/lib/service-icons";
import { localeHref } from "@/lib/href";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OurServices" });
  return pageMetadata(locale, "/services", `${t("title")} — HELCO`, getServices(locale).intro.description);
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const hero = await getTranslations("Hero");
  const t = await getTranslations("OurServices");
  const services = getServices(locale);

  const tabs = services.pillars.map((p) => ({ slug: p.slug, title: p.title }));

  return (
    <main id="main" className="w-full pb-20 pt-28">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col px-4 sm:px-8 lg:px-14 2xl:px-20">
        {/* On a phone the page opens on the three pillar bars, so the intro
            paragraph is dropped and the title shrinks — together they pushed
            the bars 420px down the page. The h1 stays for structure. */}
        <div className="mx-auto mb-4 max-w-4xl space-y-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#e1c19a] sm:text-5xl lg:text-6xl">
            {services.intro.title}
          </h1>
          <p className="hidden text-lg leading-8 text-[#ffffff] sm:block">
            {services.intro.description}
          </p>
        </div>

        <ServicesTabs tabs={tabs} />

        {/* scroll-mt below `sm` only needs to clear the 80px fixed header: the
            tab bar is not sticky there, so the deeper desktop offset would
            drop the reader in the middle of empty space. */}
        {services.pillars.map((pillar) => (
          <div
            key={pillar.slug}
            id={pillar.slug}
            className="mb-10 scroll-mt-24 space-y-4 sm:mb-24 sm:scroll-mt-36 sm:space-y-10"
          >
            {/* Tapping a bar should land on that pillar's services, so on a
                phone this panel collapses to just its title — the kicker
                repeats the title verbatim, and the description is the block
                that stood between the tap and what was asked for. */}
            <section className="relative overflow-hidden rounded-none border-0 bg-transparent p-0 sm:rounded-2xl sm:border sm:border-[#30353b] sm:bg-[#1b2025] sm:p-8 lg:p-10">
              {/* Oversized watermark icon bleeding out of the top corner. */}
              <div className="pointer-events-none absolute end-0 top-0 hidden p-12 opacity-5 sm:block">
                <Building2 className="h-64 w-64" aria-hidden="true" />
              </div>
              <div className="relative z-10 max-w-4xl space-y-0 sm:space-y-5">
                <span className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a] sm:inline-flex">
                  <span className="h-px w-8 bg-[#e1c19a]" />
                  {pillar.title}
                </span>
                <h2 className="text-xl font-semibold leading-tight text-[#e1c19a] sm:text-4xl">
                  {pillar.title}
                </h2>
                <p className="hidden text-base leading-8 text-[#ffffff] sm:block sm:text-lg">
                  {pillar.description}
                </p>
              </div>
            </section>

            {/* Swiped sideways on a phone, one card at a time; the same grid
                as before from `sm` up. ServiceCarousel owns both layouts. */}
            <section>
              <ServiceCarousel>
                {pillar.groups.map((group) => {
                  const Icon = iconFor(group.icon);
                  return (
                    <ServiceGroupCard
                      key={group.slug}
                      id={group.slug}
                      icon={<Icon className="h-6 w-6" style={{ color: group.color }} aria-hidden="true" />}
                      tab={group.tab}
                      title={group.title}
                      description={group.description}
                      items={group.items}
                      hoverHint={t("hoverForServices")}
                      tapHint={t("tapForServices")}
                    />
                  );
                })}
              </ServiceCarousel>
            </section>
          </div>
        ))}

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-[#e1c19a] sm:text-3xl">
            {services.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#ffffff]">
            {services.cta.description}
          </p>
          <a
            href={localeHref(locale, "/contact#enterprise-contact-form")}
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a] sm:min-h-0"
          >
            {hero("bookConsultation")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
