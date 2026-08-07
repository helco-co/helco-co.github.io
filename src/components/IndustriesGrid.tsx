"use client";

import { useState } from "react";
import IndustryCard from "./IndustryCard";

type Industry = {
  slug: string;
  href: string;
  title: string;
  family: string;
  description: string;
  tags: string[];
  stats: { value: string; label: string }[];
};

const pillBase =
  "rounded-full px-5 py-2.5 font-mono text-[11.5px] uppercase tracking-[0.1em] transition-all duration-200";

export default function IndustriesGrid({
  industries,
  hoverHint,
  allSectorsLabel,
}: {
  industries: Industry[];
  hoverHint: string;
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((ind) => (
          <IndustryCard
            key={ind.slug}
            href={ind.href}
            number={industries.indexOf(ind) + 1}
            title={ind.title}
            family={ind.family}
            description={ind.description}
            tags={ind.tags}
            stats={ind.stats}
            hoverHint={hoverHint}
          />
        ))}
      </div>
    </div>
  );
}
