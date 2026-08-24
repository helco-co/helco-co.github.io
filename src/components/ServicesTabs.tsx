"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { localeHref } from "@/lib/href";

type Tab = { slug: string; title: string };

/**
 * Sticky pillar switcher for the services page. The active tab carries a short
 * gold underline (an inset shadow) that follows the reader down the page, so the
 * highlight moves between tabs as each pillar scrolls into view.
 */
export default function ServicesTabs({ tabs }: { tabs: Tab[] }) {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [active, setActive] = useState(tabs[0]?.slug ?? "");
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // A scroll listener rather than IntersectionObserver: the pillars are taller
    // than the viewport, so "which one am I reading" is a distance question, not
    // a visibility one.
    const onScroll = () => {
      const navHeight = navRef.current?.offsetHeight ?? 0;
      // Anything above this line counts as read; the last one past it wins.
      const marker = navHeight + 140;
      let current = tabs[0]?.slug ?? "";
      for (const tab of tabs) {
        const el = document.getElementById(tab.slug);
        if (el && el.getBoundingClientRect().top <= marker) current = tab.slug;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [tabs]);

  const go = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(slug);
  };

  return (
    <nav
      ref={navRef}
      aria-label={tabs.map((x) => x.title).join(", ")}
      // Stacked, three bars run ~170px tall — pinned under the 80px header
      // that would hold a third of a phone screen permanently, so below `sm`
      // it scrolls away with the page. Desktop keeps the sticky single row.
      className="static z-30 -mx-4 mb-10 border-b border-[#30353b] bg-[#0f1419]/95 px-4 backdrop-blur sm:sticky sm:top-20 sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14 2xl:-mx-20 2xl:px-20"
    >
      <div className="flex items-center gap-1 py-3 sm:overflow-x-auto sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden">
        {/* One full-width bar per pillar on a phone, stacked. Three columns
            forced the labels down to 11px to fit; at full width they sit at
            the same 14px as everywhere else and read as a list rather than a
            cramped strip. Desktop keeps the single scrolling row. */}
        <div className="grid w-full grid-cols-1 gap-1.5 sm:flex sm:w-auto sm:gap-1">
          {tabs.map((tab) => {
            const isActive = active === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => go(tab.slug)}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-4 text-start text-sm font-medium transition sm:min-h-0 sm:py-2.5 ${
                  isActive
                    ? "bg-[#a88c68]/15 text-[#e1c19a] shadow-[inset_0_-2px_0_0_#e1c19a]"
                    : "text-[#b3a89c] hover:bg-[#1b2025] hover:text-[#d1c4b8]"
                }`}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Hidden on phones: it collided with the tabs, and the floating
            "Request a Consultation" button is already on screen there, so
            this is the same ask twice. */}
        <div className="ms-auto hidden items-center gap-2 sm:flex">
          <a
            href={localeHref(locale, "/contact#enterprise-contact-form")}
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md bg-[#a88c68] px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1f1400] transition hover:bg-[#e1c19a] sm:min-h-0 sm:py-2"
          >
            {t("talkToExpert")}
          </a>
        </div>
      </div>
    </nav>
  );
}
