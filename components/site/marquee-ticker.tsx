const items = [
  "شحن سريع لجميع مناطق المملكة",
  "خامات فاخرة مختارة بعناية",
  "تصاميم حصرية لا تجدينها في مكان آخر",
  "إرجاع واستبدال خلال 14 يوماً",
  "تفصيل وخياطة يدوية متقنة",
]

export function MarqueeTicker() {
  const content = [...items, ...items]

  return (
    <div className="overflow-hidden border-b border-primary-foreground/10 bg-primary py-2.5 text-primary-foreground">
      <div className="flex w-max animate-marquee gap-10 motion-reduce:animate-none">
        {content.map((item, i) => (
          <span key={i} className="flex items-center gap-10 text-xs tracking-wide whitespace-nowrap">
            {item}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
