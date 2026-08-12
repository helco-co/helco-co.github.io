import { getLocale, getTranslations } from "next-intl/server";

import { getIndustries } from "@/lib/industries";
import { localeHref } from "@/lib/href";

type Tile = {
  key: string;
  href: string;
  number: number;
  title: string;
  family: string;
};

/** Compact card. The full description, tags, and stats live on the industries
 *  page — a card that must stay legible while sliding past should carry only
 *  what can be read at a glance. */
function IndustryTile({ tile, hidden }: { tile: Tile; hidden?: boolean }) {
  return (
    <li className="shrink-0">
      <a
        href={tile.href}
        // The duplicate copy exists only to make the loop seamless, so it is
        // skipped in the tab order; its list is aria-hidden as a whole.
        tabIndex={hidden ? -1 : undefined}
        className="group flex h-full w-[15rem] flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-5 transition duration-300 hover:border-[#a88c68]/60 hover:bg-[#1e242a] sm:w-[17rem] sm:p-6"
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-[10px] border border-[#3a4047] bg-[#11171d] font-mono text-xs text-[#e1c19a]">
          {String(tile.number).padStart(2, "0")}
        </span>

        <h3 className="mt-4 text-base font-semibold leading-snug text-[#e1c19a] transition group-hover:text-[#f4d3ab] sm:text-lg">
          {tile.title}
        </h3>
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#a88c68]">
          {tile.family}
        </div>
      </a>
    </li>
  );
}

/** One full pass of the sector list. The trailing gap is baked in as padding so
 *  both passes are exactly the same width — that is what makes translating the
 *  track by 50% land the second pass precisely where the first started. */
function TilePass({ tiles, hidden }: { tiles: Tile[]; hidden?: boolean }) {
  return (
    <ul
      className={`flex shrink-0 list-none gap-4 pe-4 sm:gap-5 sm:pe-5 ${
        hidden ? "marquee-duplicate" : ""
      }`}
      aria-hidden={hidden ? "true" : undefined}
    >
      {tiles.map((tile) => (
        <IndustryTile key={hidden ? `dup-${tile.key}` : tile.key} tile={tile} hidden={hidden} />
      ))}
    </ul>
  );
}

export default async function IndustriesMarquee() {
  const t = await getTranslations("Industries");
  const locale = await getLocale();

  const tiles: Tile[] = getIndustries(locale).map((ind, i) => ({
    key: ind.slug,
    href: localeHref(locale, `/industries/${ind.slug}`),
    number: i + 1,
    title: ind.title,
    family: ind.family,
  }));

  return (
    // Bleeds to the viewport edges so cards travel the full width rather than
    // stopping inside the page gutter.
    <div
      className="marquee -mx-4 mt-12 sm:-mx-8 lg:-mx-14 xl:-mx-20 2xl:-mx-24"
      aria-label={t("title")}
    >
      {/* Duration scales with the number of sectors so the row always travels
          at the same speed. With a fixed duration the CSS class alone would
          scroll faster every time a sector is added — going from nine to
          twelve took it from 44 to 58px/s. ~6.6s per card holds it near 44.
          The reduced-motion rule sets `animation: none !important`, which
          still wins over this. */}
      <div
        className="marquee-track"
        style={{ animationDuration: `${(tiles.length * 6.6).toFixed(1)}s` }}
      >
        <TilePass tiles={tiles} />
        <TilePass tiles={tiles} hidden />
      </div>
    </div>
  );
}
