import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone } from "lucide-react";

import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("metaTitle"), description: t("heroDescription") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <main id="main" className="w-full pb-20 pt-20">
      <section className="border-b border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-4 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20 2xl:px-24">
        <div className="max-w-4xl space-y-5">
          <h1 className="text-3xl font-extrabold leading-tight text-[#dee3ea] sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[#9a8f84] sm:text-lg">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      <div className="flex w-full flex-col gap-12 px-4 pt-16 sm:px-8 lg:px-14 xl:px-20 2xl:px-24">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#30353b] bg-[#1b2025] p-6">
            <Phone className="h-5 w-5 text-[#e1c19a]" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-[#dee3ea]">{t("callUs")}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {SITE.phones.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  dir="ltr"
                  className="text-sm text-[#9a8f84] transition hover:text-[#e1c19a]"
                >
                  {p.label}
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#30353b] bg-[#1b2025] p-6">
            <Mail className="h-5 w-5 text-[#e1c19a]" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-[#dee3ea]">{t("emailUs")}</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-2 block text-sm text-[#9a8f84] transition hover:text-[#e1c19a]"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="space-y-8">
          <SectionHeading title={t("formTitle")} description={t("formDescription")} />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
