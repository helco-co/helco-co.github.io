"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, ArrowRight, X } from "lucide-react";

import { routing } from "@/i18n/routing";
import { BASE, localeHref } from "@/lib/href";

type MenuItem = { key: string; href: string };
type MenuId = "services" | "industries" | "careers" | "about";

/** Column contents for each mega menu. `key` resolves against the Navigation namespace,
 *  with `${key}Desc` used for the supporting line. */
const MENUS: Record<
  MenuId,
  { href: string; featureKey: string; ctaKey: string; ctaHref: string; items: MenuItem[] }
> = {
  services: {
    href: "/services",
    featureKey: "servicesMenu",
    ctaKey: "viewAllServices",
    ctaHref: "/services",
    items: [
      { key: "auditAndAssurance", href: "/services#audit-assurance" },
      { key: "navAdvisory", href: "/services#advisory-consulting" },
      { key: "navTax", href: "/services#tax-services" },
      // Moved out of the About menu — a consultation is a service, not a company fact.
      { key: "strategicConsultation", href: "/contact#enterprise-contact-form" },
    ],
  },
  industries: {
    href: "/industries",
    featureKey: "industriesWeServe",
    ctaKey: "seeAllIndustries",
    ctaHref: "/industries",
    items: [
      { key: "retail", href: "/industries/retail" },
      { key: "healthcareLifeSciences", href: "/industries/healthcare-life-sciences" },
      { key: "energyInfrastructure", href: "/industries/energy-infrastructure" },
      { key: "technologyInnovation", href: "/industries/technology-innovation" },
    ],
  },
  careers: {
    href: "/careers",
    featureKey: "careersGrowth",
    ctaKey: "viewCareers",
    ctaHref: "/careers",
    items: [
      { key: "currentOpportunities", href: "/careers/opportunities" },
      { key: "submitYourProfile", href: "/careers#submit-profile" },
    ],
  },
  about: {
    href: "/about",
    featureKey: "aboutHelco",
    ctaKey: "learnMoreAboutHelco",
    ctaHref: "/about",
    items: [
      { key: "whoWeAre", href: "/about" },
      { key: "ourLeadership", href: "/about#leadership" },
      { key: "lifeAtHelco", href: "/about/life-at-helco" },
      { key: "contactHelco", href: "/contact" },
    ],
  },
};

const ORDER: MenuId[] = ["services", "industries", "careers", "about"];

