import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CircleCheck } from "lucide-react";

import industries from "@/data/industries.json";
import services from "@/data/services.json";
import { routing } from "@/i18n/routing";
import { localeHref } from "@/lib/href";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    industries.map((i) => ({ locale, sector: i.slug }))
  );
}

const find = (slug: string) => industries.find((i) => i.slug === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sector: string }>;
}): Promise<Metadata> {
  const { sector } = await params;
  const ind = find(sector);
  if (!ind) return {};
  return { title: `${ind.title} — HELCO`, description: ind.description };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ locale: string; sector: string }>;
}) {
  const { locale, sector } = await params;
  setRequestLocale(locale);

  const ind = find(sector);
  if (!ind) notFound();

  const nav = await getTranslations("Navigation");
  const others = industries.filter((i) => i.slug !== sector);

  return (
    <main id="main" className="w-full pb-20 pt-20">
      <section className="border-b border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-4 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20 2xl:px-24">
        <div className="max-w-4xl space-y-5">
          <a
            href={localeHref(locale, "/industries")}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a] transition hover:text-[#f4d3ab]"
          >
            <span className="h-px w-8 bg-[#e1c19a]" />
            {nav("industriesWeServe")}
          </a>
          <h1 className="text-3xl font-extrabold leading-tight text-[#e1c19a] sm:text-4xl lg:text-5xl">
            {ind.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[#ffffff] sm:text-lg">
            {ind.description}
          </p>
        </div>
      </section>

      <div className="flex w-full flex-col gap-16 px-4 pt-16 sm:px-8 lg:px-14 xl:px-20 2xl:px-24">
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-[#30353b] bg-[#30353b] sm:grid-cols-2">
          {ind.stats.map((s) => (
            <div key={s.label} className="bg-[#11171d] px-6 py-8 text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-3xl font-extrabold text-[#e1c19a] sm:text-4xl">
                  {s.value}
                </span>
                <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a89d92]">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        {/* The three core capability pillars, framed for this sector. */}
        <section className="space-y-8">
          <header className="space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
              <span className="h-px w-8 bg-[#e1c19a]" />
              {nav("servicePortfolio")}
            </span>
            <h2 className="text-2xl font-semibold text-[#e1c19a] sm:text-3xl">
              How we support {ind.title.toLowerCase()}
            </h2>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            {services.pillars.map((p) => (
              <article
                key={p.slug}
                className="group flex flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition hover:border-[#4a515a] hover:bg-[#1e242a] sm:p-8"
              >
                <h3 className="text-lg font-semibold text-[#e1c19a]">{p.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#ffffff]">{p.description}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.groups.slice(0, 4).map((g) => (
                    <li key={g.title} className="flex gap-2.5 text-sm text-[#d1c4b8]">
                      <CircleCheck
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e1c19a] transition group-hover:text-[#f4d3ab]"
                        aria-hidden="true"
                      />
                      {g.title}
                    </li>
                  ))}
                </ul>
                <a
                  href={localeHref(locale, `/services#${p.slug}`)}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:text-[#f4d3ab]"
                >
                  {p.title}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#e1c19a]">{nav("industriesWeServe")}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <a
                key={o.slug}
                href={localeHref(locale, `/industries/${o.slug}`)}
                className="group rounded-2xl border border-[#30353b] bg-[#1b2025] p-5 transition hover:border-[#4a515a] hover:bg-[#1e242a]"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-[#e1c19a] group-hover:text-[#e1c19a]">
                  {o.title}
                  <ArrowRight
                    className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-180"
                    aria-hidden="true"
                  />
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
