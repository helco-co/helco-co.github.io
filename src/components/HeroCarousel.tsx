"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { BASE, localeHref } from "@/lib/href";

type Slide = { img: string; k: string; href: string; badge?: boolean };

const SLIDES: Slide[] = [
  { img: "/images/hero.webp", k: "slide1", href: "#services" },
  { img: "/images/capital-markets.webp", k: "slide2", href: "#services", badge: true },
  { img: "/images/our-services.webp", k: "slide3", href: "/services" },
  // Slide 4 is about the team, so it now lands on the new Our Leadership section.
  { img: "/images/our-team.webp", k: "slide4", href: "#leadership" },
];

const INTERVAL = 7000;

export default function HeroCarousel() {
  const t = useTranslations("HeroCarousel");
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const go = useCallback((n: number) => setIndex((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (!playing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, [playing]);

  const slide = SLIDES[index];
  const href = slide.href.startsWith("#") ? slide.href : localeHref(locale, slide.href);

  return (
    <section
      className="relative min-h-[calc(100svh-5rem)] w-full overflow-hidden"
      aria-roledescription="carousel"
    >
      {SLIDES.map((s, i) => (
        <div key={s.img} className="absolute inset-0" aria-hidden={i !== index}>
          <Image
            src={`${BASE}${s.img}`}
            alt=""
            fill
            sizes="100vw"
            // All four are pre-compressed and under 1 MB combined. Loading them
            // eagerly means the carousel never advances onto a blank frame.
            priority={i === 0}
            loading="eager"
            className={`object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/95 via-[#0f1419]/75 to-[#0f1419]/30 rtl:bg-gradient-to-l" />

      <div className="relative z-10 flex min-h-[calc(100svh-5rem)] items-center px-4 pb-32 pt-12 sm:items-end sm:px-8 sm:pb-24 lg:items-center lg:px-14 xl:px-20 2xl:px-24">
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e1c19a] sm:gap-3 sm:text-xs">
            <span className="h-px w-6 bg-[#e1c19a] sm:w-8" />
            {t("institutionalAdvisory")}
          </span>

          {slide.badge && (
            <span className="ms-3 inline-block rounded-full border border-[#a88c68] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
              {t("slide2New")}
            </span>
          )}

          <h1 className="text-3xl font-extrabold leading-tight text-[#dee3ea] sm:text-4xl md:text-5xl lg:text-6xl">
            {t(`${slide.k}Title`)}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#d1c4b8] sm:text-base md:text-lg md:leading-8">
            {t(`${slide.k}Desc`)}
          </p>
          <div className="pt-2 sm:pt-4">
            <a
              href={href}
              className="inline-flex rounded-md bg-[#a88c68] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a] sm:px-6 sm:py-3 sm:text-xs"
            >
              {t(`${slide.k}CTA`)}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-6 z-20 flex flex-col items-start justify-between gap-4 sm:inset-x-8 sm:bottom-8 sm:flex-row sm:items-center lg:inset-x-14 xl:inset-x-20 2xl:inset-x-24">
        <div className="order-2 flex items-center gap-1.5 sm:order-1 sm:gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.img}
              type="button"
              onClick={() => go(i)}
              aria-label={t("goToSlide", { number: i + 1 })}
              aria-current={i === index}
              className={`h-2 w-6 rounded-full transition sm:h-2.5 sm:w-8 ${
                i === index ? "bg-[#e1c19a]" : "bg-[#4e453c]"
              }`}
            />
          ))}
        </div>

        <div className="order-1 flex items-center gap-1.5 self-end sm:order-2 sm:gap-2 sm:self-auto">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={t("previousSlide")}
            className="rounded-md border border-[#4e453c] bg-[#171c21]/80 px-2.5 py-1.5 text-[#dee3ea] transition hover:border-[#e1c19a] hover:text-[#e1c19a] sm:px-3 sm:py-2"
          >
            <span aria-hidden="true" className="rtl:hidden">←</span>
            <span aria-hidden="true" className="hidden rtl:inline">→</span>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={t("nextSlide")}
            className="rounded-md border border-[#4e453c] bg-[#171c21]/80 px-2.5 py-1.5 text-[#dee3ea] transition hover:border-[#e1c19a] hover:text-[#e1c19a] sm:px-3 sm:py-2"
          >
            <span aria-hidden="true" className="rtl:hidden">→</span>
            <span aria-hidden="true" className="hidden rtl:inline">←</span>
          </button>
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? t("pause") : t("play")}
            className="rounded-md border border-[#4e453c] bg-[#171c21]/80 px-2.5 py-1.5 text-[#dee3ea] transition hover:border-[#e1c19a] hover:text-[#e1c19a] sm:px-3 sm:py-2"
          >
            <span aria-hidden="true">{playing ? "⏸" : "▶"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
