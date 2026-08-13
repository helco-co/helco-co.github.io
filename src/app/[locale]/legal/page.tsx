import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");

  const sections = [
    { id: "privacy", ns: "privacy" as const, paragraphs: ["p1", "p2", "p3", "p4", "p5"] },
    { id: "terms", ns: "terms" as const, paragraphs: ["p1", "p2", "p3", "p4", "p5"] },
    { id: "cookies", ns: "cookie" as const, paragraphs: ["p1", "p2", "p3"] },
  ];

  return (
    <main id="main" className="w-full pb-20 pt-20">
      <section className="border-b border-[#30353b] bg-gradient-to-br from-[#171c21] via-[#12181e] to-[#0b0f13] px-4 py-16 sm:px-8 lg:px-14 lg:py-24 xl:px-20 2xl:px-24">
        <div className="max-w-4xl space-y-5">
          <h1 className="text-3xl font-extrabold leading-tight text-[#e1c19a] sm:text-4xl lg:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[#ffffff] sm:text-lg">
            {t("heroDescription")}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#a89d92]">
            {t("updated")}
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-16 sm:px-8 lg:px-14 xl:px-20 2xl:px-24">
        <nav
          aria-label={t("heroTitle")}
          className="flex flex-wrap gap-3 border-b border-[#30353b] pb-8 text-sm font-semibold uppercase tracking-[0.08em]"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-[#30353b] px-4 py-2 text-[#b3a89c] transition hover:border-[#a88c68]/60 hover:text-[#e1c19a]"
            >
              {t(`nav.${s.ns}`)}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-16 pb-4">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-semibold text-[#e1c19a] sm:text-3xl">
                {t(`${s.ns}.title`)}
              </h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="text-sm leading-8 text-[#b3a89c] sm:text-base">
                  {t(`${s.ns}.${p}`)}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
