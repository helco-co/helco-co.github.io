import { getLocale, getTranslations } from "next-intl/server";
import { localeHref } from "@/lib/href";

export default async function NotFound() {
  const locale = await getLocale();
  const nav = await getTranslations("Navigation");

  return (
    <main
      id="main"
      className="flex min-h-[60svh] w-full flex-col items-center justify-center gap-6 px-4 py-32 text-center"
    >
      <span className="text-6xl font-extrabold text-[#e1c19a]">404</span>
      <p className="max-w-md text-base leading-8 text-[#9a8f84]">
        The page you are looking for is not available.
      </p>
      <a
        href={localeHref(locale, "/about")}
        className="rounded-md bg-[#a88c68] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#39260a] transition hover:bg-[#e1c19a]"
      >
        {nav("aboutHelco")}
      </a>
    </main>
  );
}
