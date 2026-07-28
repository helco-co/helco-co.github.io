import { setRequestLocale } from "next-intl/server";

import HeroCarousel from "@/components/HeroCarousel";
import ServicesSection from "@/components/ServicesSection";
import WhoWeAre from "@/components/WhoWeAre";
import OurLeadership from "@/components/OurLeadership";
import IndustriesSection from "@/components/IndustriesSection";
import InsightsSection from "@/components/InsightsSection";
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
        <WhoWeAre />
        {/* Our Leadership sits directly under Who We Are — both are "About Us". */}
        <OurLeadership />
        <IndustriesSection />
        <InsightsSection />
        <CTASection />
      </div>
    </main>
  );
}
