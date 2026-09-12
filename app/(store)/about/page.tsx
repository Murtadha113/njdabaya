import type { Metadata } from "next"
import Image from "next/image"
import { Gem, HandHeart, Leaf, Sparkles } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { getTestimonials } from "@/lib/data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "من نحن | نجد",
  description: "تعرّفي على قصة نجد، رسالتنا، وقيمنا في تقديم عبايات فاخرة تجمع بين الحشمة والأناقة العصرية.",
}

const values = [
  {
    icon: Gem,
    title: "جودة لا تُساوم",
    description: "نختار أقمشتنا بعناية فائقة من أفضل الموردين، ونحرص على خياطة متقنة تدوم طويلاً.",
  },
  {
    icon: HandHeart,
    title: "حرفية يدوية",
    description: "نتعاون مع أمهر الأيادي في التفصيل والتطريز لنقدّم قطعاً استثنائية بلمسة إنسانية.",
  },
  {
    icon: Sparkles,
    title: "تصاميم عصرية",
    description: "نواكب أحدث صيحات الموضة دون التخلي عن الحشمة والأصالة في كل تصميم.",
  },
  {
    icon: Leaf,
    title: "استدامة واعية",
    description: "نسعى لاختيار خامات ومصادر مسؤولة، ونولي عناية خاصة لتقليل الهدر في كل مرحلة إنتاج.",
  },
]

const stats = [
  { value: "+8", label: "سنوات خبرة" },
  { value: "+15,000", label: "عميلة راضية" },
  { value: "+300", label: "تصميم حصري" },
  { value: "4.8", label: "تقييم العميلات" },
]

export default async function AboutPage() {
  const testimonials = await getTestimonials()
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-gold uppercase">قصتنا</p>
            <h1 className="font-heading text-3xl leading-snug md:text-4xl">من نحن</h1>
            <p className="mt-5 text-sm leading-loose text-muted-foreground md:text-base">
              بدأت رحلتنا من شغف حقيقي بالعباية كقطعة تجمع بين الحشمة والفخامة. نؤمن بأن العباية ليست مجرد لباس،
              بل امتداد لشخصية المرأة وذوقها الخاص. من هذا الإيمان انطلقنا لنصمم ونصنع عبايات تليق بكل لحظة من
              حياتك، من التفاصيل اليومية إلى أخص المناسبات.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal className="order-2 md:order-1">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-gold uppercase">رسالتنا</p>
            <h2 className="font-heading text-2xl leading-snug md:text-3xl">
              أناقة تليق بكِ في كل التفاصيل
            </h2>
            <p className="mt-5 text-sm leading-loose text-muted-foreground md:text-base">
              رسالتنا أن نقدّم لكِ عبايات مصممة بعناية فائقة من أجود الأقمشة، تجمع بين الحشمة والأناقة العصرية.
              نعمل يومياً على تطوير تصاميمنا وتحسين تجربتك معنا، من لحظة اختيار القطعة إلى وصولها إلى باب منزلك،
              لتشعري بالثقة والجمال في آنٍ واحد.
            </p>
          </Reveal>
          <Reveal className="order-1 md:order-2" delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              <Image
                src="/images/embroidered-2.jpg"
                alt="ورشة تصميم العبايات"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <SectionHeading eyebrow="ما يميزنا" title="قيمنا" align="center" />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-border bg-background p-6 text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <v.icon className="size-5" />
                  </div>
                  <h3 className="font-heading text-lg">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-6 rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:grid-cols-4 md:px-14">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-3xl text-gold md:text-4xl">{s.value}</p>
                <p className="mt-2 text-xs text-primary-foreground/80 md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <TestimonialsSection testimonials={testimonials} />
    </div>
  )
}
