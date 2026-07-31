/** Contact details carried over from the previous deployment. Single source of truth —
 *  the header, footer, and contact page all read from here. */
export const SITE = {
  email: "Info@hanyelaraby.com",
  phones: [
    { label: "(+2) 01221161611", href: "tel:+201221161611" },
    { label: "(+2) 01001161611", href: "tel:+201001161611" },
  ],
  linkedin: "https://eg.linkedin.com/company/hany-el-araby-co",
} as const;

export const QUICK_LINKS = [
  { key: "services", href: "/services" },
  { key: "industries", href: "/industries" },
  { key: "careers", href: "/careers" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export const INDUSTRIES = [
  { slug: "retail", key: "retail" },
  { slug: "healthcare-life-sciences", key: "healthcareLifeSciences" },
  { slug: "energy-infrastructure", key: "energyInfrastructure" },
  { slug: "technology-innovation", key: "technologyInnovation" },
] as const;
