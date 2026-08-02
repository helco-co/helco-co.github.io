export default function SectionHeading({
  kicker,
  title,
  description,
  className = "",
}: {
  kicker?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={`space-y-3 ${className}`}>
      {kicker && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#e1c19a]">
          <span className="h-px w-8 bg-[#e1c19a]" />
          {kicker}
        </span>
      )}
      <h2 className="text-3xl font-semibold text-[#e1c19a] sm:text-4xl">{title}</h2>
      {description && (
        <p className="max-w-3xl text-base leading-8 text-[#ffffff] sm:text-lg">{description}</p>
      )}
    </header>
  );
}
