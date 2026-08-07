/**
 * Uploads the built static site to hanyelaraby.com's public_html over
 * cPanel's UAPI (Fileman::upload_files), batched per directory.
 *
 * Why not cPanel's Git Version Control (which this repo used before):
 * its API has no working "fetch from remote". VersionControl::update
 * only *reports* the clone's state — it never pulls, and creates no
 * task or log when called. The clone therefore stayed pinned on the
 * first commit it was ever given while every deploy reported success
 * and silently republished that same stale snapshot. Uploading the
 * files directly removes that whole moving part.
 *
 * Usage: node scripts/deploy-cpanel.mjs <dir>
 * Env:   CPANEL_HOST, CPANEL_USERNAME, CPANEL_API_TOKEN, CPANEL_DOCROOT
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, posix } from "node:path";

const SRC = process.argv[2];
const HOST = process.env.CPANEL_HOST;
const ROOT = process.env.CPANEL_DOCROOT;
const AUTH = `cpanel ${process.env.CPANEL_USERNAME}:${process.env.CPANEL_API_TOKEN}`;

if (!SRC || !HOST || !ROOT || !process.env.CPANEL_API_TOKEN) {
  console.error("Missing source dir or CPANEL_* environment variables.");
  process.exit(1);
}

/** Every file under `dir`, recursively. */
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, acc);
    else acc.push(path);
  }
  return acc;
}

const files = walk(SRC);
if (!files.length) {
  console.error(`No files found in ${SRC} — refusing to deploy an empty site.`);
  process.exit(1);
}

// One upload call per directory: the API takes a single `dir` per request.
const byDir = new Map();
for (const file of files) {
  const rel = relative(SRC, file).split("\\").join("/");
  const dir = posix.dirname(rel);
  if (!byDir.has(dir)) byDir.set(dir, []);
  byDir.get(dir).push({ path: file, name: posix.basename(rel) });
}

// Shallowest first, so a parent directory exists before its children.
const dirs = [...byDir.keys()].sort(
  (a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b)
);

let uploaded = 0;
const failures = [];

for (const dir of dirs) {
  const target = dir === "." ? ROOT : `${ROOT}/${dir}`;
  const entries = byDir.get(dir);

  for (let i = 0; i < entries.length; i += 15) {
    const batch = entries.slice(i, i + 15);
    const form = new FormData();
    form.append("dir", target);
    form.append("overwrite", "1");
    batch.forEach((file, n) => {
      form.append(`file-${n + 1}`, new Blob([readFileSync(file.path)]), file.name);
    });

    let body;
    try {
      const res = await fetch(`${HOST}/execute/Fileman/upload_files`, {
        method: "POST",
        headers: { Authorization: AUTH },
        body: form,
      });
      body = await res.json();
    } catch (err) {
      failures.push(`${target}: ${err.message}`);
      continue;
    }

    const uploads = body.data?.uploads ?? [];
    for (const file of uploads) {
      if (file.status === 1) uploaded++;
      else failures.push(`${target}/${file.file}: ${file.reason}`);
    }
    if (!uploads.length) failures.push(`${target}: ${JSON.stringify(body.errors)}`);
  }
}

console.log(`Uploaded ${uploaded}/${files.length} files to ${ROOT}`);

if (failures.length) {
  console.error(`\n${failures.length} upload(s) failed:`);
  failures.slice(0, 30).forEach((f) => console.error("  " + f));
  process.exit(1);
}
