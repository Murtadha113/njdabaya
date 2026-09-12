import type { Metadata } from "next"
import { Ban, CheckCircle2, PackageCheck, PackageSearch, RotateCcw, Tag } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { SupportCta } from "@/components/site/support-cta"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "سياسة الاستبدال والاسترجاع | نجد",
  description: "تعرّفي على شروط ومدة الاستبدال والاسترجاع، وكيفية تقديم طلب، وطريقة استرداد المبلغ.",
}

const steps = [
  {
    icon: PackageSearch,
    title: "قدّمي طلب الاسترجاع",
    description: "تواصلي معنا عبر صفحة تواصل معنا أو واتساب خلال 14 يوماً من استلام طلبكِ، مع ذكر رقم الطلب وسبب الاسترجاع أو الاستبدال.",
  },
  {
    icon: PackageCheck,
    title: "تجهيز القطعة للإرجاع",
    description: "تأكدي أن القطعة غير مستخدمة وبحالتها الأصلية مع جميع البطاقات والتغليف، ثم قومي بتغليفها بعناية.",
  },
  {
    icon: RotateCcw,
    title: "استلام القطعة وفحصها",
    description: "سيقوم فريقنا باستلام القطعة عبر شركة الشحن وفحصها للتأكد من مطابقتها لشروط الاسترجاع.",
  },
  {
    icon: CheckCircle2,
    title: "استرداد المبلغ أو الاستبدال",
    description: "بعد الموافقة، تتم معالجة استرداد المبلغ خلال 5 إلى 7 أيام عمل بنفس وسيلة الدفع الأصلية، أو شحن القطعة البديلة فوراً.",
  },
]

const conditions = [
  "القطعة غير مستخدمة ولم يتم غسلها أو تعديلها بأي شكل",
  "جميع البطاقات والملصقات الأصلية لا تزال متصلة بالقطعة",
  "القطعة في تغليفها الأصلي وبحالة قابلة لإعادة البيع",
  "طلب الاسترجاع أو الاستبدال خلال 14 يوماً من تاريخ الاستلام",
  "إرفاق فاتورة الشراء أو رقم الطلب عند تقديم الطلب",
]

const nonReturnable = [
  "القطع المخصصة بالتفصيل أو التطريز حسب الطلب",
  "الإكسسوارات مثل الحجابات في حال فتح تغليفها",
  "القطع المخفّضة ضمن تصفية نهائية (تُحدَّد عند الشراء)",
  "القطع التي تظهر عليها آثار استخدام أو عطر أو تغيير في الرائحة",
]

const faqs = [
  {
    question: "متى أستلم مبلغ الاسترجاع؟",
    answer: "يتم استرداد المبلغ خلال 5 إلى 7 أيام عمل من تاريخ استلامنا للقطعة وموافقتنا على الطلب، ويُضاف المبلغ إلى نفس وسيلة الدفع المستخدمة عند الشراء.",
  },
  {
    question: "هل يوجد رسوم على الاستبدال أو الاسترجاع؟",
    answer: "لا توجد أي رسوم على الاستبدال. بالنسبة للاسترجاع، تتحمل العميلة رسوم الشحن الخاصة بإعادة القطعة إلا في حال كان سبب الاسترجاع خطأً من طرفنا (منتج تالف أو مختلف عن الطلب).",
  },
  {
    question: "كيف أستبدل المقاس دون إعادة الطلب بالكامل؟",
    answer: "يمكنكِ طلب استبدال المقاس مباشرة عبر التواصل معنا، وسنقوم بشحن المقاس الجديد فور استلام القطعة الأصلية والتأكد من مطابقتها للشروط.",
  },
]

export default function ReturnsPage() {
  return (
    <div>
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-gold uppercase">رضاكِ يهمنا</p>
            <h1 className="font-heading text-3xl leading-snug md:text-4xl">سياسة الاستبدال والاسترجاع</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-loose text-muted-foreground md:text-base">
              نمنحكِ 14 يوماً من تاريخ استلام طلبكِ لطلب الاستبدال أو الاسترجاع، لضمان راحتكِ التامة مع كل قطعة
              تقتنينها منا.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="خطوة بخطوة" title="كيف أقدّم طلب استرجاع؟" align="center" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="relative h-full rounded-xl border border-border bg-background p-6">
                <span className="absolute -top-3 -start-3 flex size-7 items-center justify-center rounded-full bg-gold text-xs font-semibold text-gold-foreground">
                  {i + 1}
                </span>
                <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <step.icon className="size-5" />
                </div>
                <h3 className="font-heading text-base">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border bg-background p-6 md:p-8">
                <div className="mb-4 flex items-center gap-2.5">
                  <Tag className="size-5 text-gold" />
                  <h3 className="font-heading text-xl">شروط قبول الاسترجاع</h3>
                </div>
                <ul className="space-y-3">
                  {conditions.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-border bg-background p-6 md:p-8">
                <div className="mb-4 flex items-center gap-2.5">
                  <Ban className="size-5 text-destructive" />
                  <h3 className="font-heading text-xl">قطع غير قابلة للاسترجاع</h3>
                </div>
                <ul className="space-y-3">
                  {nonReturnable.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <Ban className="mt-0.5 size-4 shrink-0 text-destructive/70" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="أسئلة متعلقة" title="تفاصيل إضافية" align="center" />
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion multiple className="rounded-2xl border border-border bg-background px-5 md:px-6">
            {faqs.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="leading-loose text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      <SupportCta />
    </div>
  )
}
