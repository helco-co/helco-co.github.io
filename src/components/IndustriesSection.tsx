import { getTranslations } from "next-intl/server";

import industries from "@/data/industries.json";
import SectionHeading from "./SectionHeading";

export default async function IndustriesSection() {
  const t = await getTranslations("Industries");
  const about = await getTranslations("WhoWeAre");

  const stats = [
    { value: String(industries.length), label: t("sectorsLabel") },
    { value: about("stat1Value"), label: about("stat1Label") },
    { value: about("stat2Value"), label: about("stat2Label") },
  ];

  return (
    <section id="industries" className="scroll-mt-24 border-t border-[#30353b] pt-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading kicker={t("kicker")} title={t("pageTitle")} description={t("pageDescription")} />

        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:shrink-0">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[#2a2f35] bg-[#12181e] px-4 py-4 sm:px-5"
            >
              <p className="text-2xl font-bold leading-none text-[#e1c19a] sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-2 text-[10px] uppercase leading-snug tracking-[0.08em] text-[#a89d92]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
