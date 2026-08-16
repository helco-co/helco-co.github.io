"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Stat = { value: string; label: string };

/** Splits "$2B+" into {prefix:"$", number:2, suffix:"B+"} so only the numeric
 *  core animates, currency/units stay put. */
function parseValue(value: string) {
  const match = /^(\D*)(\d+)(.*)$/.exec(value);
  if (!match) return { prefix: "", number: 0, suffix: value };
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
}

function AnimatedStat({ value, label, animate }: Stat & { animate: boolean }) {
  // Starts at the real figure, so it is correct before any hover and on touch
  // devices, which never hover at all.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    // Not hovered: show the real figure. This is also the repair path — an
    // earlier version ran the count-up only once and cancelled it on
    // mouse-out, so leaving a card mid-count froze the number at whatever it
    // had reached (e.g. "$4B" instead of "$20B") and it never corrected. A
    // statistic that can display a wrong value is worse than no animation, so
    // the true figure is now restored on every exit and the count-up replays.
    if (!animate) {
      setDisplay(value);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const { prefix, number, suffix } = parseValue(value);
    const duration = 1100;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${prefix}${Math.round(number * eased)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      setDisplay(value);
    };
  }, [animate, value]);

  return (
    <div className="rounded-lg border border-[#2a2f35] bg-[#12181e] px-3.5 py-3">
      <p className="text-lg font-bold leading-none text-[#e1c19a]">{display}</p>
      <p className="mt-1.5 text-[10px] uppercase leading-snug tracking-[0.08em] text-[#a89d92]">
        {label}
      </p>
    </div>
  );
}

export default function IndustryCard({
  title,
  family,
  description,
  stats,
  hoverHint,
  tapHint,
}: {
  title: string;
  family: string;
  description: string;
  stats: Stat[];
  hoverHint: string;
  tapHint: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const subRef = useRef<HTMLDivElement>(null);
  const [revealHeight, setRevealHeight] = useState(0);

  useLayoutEffect(() => {
    if (subRef.current) setRevealHeight(subRef.current.scrollHeight);
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    // Not a link — there is no per-sector page to go to; this card is the
    // full picture (description, tags, stats revealed on reveal). Kept
    // focusable so keyboard users can reach the same reveal mouse users get.
    //
    // Desktop has a pointer, so hover drives the reveal. Touch devices have
    // no hover at all — a phone previously fell back to showing everything
    // at once, which is what made the mobile page feel so much longer and
    // more cluttered than the desktop one. Below `sm` a tap now toggles the
    // same reveal instead, so both devices start collapsed; only the trigger
    // differs. `isDesktop` (not a hover-capability check) gates which one is
    // live, matching the same width-based split already used everywhere else
    // on this page.
    //
    // Focus is gated the same way, not just hover: a touch tap on a
    // tabIndex'd element fires both `focus` and `click`, and if focus set
    // `hovered` unconditionally it would race the click toggle below —
    // open, then immediately close, so a tap would silently do nothing.
    <div
      tabIndex={0}
      onMouseEnter={() => isDesktop && setHovered(true)}
      onMouseLeave={() => isDesktop && setHovered(false)}
      onFocus={() => isDesktop && setHovered(true)}
      onBlur={() => isDesktop && setHovered(false)}
      onClick={() => {
        if (!isDesktop) setHovered((v) => !v);
      }}
      className="group flex flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition-all duration-300 hover:z-20 hover:translate-y-[-3px] hover:border-[#a88c68]/60 hover:bg-[#1e242a] hover:shadow-[0_14px_34px_rgba(0,0,0,0.35)] focus-visible:z-20 focus-visible:translate-y-[-3px] focus-visible:border-[#a88c68]/60 focus-visible:bg-[#1e242a] focus-visible:shadow-[0_14px_34px_rgba(0,0,0,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a88c68] sm:p-7"
    >
      <h2 className="text-xl font-semibold leading-tight text-[#e1c19a] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#a88c68]">
        {family}
      </div>

      {/* Two hints, one per input method — never both at once. Opacity is
          driven by the same `hovered` state as the reveal itself rather than
          CSS group-hover: a tap does not reliably set the :hover pseudo-class
          on touch browsers, so the mobile hint needs a real state change to
          fade correctly. */}
      <span
        className="mt-4 hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#5c666f] transition-opacity duration-300 sm:block"
        style={{ opacity: hovered ? 0 : 1 }}
      >
        {hoverHint}
      </span>
      <span
        className="mt-4 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#5c666f] transition-opacity duration-300 sm:hidden"
        style={{ opacity: hovered ? 0 : 1 }}
      >
        {tapHint}
      </span>

      {/* Collapsed by default on every device now, expanding to `revealHeight`
          (measured from the actual content) — matching 1B's in-card growth,
          which pushes the cards below it down rather than floating over
          them. Set as inline style, mirroring 1B's own JS (support.js
          toggles `sub.style.maxHeight` directly) rather than a `group-hover:`
          utility, which lost the cascade to the collapsed-state class at
          equal-looking specificity — and which a tap cannot drive anyway. */}
      <div
        ref={subRef}
        style={{
          maxHeight: hovered ? revealHeight : 0,
          opacity: hovered ? 1 : 0,
          marginTop: hovered ? 16 : 0,
          overflow: "hidden",
        }}
        className="transition-all duration-300 ease-out"
      >
        <p className="text-sm leading-7 text-[#ffffff]">{description}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} animate={hovered} />
          ))}
        </div>
      </div>
    </div>
  );
}
