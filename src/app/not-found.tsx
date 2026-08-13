import type { Metadata } from "next";
import Image from "next/image";
import { Geist } from "next/font/google";

import { BASE } from "@/lib/href";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = { title: "Page Not Found — HELCO" };

// Next's static export can only ever build one /404.html, generated from this
// root file — the locale-aware [locale]/not-found.tsx never runs for it,
// because a truly unmatched path (a mistyped or dead link) carries no locale
// param for Next to resolve at build time. This is the page every visitor
// with a broken link actually sees, on both GitHub Pages and hanyelaraby.com
// (the latter needs an ErrorDocument 404 directive pointed at this file —
// see public/.htaccess).
export default function NotFound() {
  return (
    <main className={`${geistSans.variable} flex min-h-svh w-full flex-col items-center justify-center gap-8 bg-[#0b0f13] px-4 py-24 text-center antialiased`}>
      <a href={`${BASE}/en`} aria-label="HELCO Home" className="inline-flex items-center">
        <Image
          src={`${BASE}/brand/helco-logo.svg`}
          alt="HELCO"
          width={220}
          height={78}
          className="h-14 w-auto drop-shadow-[0_0_12px_rgba(225,193,154,0.2)]"
        />
      </a>
      <span className="text-6xl font-extrabold text-[#e1c19a]">404</span>

      <div className="space-y-2">
        <p className="max-w-md text-base leading-8 text-white">
          The page you are looking for is not available.
        </p>
        <p dir="rtl" className="max-w-md text-base leading-8 text-white">
          الصفحة التي تبحث عنها غير متوفرة.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href={`${BASE}/en`}
          className="rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a]"
        >
          Go to Homepage
        </a>
        <a
          href={`${BASE}/ar`}
          dir="rtl"
          className="rounded-md border border-[#a88c68]/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#e1c19a] transition hover:border-[#a88c68]"
        >
          الصفحة الرئيسية
        </a>
      </div>
    </main>
  );
}
