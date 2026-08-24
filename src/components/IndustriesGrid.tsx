"use client";

import { useState } from "react";
import IndustryCard from "./IndustryCard";

type Industry = {
  slug: string;
  title: string;
  family: string;
  description: string;
  stats: { value: string; label: string }[];
};

const pillBase =
  "inline-flex min-h-11 items-center rounded-full px-5 py-2.5 font-mono text-[11.5px] uppercase tracking-[0.1em] transition-all duration-200 sm:min-h-0";

export default function IndustriesGrid({
  industries,
  hoverHint,
  tapHint,
  allSectorsLabel,
}: {
  industries: Industry[];
  hoverHint: string;
  tapHint: string;
  allSectorsLabel: string;
}) {
  const families = Array.from(new Set(industries.map((ind) => ind.family)));
  const [filter, setFilter] = useState("all");

  const visible =
    filter === "all" ? industries : industries.filter((ind) => ind.family === filter);

  return (
    <div className="space-y-8 pb-16 sm:pb-20">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? `${pillBase} border border-[#a88c68] bg-[#e1c19a] font-semibold text-[#1f1400]`
              : `${pillBase} border border-[#30353b] bg-[#12181e] text-[#b3a89c] hover:border-[#a88c68]/40 hover:text-[#e1c19a]`
          }
        >
          {allSectorsLabel}
        </button>
        {families.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              filter === f
                ? `${pillBase} border border-[#a88c68] bg-[#e1c19a] font-semibold text-[#1f1400]`
                : `${pillBase} border border-[#30353b] bg-[#12181e] text-[#b3a89c] hover:border-[#a88c68]/40 hover:text-[#e1c19a]`
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* No `items-start`: row-mates stretch to match a hovered card's expanded
          height, which is what 1B does — the collapsed neighbours grow their
          box with empty space rather than staying short. */}
      {/* Two per row on phones — halves the scroll on a page of 15 cards.
          Tighter gap below `sm` so two columns still leave a readable
          card width at 375px. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {visible.map((ind) => (
          <IndustryCard
            key={ind.slug}
            title={ind.title}
            family={ind.family}
            description={ind.description}
            stats={ind.stats}
            hoverHint={hoverHint}
            tapHint={tapHint}
          />
        ))}
      </div>
    </div>
  );
}
