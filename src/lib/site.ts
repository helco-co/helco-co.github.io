/** Contact details carried over from the previous deployment. Single source of truth —
 *  the header, footer, and contact page all read from here. */
export const SITE = {
  email: "Info@hanyelaraby.com",
  phones: [
    { label: "(+2) 01221161611", href: "tel:+201221161611" },
    { label: "(+2) 01001161611", href: "tel:+201001161611" },
  ],
  linkedin: "https://eg.linkedin.com/company/hany-el-araby-co",
  // The firm's own Google Maps pin. Stored in its resolved `ftid` form rather
  // than the maps.app.goo.gl short link it came from: same destination, but no
  // dependency on a URL shortener and none of the session parameters the short
  // link carries. Verified against the listing — Hany ElAraby & Co, Solidaire
  // Business Center, in front of Mivida Gate 6.
  mapUrl: "https://maps.google.com/?ftid=0x14584099e9dad999:0xac0508bfc6aeeaaa",
  // The static export has no server of its own (GitHub Pages, and the cPanel
  // mirror both just serve files), so form submission is a real PHP endpoint
  // hosted on the live domain — see public/api/. Absolute on purpose: the
  // GitHub Pages preview needs to reach it too, and only the live domain
  // actually runs PHP.
  formsEndpoint: "https://hanyelaraby.com/api",
} as const;

export const QUICK_LINKS = [
  { key: "services", href: "/services" },
  { key: "industries", href: "/industries" },
  { key: "careers", href: "/careers" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;
