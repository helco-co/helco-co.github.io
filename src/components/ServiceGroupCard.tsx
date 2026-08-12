"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { CircleCheck } from "lucide-react";

export default function ServiceGroupCard({
  id,
  icon,
  tab,
  title,
  description,
  items,
  hoverHint,
}: {
  id: string;
  icon: ReactNode;
  tab: string;
  title: string;
  description: string;
  items: string[];
  hoverHint: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const subRef = useRef<HTMLDivElement>(null);
  const [revealHeight, setRevealHeight] = useState(0);

  // Same mechanism as the industry cards: measure the real height once, then
  // toggle it via inline style on hover/focus rather than a CSS `height:auto`
  // transition, which the browser cannot animate directly.
  useLayoutEffect(() => {
    if (subRef.current) setRevealHeight(subRef.current.scrollHeight);
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <article
      id={id}
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="group scroll-mt-28 rounded-2xl border border-[#30353b] bg-[#1b2025] p-6 transition-all duration-300 hover:z-20 hover:translate-y-[-3px] hover:border-[#a88c68]/60 hover:bg-[#1e242a] hover:shadow-[0_14px_34px_rgba(0,0,0,0.35)] focus-visible:z-20 focus-visible:translate-y-[-3px] focus-visible:border-[#a88c68]/60 focus-visible:bg-[#1e242a] focus-visible:shadow-[0_14px_34px_rgba(0,0,0,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a88c68] sm:p-8"
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#3a4047] bg-[#11171d] shadow-[0_8px_20px_rgba(0,0,0,0.28)] transition-transform group-hover:scale-110">
          {icon}
        </span>
        <h3 className="text-2xl font-semibold text-[#e1c19a] sm:text-3xl">{tab}</h3>
      </div>

      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#d1c4b8]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-7 text-[#ffffff]">{description}</p>

      <span className="mt-4 hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#5c666f] transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0 sm:block">
        {hoverHint}
      </span>

      {/* Below `sm` there's no pointer to hover with, so the list renders in
          normal flow, always visible. At `sm` and up it's collapsed by
          default and expands to `revealHeight` on hover/focus — the exact
          mechanism used on the industry cards. */}
      <div
        ref={subRef}
        style={
          isDesktop
            ? {
                maxHeight: hovered ? revealHeight : 0,
                opacity: hovered ? 1 : 0,
                marginTop: hovered ? 20 : 0,
                overflow: "hidden",
              }
            : undefined
        }
        className="mt-5 transition-all duration-300 ease-out sm:mt-0"
      >
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-7 text-[#d1c4b8]">
              <CircleCheck
                className="mt-1 h-4 w-4 shrink-0 text-[#e1c19a] transition-colors group-hover:text-[#f4d3ab]"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
