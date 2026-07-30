import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ExternalLink, MapPin } from "lucide-react";

import partners from "@/data/partners.json";
import SectionHeading from "./SectionHeading";
import { BASE } from "@/lib/href";

export default async function PartnersSection() {
  const t = await getTranslations("Partners");

  return (
    <section className="space-y-8">
      <SectionHeading kicker={t("kicker")} title={t("title")} description={t("description")} />

      <div className="space-y-6">
        {partners.map((partner) => (
          <article
            key={partner.id}
            className="overflow-hidden rounded-3xl border border-[#30353b] bg-[#11171d]"
          >
            <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,260px)_1fr] lg:items-center lg:gap-12 lg:p-14">
              <div className="flex items-center justify-center rounded-2xl border border-[#30353b] bg-[#0f1419] p-8">
                <Image
                  src={`${BASE}${partner.logo}`}
                  alt={partner.name}
                  width={partner.logoWidth}
                  height={partner.logoHeight}
                  className="h-auto w-full max-w-[220px]"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-xl font-semibold text-[#dee3ea] sm:text-2xl">
                    {partner.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#e1c19a]">
                    {t(`${partner.id}.tagline`)}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-[#7c746c]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {t(`${partner.id}.country`)}
                  </p>
                </div>

                <p className="max-w-2xl text-sm leading-7 text-[#9a8f84]">
                  {t(`${partner.id}.description`)}
                </p>

                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:text-[#f4d3ab]"
                >
                  {t("visitWebsite")}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
