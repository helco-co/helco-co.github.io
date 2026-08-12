import { getLocale, getTranslations } from "next-intl/server";

import { getIndustries } from "@/lib/industries";

type Tile = {
  key: string;
  title: string;
  family: string;
};

/** Compact card. The full description, tags, and stats live on the industries
 *  page — a card that must stay legible while sliding past should carry only
 *  what can be read at a glance. Not a link: there is no per-sector page, so
 *  this just travels past. */
function IndustryTile({ tile }: { tile: Tile }) {
  return (
    <li className="flex h-full w-[15rem] shrink-0 flex-col rounded-2xl border border-[#30353b] bg-[#1b2025] p-5 sm:w-[17rem] sm:p-6">
      <h3 className="text-base font-semibold leading-snug text-[#e1c19a] sm:text-lg">
        {tile.title}
      </h3>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#a88c68]">
        {tile.family}
      </div>
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
        <IndustryTile key={hidden ? `dup-${tile.key}` : tile.key} tile={tile} />
      ))}
    </ul>
  );
}

export default async function IndustriesMarquee() {
  const t = await getTranslations("Industries");
  const locale = await getLocale();

  const tiles: Tile[] = getIndustries(locale).map((ind) => ({
    key: ind.slug,
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
