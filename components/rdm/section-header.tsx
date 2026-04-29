interface SectionHeaderProps {
  eyebrow: string
  number: string
  title: string
  subtitle?: string
  align?: "left" | "center"
}

export function SectionHeader({ eyebrow, number, title, subtitle, align = "left" }: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-4xl"}>
      <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""} font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-6`}>
        <span className="font-serif text-2xl text-muted-foreground/60 not-italic">{number}</span>
        <span className="h-px w-10 bg-border" aria-hidden />
        <span>{eyebrow}</span>
      </div>
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
