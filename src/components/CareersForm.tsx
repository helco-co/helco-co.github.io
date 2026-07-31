"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";

import { SITE } from "@/lib/site";

const LEVELS = ["entry", "mid", "senior", "lead", "executive"] as const;

const inputClass =
  "mt-2 w-full rounded-md border border-[#3a4047] bg-[#11171d] px-4 py-3 text-sm text-[#dee3ea] outline-none transition placeholder:text-[#a89d92] focus:border-[#a88c68]";
const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.08em] text-[#d1c4b8]";

export default function CareersForm() {
  const t = useTranslations("Careers");
  const [sent, setSent] = useState(false);

  /** A CV can't ride along in a mailto, so the visitor's mail client opens
   *  pre-filled and they attach the file. Swap for a real upload endpoint later. */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const level = String(data.get("experienceLevel") ?? "");

    const lines = [
      `${t("field.fullName")}: ${data.get("fullName") ?? ""}`,
      `${t("field.email")}: ${data.get("email") ?? ""}`,
      `${t("field.phoneNumber")}: ${data.get("phoneNumber") ?? ""}`,
      `${t("field.currentTitle")}: ${data.get("currentTitle") ?? ""}`,
      `${t("field.experienceLevel")}: ${level ? t(`level.${level}`) : ""}`,
      "",
      t("attachReminder"),
    ];

    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `${t("mailSubject")} — ${data.get("fullName") ?? ""}`
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  };

  return (
    <form
      id="submit-profile"
      onSubmit={handleSubmit}
      className="scroll-mt-24 space-y-10 rounded-3xl border border-[#30353b] bg-[#1b2025] p-6 sm:p-10"
    >
      <fieldset className="space-y-6">
        <legend className="text-base font-semibold text-[#dee3ea]">
          {t("personalInformation")}
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {(["fullName", "email", "phoneNumber"] as const).map((name) => (
            <label key={name} className={labelClass}>
              {t(`field.${name}`)} <span className="text-[#a88c68]">*</span>
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
        <legend className="text-base font-semibold text-[#dee3ea]">
          {t("professionalBackground")}
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            {t("field.currentTitle")} <span className="text-[#a88c68]">*</span>
            <input type="text" name="currentTitle" required className={inputClass} />
          </label>
          <label className={labelClass}>
            {t("field.experienceLevel")} <span className="text-[#a88c68]">*</span>
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
        <legend className="text-base font-semibold text-[#dee3ea]">{t("resumeCv")}</legend>
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

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
        >
          <Send className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          {t("submit")}
        </button>
        <p aria-live="polite" className="text-xs leading-6 text-[#a89d92]">
          {sent ? t("sentNote") : ""}
        </p>
      </div>
    </form>
  );
}
