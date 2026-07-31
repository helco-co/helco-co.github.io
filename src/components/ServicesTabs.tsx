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
      className="sticky top-20 z-30 -mx-4 mb-10 border-b border-[#30353b] bg-[#0f1419]/95 px-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14 2xl:-mx-20 2xl:px-20"
    >
      <div className="flex items-center gap-1 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const isActive = active === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => go(tab.slug)}
              aria-current={isActive ? "true" : undefined}
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[#a88c68]/15 text-[#e1c19a] shadow-[inset_0_-2px_0_0_#e1c19a]"
                  : "text-[#b3a89c] hover:bg-[#1b2025] hover:text-[#d1c4b8]"
              }`}
            >
              {tab.title}
            </button>
          );
        })}

        <div className="ms-auto flex items-center gap-2">
          <a
            href={localeHref(locale, "/contact#enterprise-contact-form")}
            className="whitespace-nowrap rounded-md bg-[#a88c68] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#39260a] transition hover:bg-[#e1c19a]"
          >
            {t("talkToExpert")}
          </a>
        </div>
      </div>
    </nav>
  );
}
