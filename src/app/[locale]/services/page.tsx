import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CircleCheck } from "lucide-react";

import services from "@/data/services.json";
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
  const t = await getTranslations("Contact");

  return (
    <main id="main" className="w-full pb-20 pt-20">
      <section className="border-b border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-4 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20 2xl:px-24">
        <div className="max-w-4xl space-y-5">
          <h1 className="text-3xl font-extrabold leading-tight text-[#dee3ea] sm:text-4xl lg:text-5xl">
            {services.intro.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[#9a8f84] sm:text-lg">
            {services.intro.description}
          </p>
          <nav className="flex flex-wrap gap-3 pt-2" aria-label={services.intro.title}>
            {services.pillars.map((p) => (
              <a
                key={p.slug}
                href={`#${p.slug}`}
                className="rounded-md border border-[#4e453c] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:border-[#e1c19a] hover:bg-[#1b2025]"
              >
                {p.title}
              </a>
            ))}
            <a
              href={localeHref(locale, "/contact#enterprise-contact-form")}
              className="rounded-md bg-[#a88c68] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
            >
              {t("talkToExpert")}
            </a>
          </nav>
        </div>
      </section>

      <div className="flex w-full flex-col gap-20 px-4 pt-16 sm:px-8 lg:px-14 xl:px-20 2xl:px-24">
        {services.pillars.map((pillar) => (
          <section key={pillar.slug} id={pillar.slug} className="scroll-mt-24 space-y-8">
            <header className="space-y-3">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
                <span className="h-px w-8 bg-[#e1c19a]" />
                {pillar.title}
              </span>
              <h2 className="text-2xl font-semibold text-[#dee3ea] sm:text-3xl">{pillar.title}</h2>
              <p className="max-w-4xl text-base leading-8 text-[#9a8f84]">{pillar.description}</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pillar.groups.map((group) => (
                <article
                  key={group.slug}
                  id={group.slug}
                  className="group flex scroll-mt-24 flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition hover:border-[#4a515a] hover:bg-[#1e242a]"
                >
                  <span className="inline-flex w-fit rounded-full border border-[#3a4047] bg-[#11171d] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
                    {group.tab}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#dee3ea]">{group.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#9a8f84]">{group.description}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-[#d1c4b8]">
                        <CircleCheck
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e1c19a] transition group-hover:text-[#f4d3ab]"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="overflow-hidden rounded-3xl border border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-[#dee3ea] sm:text-3xl">
            {services.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#9a8f84]">
            {services.cta.description}
          </p>
          <a
            href={localeHref(locale, "/contact#enterprise-contact-form")}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
          >
            {t("talkToExpert")}
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
