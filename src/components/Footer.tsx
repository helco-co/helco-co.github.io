import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

import { QUICK_LINKS, SITE } from "@/lib/site";
import { BASE, localeHref } from "@/lib/href";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Navigation");
  const locale = await getLocale();

  const offices = [
    { name: t("cairoOffice"), address: t("cairoAddress") },
    { name: t("dubaiOffice"), address: t("dubaiAddress") },
    { name: t("riyadhOffice"), address: t("riyadhAddress") },
  ];

  return (
    <footer className="mt-20 border-t border-[#30353b] bg-[#0b0f13]">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-16 sm:px-8 lg:px-14 2xl:px-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_0.8fr]">
          <div className="space-y-6">
            <a href={localeHref(locale)} aria-label="HELCO Home" className="inline-flex items-center">
              <Image
                src={`${BASE}/brand/helco-logo.svg`}
                alt="HELCO"
                width={260}
                height={92}
                className="h-16 w-auto drop-shadow-[0_0_12px_rgba(225,193,154,0.2)]"
              />
            </a>
            <p className="max-w-md text-sm leading-7 text-[#9a8f84]">{t("description")}</p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#e1c19a]" aria-hidden="true" />
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#9a8f84]">
                  {SITE.phones.map((p) => (
                    <a key={p.href} href={p.href} className="transition hover:text-[#e1c19a]" dir="ltr">
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#e1c19a]" aria-hidden="true" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm text-[#9a8f84] transition hover:text-[#e1c19a]"
                >
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
              {t("globalOffices")}
            </h3>
            <div className="space-y-5">
              {offices.map((o) => (
                <div key={o.name} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-[#e1c19a]" aria-hidden="true" />
                    <p className="text-sm font-semibold text-[#dee3ea]">{o.name}</p>
                  </div>
                  <div className="flex items-start gap-2 ps-[22px]">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#6e6560]" aria-hidden="true" />
                    <p className="text-xs leading-5 text-[#7c746c]">{o.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.key}>
                  <a
                    href={localeHref(locale, l.href)}
                    className="text-sm text-[#9a8f84] transition hover:text-[#e1c19a]"
                  >
                    {nav(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1e2328]">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-8 lg:px-14 2xl:px-20">
          <p className="text-xs text-[#6e6560]">{t("copyright")}</p>
          <div className="flex flex-wrap justify-center gap-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6e6560]">
            <a href="#" className="transition hover:text-[#e1c19a]">{t("privacy")}</a>
            <a href="#" className="transition hover:text-[#e1c19a]">{t("terms")}</a>
            <a href="#" className="transition hover:text-[#e1c19a]">{t("cookie")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
