import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing, isRtl } from "@/i18n/routing";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookConsultation from "@/components/BookConsultation";
import "../globals.css";

// Static, business-identity facts — the same regardless of which locale
// rendered the page, matching how most multinational sites keep a single
// canonical-language structured-data block rather than translating it.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: "HELCO — Hany ElAraby & Co",
  alternateName: "Hany, Saleh & Co",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/helco-icon-96.png`,
  image: `${SITE_URL}/brand/helco-icon-96.png`,
  telephone: SITE.phones.map((p) => p.href.replace("tel:", "")),
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Solidaire Business Center, Mivida St, Bldg. 1, in front of Mivida Gate 6",
    addressLocality: "New Cairo",
    addressCountry: "EG",
  },
  sameAs: [SITE.linkedin],
};

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return pageMetadata(locale, "", t("title"), t("description"));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Navigation" });

  return (
    <html lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Static, trusted business data only — no user input reaches this
            block, so inlining the JSON is safe. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#a88c68] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#1f1400]"
          >
            {t("skipToContent")}
          </a>
          <Header />
          {children}
          <Footer />
          <BookConsultation />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
