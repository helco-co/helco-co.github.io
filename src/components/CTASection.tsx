import { getLocale, getTranslations } from "next-intl/server";

import { localeHref } from "@/lib/href";

export default async function CTASection() {
  const t = await getTranslations("CTA");
  const locale = await getLocale();

  return (
    <section className="rounded-2xl border border-[#30353b] bg-[#1b2025] px-6 py-10 sm:px-10 sm:py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold text-[#dee3ea] sm:text-4xl">{t("title")}</h2>
          <p className="text-base leading-8 text-[#b3a89c] sm:text-lg">{t("description")}</p>
        </div>
        <a
          href={localeHref(locale, "/contact")}
          className="inline-flex w-fit items-center justify-center rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a]"
        >
          {t("contact")}
        </a>
      </div>
    </section>
  );
}
