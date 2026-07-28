import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { BASE } from "@/lib/href";

export default async function InsightsSection() {
  const t = await getTranslations("Insights");

  return (
    <section id="insights" className="scroll-mt-24 space-y-6">
      <header className="space-y-3">
        <h2 className="text-3xl font-semibold text-[#dee3ea] sm:text-4xl">{t("title")}</h2>
        <p className="max-w-3xl text-base leading-8 text-[#9a8f84] sm:text-lg">
          {t("description")}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <article
            key={n}
            className="overflow-hidden rounded-xl border border-[#30353b] bg-[#1b2025]"
          >
            <div className="relative h-48 w-full">
              <Image
                src={`${BASE}/images/hero.webp`}
                alt={t(`insight${n}Title`)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-4 p-6">
              <h3 className="text-xl font-semibold text-[#dee3ea]">{t(`insight${n}Title`)}</h3>
              <p className="text-sm leading-7 text-[#9a8f84] sm:text-base">
                {t(`insight${n}Desc`)}
              </p>
              <a
                href="#insights"
                className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:text-[#a88c68]"
              >
                {t("readInsight")}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
