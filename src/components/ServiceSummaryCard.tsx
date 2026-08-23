"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";

/**
 * Homepage service card. On a phone it shows only its icon, title, and a tap
 * hint until opened — the same "little now, detail on demand" behaviour the
 * industry cards and the /services page cards already use. Three permanently
 * expanded cards ran 442px each and made this one section a third of the
 * whole mobile page.
 *
 * Desktop is deliberately untouched: at `sm` and up every card stays fully
 * expanded with no interaction, exactly as before.
 *
 * The open/closed styling lives in globals.css keyed off `data-open`, not in
 * inline styles: utilities here win over the style attribute, so a
 * class-collapsed / inline-expanded split silently never opened. Driving both
 * states from one CSS rule also means the closed state is correct on the very
 * first paint, before hydration, instead of flashing open and snapping shut.
 */
export default function ServiceSummaryCard({
  icon,
  title,
  description,
  items,
  href,
  exploreLabel,
  tapHint,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  items: string[];
  href: string;
  exploreLabel: string;
  tapHint: string;
}) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const toggle = () => {
    if (isMobile) setOpen((v) => !v);
  };

  return (
    <article
      // Interactive only on mobile: on desktop this is a plain container again,
      // so no keyboard stop or button semantics are advertised where there is
      // nothing to operate.
      {...(isMobile
        ? {
            role: "button" as const,
            tabIndex: 0,
            "aria-expanded": open,
            onClick: toggle,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            },
          }
        : {})}
      className="group flex flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition hover:border-[#4a515a] hover:bg-[#1e242a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a88c68] sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#3a4047] bg-[#11171d] shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-transform group-hover:scale-110">
          {icon}
        </span>
        <h3 className="text-xl font-semibold text-[#e1c19a]">{title}</h3>
      </div>

      {/* Mobile-only affordance, fading out as the card opens so it never sits
          above content it no longer describes. */}
      <span
        className="mt-3 block font-mono text-[11px] uppercase tracking-[0.12em] text-[#8a949d] transition-opacity duration-300 sm:hidden"
        style={{ opacity: open ? 0 : 1 }}
      >
        {tapHint}
      </span>

      {/* From `sm` up the panel becomes the card's growing column so the list
          can still push the Explore link to the bottom edge — that is what
          keeps the three links aligned across the desktop grid. */}
      <div
        data-service-panel
        data-open={open ? "true" : "false"}
        className="sm:mt-4 sm:flex sm:flex-1 sm:flex-col"
      >
        <p className="text-sm leading-7 text-[#ffffff]">{description}</p>

        <ul className="mt-5 space-y-2.5 sm:flex-1">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-[#d1c4b8]">
              <CircleCheck
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e1c19a] transition group-hover:text-[#f4d3ab]"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>

        {/* Stops the tap from toggling the card shut on its way to the link. */}
        <a
          href={href}
          onClick={(e) => e.stopPropagation()}
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:text-[#f4d3ab] sm:mt-6 sm:min-h-0"
        >
          {exploreLabel}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
