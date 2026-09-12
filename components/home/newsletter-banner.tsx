import { NewsletterForm } from "@/components/site/newsletter-form"
import { Reveal } from "@/components/site/reveal"

export function NewsletterBanner() {
  return (
    <section className="border-t border-border bg-primary py-16 text-primary-foreground">
      <div className="mx-auto max-w-xl px-4 text-center md:px-8">
        <Reveal>
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold uppercase">كوني أول من يعلم</p>
          <h2 className="font-heading text-2xl md:text-3xl">اشتركي في نشرتنا البريدية</h2>
          <p className="mt-3 text-sm text-primary-foreground/75">
            أحدث المجموعات والعروض الحصرية تصلك مباشرة إلى بريدك
          </p>
          <div className="mx-auto mt-6 max-w-sm [&_input]:bg-primary-foreground [&_input]:text-primary">
            <NewsletterForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
