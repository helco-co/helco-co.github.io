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
  href,
  number,
  title,
  family,
  description,
  tags,
  stats,
  hoverHint,
}: {
  href: string;
  number: number;
  title: string;
  family: string;
  description: string;
  tags: string[];
  stats: Stat[];
  hoverHint: string;
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
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition-all duration-300 hover:z-20 hover:translate-y-[-3px] hover:border-[#a88c68]/60 hover:bg-[#1e242a] hover:shadow-[0_14px_34px_rgba(0,0,0,0.35)] sm:p-7"
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-[11px] border border-[#3a4047] bg-[#11171d] font-mono text-[13px] text-[#e1c19a] shadow-[0_8px_20px_rgba(0,0,0,0.28)]">
        {String(number).padStart(2, "0")}
      </span>

      <h2 className="mt-4 text-xl font-semibold leading-tight text-[#e1c19a] sm:text-2xl">
        {title}
      </h2>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#a88c68]">
        {family}
      </div>

      <span className="mt-4 hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#5c666f] transition-opacity duration-300 group-hover:opacity-0 sm:block">
        {hoverHint}
      </span>

      {/* Below `sm` there's no pointer to hover with, so this renders in normal
          flow, fully visible, at its natural height (no inline style set).
          At `sm` and up it's collapsed by default and expands to
          `revealHeight` (measured from the actual content) on hover — matching
          1B's in-card growth, which pushes the cards below it down rather
          than floating over them. This is set as inline style, mirroring 1B's
          own JS (support.js toggles `sub.style.maxHeight` directly) rather
          than a `group-hover:` utility, which lost the cascade to the
          collapsed-state class at equal-looking specificity. */}
      <div
        ref={subRef}
        style={
          isDesktop
            ? {
                maxHeight: hovered ? revealHeight : 0,
                opacity: hovered ? 1 : 0,
                marginTop: hovered ? 16 : 0,
                overflow: "hidden",
              }
            : undefined
        }
        className="mt-4 transition-all duration-300 ease-out"
      >
        <p className="text-sm leading-7 text-[#ffffff]">{description}</p>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#2a2f35] bg-[#12181e] px-2.5 py-1 font-mono text-[10.5px] text-[#8d8579]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} animate={hovered} />
          ))}
        </div>
      </div>
    </a>
  );
}
