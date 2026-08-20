"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { BASE, localeHref } from "@/lib/href";

type Slide = { img: string; k: string; href: string };

// The Capital Markets slide was dropped in the designer's latest revision, so the
// carousel runs three slides. Keys stay slide1/3/4 to match the message catalog.
const SLIDES: Slide[] = [
  { img: "/images/hero.webp", k: "slide1", href: "/about" },
  { img: "/images/our-services.webp", k: "slide3", href: "/services" },
  // The team slide lands on the standalone Our Experts page.
  { img: "/images/our-team.webp", k: "slide4", href: "/about/our-experts" },
];

const INTERVAL = 7000;

export default function HeroCarousel() {
  const t = useTranslations("HeroCarousel");
  const locale = useLocale();
  const [index, setIndex] = useState(0);

  const go = useCallback((n: number) => setIndex((n + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  const slide = SLIDES[index];
  const href = slide.href.startsWith("#") ? slide.href : localeHref(locale, slide.href);

  return (
    <section
      onClick={next}
      className="relative min-h-[calc(100svh-5rem)] w-full cursor-pointer overflow-hidden"
      aria-roledescription="carousel"
    >
      {SLIDES.map((s, i) => (
        <div key={s.img} className="absolute inset-0" aria-hidden={i !== index}>
          <Image
            src={`${BASE}${s.img}`}
            alt=""
            fill
            sizes="100vw"
            // All three are pre-compressed and under 1 MB combined. Loading them
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

          <h1 className="text-3xl font-extrabold leading-tight text-[#e1c19a] sm:text-4xl md:text-5xl lg:text-6xl">
            {t(`${slide.k}Title`)}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#d1c4b8] sm:text-base md:text-lg md:leading-8">
            {t(`${slide.k}Desc`)}
          </p>
          <div className="pt-2 sm:pt-4">
            <a
              href={href}
              // The CTA is real navigation, not a "go to next slide" click — stop it
              // here so it doesn't also advance the carousel underneath it.
              onClick={(e) => e.stopPropagation()}
              // The primary CTA on the site's first screen: 35px tall on mobile
              // before this. 11px text also stops it reading as a hairline.
              className="inline-flex min-h-11 items-center rounded-md bg-[#a88c68] px-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a] sm:min-h-0 sm:px-6 sm:py-3 sm:text-xs"
            >
              {t(`${slide.k}CTA`)}
            </a>
          </div>
        </div>
      </div>

      {/* Slide dots — the only remaining control. Stops the click from also
          bubbling up to the whole-section "advance" handler. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-x-4 bottom-6 z-20 flex items-center gap-1.5 sm:inset-x-8 sm:bottom-8 sm:gap-2 lg:inset-x-14 xl:inset-x-20 2xl:inset-x-24"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.img}
            type="button"
            onClick={() => go(i)}
            aria-label={t("goToSlide", { number: i + 1 })}
            aria-current={i === index}
            // The visible bar stays 8px tall; the pseudo-element carries a
            // ~32x44 touch area so the dots are thumb-reachable without the
            // indicator turning into three fat pills.
            className={`relative h-2 w-6 rounded-full transition before:absolute before:-inset-x-1 before:-inset-y-[18px] before:content-[''] sm:h-2.5 sm:w-8 sm:before:hidden ${
              i === index ? "bg-[#e1c19a]" : "bg-[#4e453c]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
