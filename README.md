# HELCO — Hany ElAraby & Co

Marketing site for HELCO, an Egyptian audit, tax, and advisory firm. Next.js 15 (App
Router) + Tailwind v4 + next-intl, English and Arabic with full RTL.

Rebuilt from the previous Vercel deployment, whose source was unavailable. The old
rendered output was scraped into `_reference/` (gitignored) and ported to components.

## Running

```bash
npm install
npm run dev     # http://localhost:3100
npm run build
```

## Structure

| Path | What |
| --- | --- |
| `src/app/[locale]/` | Routes: home, services, industries, industries/[sector], careers, contact |
| `src/components/` | Header (mega menus), Footer, homepage sections, forms |
| `messages/{en,ar}.json` | All shell + homepage copy |
| `src/data/services.json` | Services page: 3 pillars, 19 groups, 124 line items |
| `src/data/industries.json` | 4 sectors with stats |
| `src/lib/site.ts` | Phone numbers, email, shared link lists |

Copy in `messages/` is bilingual. `src/data/` is English-only — see Known gaps.

## Design tokens

Recovered from the old build; defined in `src/app/globals.css`.
Ground `#0f1419`, panels `#1b2025`, borders `#30353b`, accent `#a88c68` with
`#e1c19a` on hover, body text `#dee3ea`, muted `#9a8f84`.

## Known gaps before launch

1. **Forms have no backend.** Contact and careers forms compose a `mailto:` to
   `Info@hanyelaraby.com`. They work, but there is no delivery guarantee, no spam
   protection, and CVs must be attached manually. Wire a real endpoint
   (Formspree, Resend, or a route handler) before launch.
2. **Inner pages are English-only.** Services, industries, and careers body copy
   render English under `/ar` too. This matches the old site, which was never
   translated there. Translating `src/data/*.json` needs a professional review.
3. **Insights are placeholders.** Three static cards linking to `#insights`.
4. **Footer legal links are `#`.** Privacy, terms, and cookie settings need pages.
5. **Domain not connected.** No custom domain configured yet.
