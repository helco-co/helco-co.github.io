import { setRequestLocale } from "next-intl/server";

import HeroCarousel from "@/components/HeroCarousel";
import ServicesSection from "@/components/ServicesSection";
import IndustriesSection from "@/components/IndustriesSection";
import CTASection from "@/components/CTASection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main" className="w-full pb-20 pt-20">
      <HeroCarousel />

      <div className="flex w-full flex-col gap-16 px-4 pt-16 sm:gap-20 sm:px-8 sm:pt-20 lg:px-14 xl:px-20 2xl:px-24">
        <ServicesSection />
        <IndustriesSection />
        <CTASection />
      </div>
    </main>
  );
}
