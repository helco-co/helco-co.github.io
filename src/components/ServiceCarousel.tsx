"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Swipeable row of service cards for phones. Each card snaps to centre and the
 * next one peeks in at the edge, so the row reads as continuing sideways rather
 * than ending. Position is shown by dots underneath, which are also tappable.
 *
 * Scrolling is native CSS scroll-snap, not a JS-driven track: it keeps the
 * momentum and rubber-banding a phone user expects, and it still works if the
 * dots' script never runs.
 *
 * From `sm` up this collapses back to the ordinary grid — same classes the
 * section carried before — so desktop is untouched.
 */
export default function ServiceCarousel({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // Arabic scrolls the other way and reports scrollLeft as negative in some
    // engines, so measure distance travelled rather than a raw offset.
    const travelled = Math.abs(el.scrollLeft);
    const step = el.scrollWidth / Math.max(items.length, 1);
    setIndex(Math.min(items.length - 1, Math.round(travelled / Math.max(step, 1))));
  }, [items.length]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const step = el.scrollWidth / Math.max(items.length, 1);
    const dir = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    el.scrollTo({ left: dir * step * i, behavior: "smooth" });
    setIndex(i);
  };

  return (
    <>
      {/* The negative margin lets the row bleed to the screen edges while the
          padding keeps the first and last card aligned with the page gutter. */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-1 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-2 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <div key={i} className="w-[82%] shrink-0 snap-center sm:w-auto sm:shrink">
            {child}
          </div>
        ))}
      </div>

      {isMobile && items.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to service ${i + 1} of ${items.length}`}
              aria-current={i === index ? "true" : undefined}
              // The visible dot stays small; the pseudo-element carries a
              // thumb-sized touch area, as on the hero carousel.
              className={`relative h-1.5 rounded-full transition-all duration-200 before:absolute before:-inset-x-1 before:-inset-y-[19px] before:content-[''] ${
                i === index ? "w-5 bg-[#e1c19a]" : "w-1.5 bg-[#4e453c]"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
