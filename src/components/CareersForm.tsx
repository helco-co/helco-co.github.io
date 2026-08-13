"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LoaderCircle, Send } from "lucide-react";

import { SITE } from "@/lib/site";

const LEVELS = ["entry", "mid", "senior", "lead", "executive"] as const;

const inputClass =
  "mt-2 w-full rounded-md border border-[#3a4047] bg-[#11171d] px-4 py-3 text-sm text-[#dee3ea] outline-none transition placeholder:text-[#a89d92] focus:border-[#a88c68]";
const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.08em] text-[#d1c4b8]";

type Status = "idle" | "sending" | "sent" | "error";

export default function CareersForm() {
  const t = useTranslations("Careers");
  const [status, setStatus] = useState<Status>("idle");
  // Sent to the endpoint as a bot signal — see the matching comment in
  // ContactForm.
  const renderedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const level = String(data.get("experienceLevel") ?? "");

    const lines = [
      `${t("field.fullName")}: ${data.get("fullName") ?? ""}`,
      `${t("field.email")}: ${data.get("email") ?? ""}`,
      `${t("field.phoneNumber")}: ${data.get("phoneNumber") ?? ""}`,
      `${t("field.currentTitle")}: ${data.get("currentTitle") ?? ""}`,
      `${t("field.experienceLevel")}: ${level ? t(`level.${level}`) : ""}`,
    ];

    const fullName = String(data.get("fullName") ?? "");
    const email = String(data.get("email") ?? "");
    const cv = data.get("cv");

    setStatus("sending");
    try {
      const payload = new FormData();
      payload.set("subject", `${t("mailSubject")} — ${fullName}`);
      payload.set("replyToName", fullName);
      payload.set("replyToEmail", email);
      payload.set("body", lines.join("\n"));
      payload.set("_hp", String(data.get("company_site") ?? ""));
      payload.set("_ts", String(renderedAt.current));
      if (cv instanceof File && cv.size > 0) payload.set("cv", cv);

      const res = await fetch(`${SITE.formsEndpoint}/careers.php`, {
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
      id="submit-profile"
      onSubmit={handleSubmit}
      className="scroll-mt-24 space-y-10 rounded-3xl border border-[#30353b] bg-[#1b2025] p-6 sm:p-10"
    >
      <fieldset className="space-y-6">
        <legend className="text-base font-semibold text-[#e1c19a]">
          {t("personalInformation")}
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {(["fullName", "email", "phoneNumber"] as const).map((name) => (
            <label key={name} className={labelClass}>
              {t(`field.${name}`)} <span className="text-[#e1c19a]">*</span>
              <input
                type={name === "email" ? "email" : name === "phoneNumber" ? "tel" : "text"}
                name={name}
                required
                className={inputClass}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-base font-semibold text-[#e1c19a]">
          {t("professionalBackground")}
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            {t("field.currentTitle")} <span className="text-[#e1c19a]">*</span>
            <input type="text" name="currentTitle" required className={inputClass} />
          </label>
          <label className={labelClass}>
            {t("field.experienceLevel")} <span className="text-[#e1c19a]">*</span>
            <select name="experienceLevel" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                {t("selectExperience")}
              </option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {t(`level.${l}`)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-[#e1c19a]">{t("resumeCv")}</legend>
        <label className={labelClass}>
          {t("field.cv")}
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx"
            className={`${inputClass} file:me-4 file:rounded file:border-0 file:bg-[#30353b] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#e1c19a]`}
          />
        </label>
        <p className="text-xs leading-6 text-[#a89d92]">{t("attachReminder")}</p>
      </fieldset>

      {/* Honeypot — see the matching comment in ContactForm. */}
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
          {status === "sent" ? t("sentNote") : status === "error" ? t("errorNote") : ""}
        </p>
      </div>
    </form>
  );
}
