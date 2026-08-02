import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import CareersForm from "@/components/CareersForm";
import SectionHeading from "@/components/SectionHeading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return { title: t("metaTitle"), description: t("heroDescription") };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Careers");

  return (
    <main id="main" className="w-full pb-20 pt-20">
      <section className="border-b border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-4 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20 2xl:px-24">
        <div className="max-w-4xl space-y-5">
          <span className="kicker block">{t("joinOurTeam")}</span>
          <h1 className="text-3xl font-extrabold leading-tight text-[#e1c19a] sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[#ffffff] sm:text-lg">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      <div className="flex w-full flex-col gap-16 px-4 pt-16 sm:px-8 lg:px-14 xl:px-20 2xl:px-24">
        <section id="opportunities" className="scroll-mt-24 space-y-8">
          <SectionHeading title={t("formTitle")} description={t("formDescription")} />
          <CareersForm />
        </section>
      </div>
    </main>
  );
}
