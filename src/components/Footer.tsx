import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

import { QUICK_LINKS, SITE } from "@/lib/site";
import { BASE, localeHref } from "@/lib/href";
import LinkedInIcon from "@/components/icons/LinkedInIcon";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Navigation");
  const locale = await getLocale();

  // Dubai and the North America representative office were removed at the
  // client's request, strings included — leaving them in the message files
  // would still have shipped both addresses in every page's payload. Git
  // history holds them if either office comes back.
  const offices = [{ name: t("cairoOffice"), address: t("cairoAddress") }];

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
            <p className="max-w-md text-sm leading-7 text-[#ffffff]">{t("description")}</p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#e1c19a]" aria-hidden="true" />
                {/* A phone number is the highest-intent tap in this footer;
                    on mobile it gets a full-height target. */}
                <div className="flex flex-wrap gap-x-4 text-sm text-[#b3a89c]">
                  {SITE.phones.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      className="inline-flex min-h-11 items-center transition hover:text-[#e1c19a] sm:min-h-0"
                      dir="ltr"
                    >
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#e1c19a]" aria-hidden="true" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex min-h-11 items-center text-sm text-[#b3a89c] transition hover:text-[#e1c19a] sm:min-h-0"
                >
                  {SITE.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <LinkedInIcon className="h-4 w-4 shrink-0 text-[#e1c19a]" />
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-sm text-[#b3a89c] transition hover:text-[#e1c19a] sm:min-h-0"
                >
                  {t("linkedin")}
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
                    <p className="text-sm font-semibold text-[#e1c19a]">{o.name}</p>
                  </div>
                  <div className="flex items-start gap-2 ps-[22px]">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#a89d92]" aria-hidden="true" />
                    <p className="text-xs leading-5 text-[#a89d92]">{o.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
              {t("quickLinks")}
            </h3>
            {/* Tighter row gap on mobile because each link now carries its own
                44px height; desktop keeps the original 12px rhythm. */}
            <ul className="space-y-0 sm:space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.key}>
                  <a
                    href={localeHref(locale, l.href)}
                    className="inline-flex min-h-11 items-center text-sm text-[#b3a89c] transition hover:text-[#e1c19a] sm:min-h-0"
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
        <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center justify-center gap-3 px-4 py-6 text-center sm:px-8 lg:px-14 2xl:px-20">
          <p className="text-xs text-[#a89d92]">{t("copyright")}</p>
          {/* min-h-11 below `sm` only: these three sat at ~20px tall, well
              under a thumb. Desktop keeps the tighter inline row. */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a89d92]">
            <a
              href={localeHref(locale, "/legal#privacy")}
              className="inline-flex min-h-11 items-center transition hover:text-[#e1c19a] sm:min-h-0"
            >
              {t("privacy")}
            </a>
            <a
              href={localeHref(locale, "/legal#terms")}
              className="inline-flex min-h-11 items-center transition hover:text-[#e1c19a] sm:min-h-0"
            >
              {t("terms")}
            </a>
            <a
              href={localeHref(locale, "/legal#cookies")}
              className="inline-flex min-h-11 items-center transition hover:text-[#e1c19a] sm:min-h-0"
            >
              {t("cookie")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
