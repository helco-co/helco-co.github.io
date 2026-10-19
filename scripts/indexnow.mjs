/**
 * Asks Bing (and the other IndexNow participants) to re-crawl the site.
 *
 * Bing Webmaster Tools is the usual way to do this, but it needs the domain
 * owner's Microsoft account. IndexNow needs no account at all: ownership is
 * proven by hosting a key file at the domain root, which `public/<key>.txt`
 * does, and which ships with every deploy.
 *
 * Run after a deploy, not before — the crawler fetches the URLs immediately,
 * so submitting pages that are not live yet wastes the request.
 *
 * Usage: node scripts/indexnow.mjs [key]
 *        node scripts/indexnow.mjs            (reads INDEXNOW_KEY)
 */
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const HOST = "hanyelaraby.com";
const ROOT = fileURLToPath(new URL("../", import.meta.url));

const key = process.argv[2] ?? process.env.INDEXNOW_KEY;
if (!key) {
  console.error("No key. Pass it as an argument or set INDEXNOW_KEY.");
  process.exit(1);
}

// The key file is the proof of ownership, so refuse to submit without it
// rather than let the endpoint reject the whole batch.
const publicFiles = await readdir(join(ROOT, "public"));
if (!publicFiles.includes(`${key}.txt`)) {
  console.error(`public/${key}.txt is missing — that file is what proves ownership.`);
  process.exit(1);
}

// The pages worth a crawl budget: the indexed root plus both locale trees.
const paths = [
  "/",
  ...["en", "ar"].flatMap((l) => [
    `/${l}/`,
    `/${l}/about/`,
    `/${l}/services/`,
    `/${l}/industries/`,
    `/${l}/careers/`,
    `/${l}/contact/`,
  ]),
];
const urlList = paths.map((p) => `https://${HOST}${p}`);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});

// 200 accepted, 202 accepted but the key is still being verified. Anything
// else is worth seeing in full — the body carries the reason.
const body = await res.text();
console.log(`HTTP ${res.status} ${res.statusText}`);
console.log(`submitted ${urlList.length} URLs`);
if (body.trim()) console.log(body.trim());
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
