"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LoaderCircle, Send } from "lucide-react";

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

type Status = "idle" | "sending" | "sent" | "error";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// One question-and-answer block per submitted field, styled after a Google
// Forms response notification — plain, label-over-answer, no branding
// beyond a thin accent rule, so it reads cleanly in any mail client.
const htmlField = (label: string, valueHtml: string) => `
<div style="padding:14px 0;border-bottom:1px solid #e5e5e5;">
  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#666;margin-bottom:4px;">${escapeHtml(label)}</div>
  <div style="font-size:14px;color:#111;line-height:1.5;">${valueHtml}</div>
</div>`;

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<Status>("idle");
  // Sent to the endpoint as a bot signal — a form submitted less than 1.5s
  // after it rendered was filled in by a script, not a person.
  const renderedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const lines: string[] = [];
    const fieldsHtml: string[] = [];
    for (const f of TEXT_FIELDS) {
      const v = String(data.get(f.name) ?? "").trim();
      if (v) {
        lines.push(`${t(`field.${f.name}`)}: ${v}`);
        fieldsHtml.push(htmlField(t(`field.${f.name}`), escapeHtml(v)));
      }
    }
    for (const f of SELECT_FIELDS) {
      const v = String(data.get(f.name) ?? "").trim();
      if (v) {
        lines.push(`${t(`field.${f.name}`)}: ${t(`option.${f.name}.${v}`)}`);
        fieldsHtml.push(htmlField(t(`field.${f.name}`), escapeHtml(t(`option.${f.name}.${v}`))));
      }
    }
    const message = String(data.get("message") ?? "").trim();
    if (message) {
      lines.push(`\n${t("field.message")}:\n${message}`);
      fieldsHtml.push(htmlField(t("field.message"), escapeHtml(message).replace(/\n/g, "<br>")));
    }

    const fullName = String(data.get("fullName") ?? "");
    const businessEmail = String(data.get("businessEmail") ?? "");
    const subject = `${t("mailSubject")} — ${data.get("companyName") ?? ""}`.trim();

    const bodyHtml = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#a88c68;font-weight:700;margin-bottom:4px;">HELCO</div>
  <div style="font-size:20px;font-weight:700;color:#111;margin-bottom:24px;">${escapeHtml(subject)}</div>
  ${fieldsHtml.join("")}
</div>
</body></html>`;

    setStatus("sending");
    try {
      const payload = new FormData();
      payload.set("subject", subject);
      payload.set("replyToName", fullName);
      payload.set("replyToEmail", businessEmail);
      payload.set("body", lines.join("\n"));
      payload.set("bodyHtml", bodyHtml);
      payload.set("_hp", String(data.get("company_site") ?? ""));
      payload.set("_ts", String(renderedAt.current));

      const res = await fetch(`${SITE.formsEndpoint}/contact.php`, {
        method: "POST",
        body: payload,
      });
      const json: { success?: boolean } = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error("send failed");

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
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
          {t("field.message")} <span className="text-[#e1c19a]"> *</span>
          <textarea
            name="message"
            required
            rows={6}
            placeholder={t("messagePlaceholder")}
            className={inputClass}
          />
        </label>
      </fieldset>

      {/* Honeypot: real visitors never see this field, so anything filling
          it in is a bot. Positioned off-screen rather than display:none or
          type="hidden" — some bots specifically skip fields hidden that way. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label>
          Company Website
          <input type="text" name="company_site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f1400] transition hover:bg-[#e1c19a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          )}
          {status === "sending" ? t("sending") : t("submit")}
        </button>
        <p
          aria-live="polite"
          className={`text-xs leading-6 ${status === "error" ? "text-[#f87171]" : "text-[#a89d92]"}`}
        >
          {status === "sent" ? t("sentNote") : status === "error" ? t("errorNote") : t("privacyNote")}
        </p>
      </div>
    </form>
  );
}
