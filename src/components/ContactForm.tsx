"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";

import { SITE } from "@/lib/site";

const TEXT_FIELDS = [
  { name: "fullName", type: "text", required: true },
  { name: "businessEmail", type: "email", required: true },
  { name: "companyName", type: "text", required: true },
  { name: "jobTitle", type: "text", required: false },
  { name: "phoneNumber", type: "tel", required: false },
  { name: "countryRegion", type: "text", required: false },
] as const;

const SELECT_FIELDS = [
  { name: "inquiryType", options: ["salesNewBusiness", "partnershipInquiry", "careers"] },
  {
    name: "industry",
    options: ["financialServices", "manufacturing", "healthcare", "energy", "publicSector", "other"],
  },
  { name: "companySize", options: ["s1", "s2", "s3", "s4", "s5"] },
  {
    name: "servicesInterestedIn",
    options: ["auditAssurance", "taxAdvisory", "riskGovernance", "operationalPerformance", "financialAdvisory"],
  },
  { name: "estimatedProjectScope", options: ["scope1", "scope2", "scope3", "scope4"] },
  { name: "preferredContactMethod", options: ["email", "phone", "videoCall"] },
] as const;

const inputClass =
  "mt-2 w-full rounded-md border border-[#3a4047] bg-[#11171d] px-4 py-3 text-sm text-[#dee3ea] outline-none transition placeholder:text-[#a89d92] focus:border-[#a88c68]";
const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.08em] text-[#d1c4b8]";

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [sent, setSent] = useState(false);

  /** No backend is wired yet, so the form hands a fully composed enquiry to the
   *  visitor's mail client. Replace with a real endpoint before launch. */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const lines: string[] = [];
    for (const f of TEXT_FIELDS) {
      const v = String(data.get(f.name) ?? "").trim();
      if (v) lines.push(`${t(`field.${f.name}`)}: ${v}`);
    }
    for (const f of SELECT_FIELDS) {
      const v = String(data.get(f.name) ?? "").trim();
      if (v) lines.push(`${t(`field.${f.name}`)}: ${t(`option.${f.name}.${v}`)}`);
    }
    const message = String(data.get("message") ?? "").trim();
    if (message) lines.push(`\n${t("field.message")}:\n${message}`);

    const subject = `${t("mailSubject")} — ${data.get("companyName") ?? ""}`.trim();
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  };

  return (
    <form
      id="enterprise-contact-form"
      onSubmit={handleSubmit}
      className="scroll-mt-24 space-y-10 rounded-3xl border border-[#30353b] bg-[#1b2025] p-6 sm:p-10"
    >
      <fieldset className="space-y-6">
        <legend className="text-base font-semibold text-[#e1c19a]">{t("basicInformation")}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {TEXT_FIELDS.map((f) => (
            <label key={f.name} className={labelClass}>
              {t(`field.${f.name}`)}
              {f.required && <span className="text-[#e1c19a]"> *</span>}
              <input type={f.type} name={f.name} required={f.required} className={inputClass} />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-base font-semibold text-[#e1c19a]">{t("qualification")}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {SELECT_FIELDS.map((f) => (
            <label key={f.name} className={labelClass}>
              {t(`field.${f.name}`)}
              <select name={f.name} defaultValue="" className={inputClass}>
                <option value="" disabled>
                  {t(`placeholder.${f.name}`)}
                </option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {t(`option.${f.name}.${o}`)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <label className={labelClass}>
          {t("field.message")}
          <textarea
            name="message"
            rows={6}
            placeholder={t("messagePlaceholder")}
            className={inputClass}
          />
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a]"
        >
          <Send className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          {t("submit")}
        </button>
        <p aria-live="polite" className="text-xs leading-6 text-[#a89d92]">
          {sent ? t("sentNote") : t("privacyNote")}
        </p>
      </div>
    </form>
  );
}
