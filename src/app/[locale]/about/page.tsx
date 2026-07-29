import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import WhoWeAre from "@/components/WhoWeAre";
import OurLeadership from "@/components/OurLeadership";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });
  return { title: `${t("aboutHelco")} — HELCO`, description: t("aboutHelcoDesc") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main" className="w-full pb-20 pt-28">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-16 px-4 sm:px-8 lg:px-14 2xl:px-20">
        <WhoWeAre />
        <OurLeadership />
      </div>
    </main>
  );
}
