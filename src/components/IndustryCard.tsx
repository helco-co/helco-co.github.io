"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: string; label: string };

/** Splits "$2B+" into {prefix:"$", number:2, suffix:"B+"} so only the numeric
 *  core animates, currency/units stay put. */
function parseValue(value: string) {
  const match = /^(\D*)(\d+)(.*)$/.exec(value);
  if (!match) return { prefix: "", number: 0, suffix: value };
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
}

function AnimatedStat({ value, label, animate }: Stat & { animate: boolean }) {
  const parsed = useRef(parseValue(value));
  const [display, setDisplay] = useState(
    `${parsed.current.prefix}0${parsed.current.suffix}`
  );
  const started = useRef(false);

  useEffect(() => {
    if (!animate || started.current) return;
    started.current = true;
    const { prefix, number, suffix } = parsed.current;
    const duration = 1100;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${prefix}${Math.round(number * eased)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate]);

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
  stats,
  hoverHint,
}: {
  href: string;
  number: number;
  title: string;
  family: string;
  description: string;
  stats: Stat[];
  hoverHint: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition-all duration-300 hover:z-20 hover:border-[#a88c68]/60 hover:bg-[#1e242a] hover:shadow-[0_14px_34px_rgba(0,0,0,0.35)] sm:p-7"
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

      <span className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#5c666f] transition-opacity duration-300 group-hover:opacity-0">
        {hoverHint}
      </span>

      {/* Reveal panel: absolutely positioned so it overlays whatever sits
          below in the grid rather than pushing it down — a height-animated
          in-flow reveal here would shift every card beneath it during the
          transition, and a click landing mid-shift can miss the link
          entirely. This way the grid never reflows on hover. */}
      <div className="pointer-events-none absolute inset-x-0 top-full z-10 -translate-y-1 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto">
        <div className="mt-2 rounded-2xl border border-[#a88c68]/60 bg-[#1e242a] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:p-7">
          <p className="text-sm leading-7 text-[#ffffff]">{description}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <AnimatedStat key={s.label} value={s.value} label={s.label} animate={hovered} />
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
