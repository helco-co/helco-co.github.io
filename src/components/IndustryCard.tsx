"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Stat = { value: string; label: string };

/** Splits "‎$2B+" into {prefix:"$", number:2, suffix:"B+"} so only the numeric
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
  icon,
  title,
  description,
  stats,
  hoverHint,
}: {
  href: string;
  icon: ReactNode;
  title: string;
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
      className="group flex flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#a88c68]/60 hover:bg-[#1e242a] hover:shadow-[0_14px_34px_rgba(0,0,0,0.35)] sm:p-7"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#3a4047] bg-[#11171d] shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        <h2 className="text-xl font-semibold leading-tight text-[#e1c19a] sm:text-2xl">
          {title}
        </h2>
      </div>

      {/* Collapsed at rest on hover-capable screens, expands on hover. On
          touch screens (no hover) it stays open, same as before this change —
          a hover-only reveal is not discoverable without a pointer. */}
      <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out sm:grid-rows-[0fr] sm:group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <p className="mt-4 text-sm leading-7 text-[#ffffff]">{description}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <AnimatedStat key={s.label} value={s.value} label={s.label} animate={hovered} />
            ))}
          </div>
        </div>
      </div>

      <span className="mt-4 hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#5c666f] transition-opacity duration-300 group-hover:opacity-0 sm:block">
        {hoverHint}
      </span>
    </a>
  );
}