export default function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const rawPathname = usePathname();

  const [open, setOpen] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reading-progress bar along the bottom edge of the header, plus the header's
  // own shift from translucent to solid once the page moves.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0);
      setScrolled(y > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Close menus on route change.
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [rawPathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const hoverOpen = (id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(id);
  };

  // Small grace period so the pointer can travel from trigger to panel.
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  /** Swap the locale segment of the current path and keep the visitor on the same
   *  page. Rendered as a real link so it works before hydration and on middle-click. */
  const otherLocale = locale === "en" ? "ar" : "en";
  const switchHref = (() => {
    // usePathname() reports the path with basePath already stripped.
    const segments = (rawPathname || `/${locale}`).split("/");
    if ((routing.locales as readonly string[]).includes(segments[1])) {
      segments[1] = otherLocale;
    } else {
      segments.splice(1, 0, otherLocale);
    }
    const path = segments.join("/") || `/${otherLocale}`;
    return `${BASE}${path}`;
  })();

  const navLink =
    "rounded-md px-3 py-2 text-sm font-medium transition text-[#d1c4b8] hover:text-[#e1c19a]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] border-b shadow-[0_1px_0_rgba(255,255,255,0.06),0_20px_60px_rgba(0,0,0,0.55)] transition-all duration-300 ${
        scrolled
          ? "border-white/[0.12] bg-[#0d1117] backdrop-blur-none"
          : "border-transparent bg-[#0d1117]/20 backdrop-blur-xl backdrop-saturate-[180%]"
      }`}
    >
      {/* Hairline catchlight along the very top edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <nav className="relative z-50 flex h-20 w-full items-center justify-between px-4 sm:px-8 lg:px-14 2xl:px-20">
        <a href={localeHref(locale)} aria-label="HELCO Home" className="inline-flex items-center">
          <Image
            src={`${BASE}/brand/helco-logo.svg`}
            alt="HELCO"
            width={240}
            height={84}
            priority
            className="h-14 w-auto drop-shadow-[0_0_10px_rgba(225,193,154,0.2)] sm:h-16"
          />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {ORDER.map((id) => (
            <li
              key={id}
              className="static"
              onMouseEnter={() => hoverOpen(id)}
              onMouseLeave={hoverClose}
            >
              <a
                href={localeHref(locale, MENUS[id].href)}
                className={navLink}
                aria-expanded={open === id}
                aria-haspopup="true"
                onFocus={() => hoverOpen(id)}
              >
                {t(id)}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={switchHref}
            hrefLang={otherLocale}
            lang={otherLocale}
            className="flex items-center gap-2 rounded-md border border-[#30353b] bg-[#11171d] px-3 py-1.5 text-xs font-semibold text-[#d1c4b8] transition hover:bg-[#1b2025] hover:text-[#e1c19a]"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            {t("language")}
          </a>
          <a
            href={localeHref(locale, "/contact")}
            className="rounded-md bg-[#a88c68] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#39260a] transition hover:bg-[#e1c19a]"
          >
            {t("contact")}
          </a>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="text-2xl leading-none text-[#dee3ea] md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : "☰"}
        </button>
      </nav>

      {/* Desktop mega menu */}
      {ORDER.map((id) => {
        const menu = MENUS[id];
        return (
          <div
            key={id}
            hidden={open !== id}
            onMouseEnter={() => hoverOpen(id)}
            onMouseLeave={hoverClose}
            className="absolute inset-x-0 top-20 hidden border-b border-[#30353b] bg-[#11171d]/98 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur md:block"
          >
            <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:px-14 2xl:px-20">
              <div className="flex flex-col justify-between gap-6 rounded-2xl border border-[#30353b] bg-[#0f1419] p-6">
                <div className="space-y-3">
                  <span className="kicker block">{t(id)}</span>
                  <h2 className="text-xl font-semibold text-[#dee3ea]">
                    {t(menu.featureKey)}
                  </h2>
                  <p className="text-sm leading-7 text-[#9a8f84]">
                    {t(`${menu.featureKey}Desc`)}
                  </p>
                </div>
                <a
                  href={localeHref(locale, menu.ctaHref)}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:text-[#f4d3ab]"
                >
                  {t(menu.ctaKey)}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
                </a>
              </div>

              <ul className="grid gap-2 sm:grid-cols-2">
                {menu.items.map((item) => (
                  <li key={item.key}>
                    <a
                      href={localeHref(locale, item.href)}
                      className="group block rounded-xl border border-transparent p-4 transition hover:border-[#3a4047] hover:bg-[#1b2025]"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-[#dee3ea] group-hover:text-[#e1c19a]">
                        {t(item.key)}
                        <ArrowRight
                          className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-180"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-1.5 block text-xs leading-6 text-[#9a8f84]">
                        {t(`${item.key}Desc`)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-[#30353b] bg-[#0f1419] px-4 pb-8 pt-4 md:hidden">
          <ul className="space-y-1">
            {ORDER.map((id) => (
              <li key={id} className="border-b border-[#1e242a] pb-1">
                <button
                  type="button"
                  onClick={() => setMobileSection((v) => (v === id ? null : id))}
                  aria-expanded={mobileSection === id}
                  className="flex w-full items-center justify-between px-2 py-3 text-left text-base font-medium text-[#d1c4b8]"
                >
                  {t(id)}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileSection === id ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {mobileSection === id && (
                  <ul className="space-y-1 pb-2 ps-3">
                    {MENUS[id].items.map((item) => (
                      <li key={item.key}>
                        <a
                          href={localeHref(locale, item.href)}
                          className="block rounded-lg px-2 py-2.5 text-sm text-[#9a8f84] transition hover:bg-[#1b2025] hover:text-[#e1c19a]"
                        >
                          {t(item.key)}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href={localeHref(locale, MENUS[id].ctaHref)}
                        className="block px-2 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a]"
                      >
                        {t(MENUS[id].ctaKey)}
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={switchHref}
              hrefLang={otherLocale}
              lang={otherLocale}
              className="flex items-center gap-2 rounded-md border border-[#30353b] bg-[#11171d] px-3 py-2 text-xs font-semibold text-[#d1c4b8]"
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              {t("language")}
            </a>
            <a
              href={localeHref(locale, "/contact")}
              className="flex-1 rounded-md bg-[#a88c68] px-5 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#39260a]"
            >
              {t("contact")}
            </a>
          </div>
        </div>
      )}

      {/* Reading progress: a gold bar across the header's bottom edge that fills
          as the page is scrolled. */}
      <div
        aria-hidden="true"
        style={{ width: `${progress}%` }}
        className="pointer-events-none absolute bottom-0 start-0 h-[2px] origin-left bg-gradient-to-r from-[#a88c68] via-[#e1c19a] to-[#a88c68] transition-[width] duration-75"
      />
    </header>
  );
}
