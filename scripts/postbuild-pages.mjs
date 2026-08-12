// Prepares the static export for GitHub Pages.
//
//  1. .nojekyll  — without it Pages strips /_next (Jekyll ignores _underscore dirs)
//                  and the whole site loads unstyled.
//  2. index.html — no middleware in a static export, so the site root needs its own
//                  redirect. Sends Arabic browsers to /ar, everyone else to /en.
//  3. 404.html   — Pages serves this for unknown paths.
import { writeFile, access, mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(ROOT, "out");
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const industriesByLocale = {
  en: JSON.parse(await readFile(join(ROOT, "src/data/industries.json"), "utf8")),
  ar: JSON.parse(await readFile(join(ROOT, "src/data/industries.ar.json"), "utf8")),
};

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, ".nojekyll"), "");

const redirectPage = (title) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="canonical" href="${BASE}/en/">
<meta http-equiv="refresh" content="0; url=${BASE}/en/">
<style>
  html,body{margin:0;height:100%;background:#0f1419;color:#dee3ea;
    font-family:ui-sans-serif,system-ui,sans-serif}
  .wrap{height:100%;display:flex;align-items:center;justify-content:center}
  a{color:#e1c19a}
</style>
<script>
  // Respect the visitor's language before the meta refresh fires.
  (function () {
    var ar = (navigator.languages || [navigator.language || ""])
      .some(function (l) { return String(l).toLowerCase().indexOf("ar") === 0; });
    location.replace("${BASE}/" + (ar ? "ar" : "en") + "/");
  })();
</script>
</head>
<body>
  <div class="wrap"><p>Redirecting to <a href="${BASE}/en/">HELCO</a>&hellip;</p></div>
</body>
</html>
`;

await writeFile(join(OUT, "index.html"), redirectPage("HELCO — Hany ElAraby & Co"));

// A page that has moved for good: fixed target, no language sniffing, and
// noindex so search engines settle on the surviving URL. `linkText` is what
// the fallback link reads if the redirect script does not run.
const movedPage = (title, target, linkText, lang = "en") => `<!doctype html>
<html lang="${lang}"${lang === "ar" ? ' dir="rtl"' : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<style>
  html,body{margin:0;height:100%;background:#0f1419;color:#dee3ea;
    font-family:ui-sans-serif,system-ui,sans-serif}
  .wrap{height:100%;display:flex;align-items:center;justify-content:center}
  a{color:#e1c19a}
</style>
<script>location.replace("${target}");</script>
</head>
<body>
  <div class="wrap"><p>${lang === "ar" ? "تم نقل هذه الصفحة إلى" : "This page has moved to"} <a href="${target}">${linkText}</a>&hellip;</p></div>
</body>
</html>
`;

// /careers/opportunities was merged into /careers (open positions now sit
// directly above the CV form). Keep the old URL working for anyone who
// bookmarked it or found it in search.
const careersLinkText = { en: "Careers at HELCO", ar: "الوظائف في هيلكو" };
for (const l of ["en", "ar"]) {
  const dir = join(OUT, l, "careers", "opportunities");
  await mkdir(dir, { recursive: true });
  await writeFile(
    join(dir, "index.html"),
    movedPage("Careers — HELCO", `${BASE}/${l}/careers#open-positions`, careersLinkText[l], l)
  );
}

// Per-sector industry pages (/industries/retail, etc.) were removed — every
// card already shows its full description, tags, and stats on hover/focus,
// so the standalone page was a redundant click, not a real destination.
//
// The static host has no delete step in this deploy (files are only ever
// uploaded, never removed — see scripts/deploy-cpanel.mjs), so the old
// build's sector pages stay live at their URLs until something overwrites
// them. This does that on every deploy: each old sector path is regenerated
// as a redirect back to the industries grid, so a stale copy can never
// persist for more than one deploy cycle.
const industriesLinkText = { en: "Industries We Serve", ar: "القطاعات التي نخدمها" };
for (const l of ["en", "ar"]) {
  for (const ind of industriesByLocale[l]) {
    const dir = join(OUT, l, "industries", ind.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, "index.html"),
      movedPage(`${ind.title} — HELCO`, `${BASE}/${l}/industries`, industriesLinkText[l], l)
    );
  }
}

// Next only emits a top-level 404.html when there is a root not-found route; ours
// lives under [locale], so fall back to a redirect page if it is missing.
if (!(await exists(join(OUT, "404.html")))) {
  await writeFile(join(OUT, "404.html"), redirectPage("Page not found — HELCO"));
  console.log("404.html: generated fallback");
} else {
  console.log("404.html: emitted by Next");
}

// Sanity check that the locale roots actually exist.
for (const l of ["en", "ar"]) {
  const p = join(OUT, l, "index.html");
  console.log(`${l}/index.html: ${(await exists(p)) ? "ok" : "MISSING"}`);
}

const idx = await readFile(join(OUT, "index.html"), "utf8");
console.log(`index.html redirect base: "${BASE || "(none)"}"`, idx.includes(`${BASE}/en/`) ? "ok" : "BAD");
