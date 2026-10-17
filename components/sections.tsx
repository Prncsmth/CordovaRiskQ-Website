import { Phone, TONES } from "@/components/app-guide";
import { ChevronDown, MapPin, ShieldAlert, Siren, Users } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { GeofenceCheck } from "@/components/geofence";
import { Reveal } from "@/components/reveal";
import { PromoVideo } from "@/components/promo-video";
import { ResponderClips } from "@/components/responders";
import { Reviews } from "@/components/reviews";
import { Showcase } from "@/components/showcase";
import { Section, cn } from "@/components/ui";
import { FAQS, GLANCE, HOW_IT_WORKS, INSTALL_STEPS, TICKER } from "@/lib/content";
import { SITE } from "@/lib/site";

export function ShowcaseSection() {
  return (
    <Section
      id="showcase"
      eyebrow="Showcase"
      title="See it in action"
      intro="Real recordings from the app, playing one after another."
    >
      <Reveal>
        <Showcase />
      </Reveal>
    </Section>
  );
}

export function GeofenceSection() {
  return (
    <Section
      id="coverage"
      eyebrow="Coverage area"
      title="Made for Cordova only"
      intro="SOS alerts and incident reports only send from inside the Municipality of Cordova, Cebu. Visiting from outside? Use 911 or your local hotline."
      className="bg-surface"
    >
      <Reveal>
        <GeofenceCheck />
      </Reveal>
    </Section>
  );
}

export function RespondersSection() {
  return (
    <Section
      id="responders"
      eyebrow="Responders"
      title="What happens after you ask"
      intro="The responder side of the app, also limited by location."
    >
      <ResponderClips />
    </Section>
  );
}

export function HowItWorksSection() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Four steps from install to assistance"
      intro="Set it up once, before you need it."
    >
      {/* Same card style as the App Guide, but static, with the whole screen shown. */}
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((step, index) => {
          const tone = TONES[step.tone];
          return (
            <li key={step.title}>
              <Reveal delay={index * 120} className="h-full">
                <article className={cn("flex h-full flex-col rounded-[1.75rem] p-6", tone.panel)}>
                  <p className={cn("font-mono text-[0.7rem] font-semibold tracking-[0.16em] uppercase", tone.label)}>
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-[1.4rem] leading-[1.12] font-bold tracking-tight text-balance">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className={cn("mt-3 text-sm leading-relaxed", tone.body)}>{step.description}</p>
                  <div className="mt-auto pt-6">
                    <Phone shot={{ image: step.image, alt: step.alt }} className="mx-auto w-[56%] sm:w-[78%]" />
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>

      {/* The full walkthrough video, right after the steps it explains. */}
      <div id="video" className="mt-14 scroll-mt-24 sm:mt-20">
        <Reveal>
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              See the whole system in action
            </h3>
            <p className="mt-2 leading-relaxed text-muted">
              How residents, responders and the admin portal work together during an emergency.
            </p>
          </div>
          <PromoVideo />
        </Reveal>
      </div>
    </Section>
  );
}

export function GlanceBand() {
  return (
    <section aria-label="At a glance" className="border-y border-line bg-white">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4">
        {GLANCE.map((item, index) => (
          // Each Reveal is the dt/dd group itself, so the <dl> stays valid.
          <Reveal
            key={item.label}
            delay={index * 110}
            className={
              "flex flex-col-reverse items-center gap-1 py-10 text-center" +
              (index % 2 === 1 ? " border-l border-line-muted" : "") +
              (index === 2 ? " lg:border-l" : "") +
              (index >= 2 ? " border-t border-line-muted lg:border-t-0" : "")
            }
          >
            <dt className="font-mono text-xs tracking-wider text-muted uppercase">{item.label}</dt>
            <dd className="font-display text-5xl font-bold text-brand tabular-nums sm:text-6xl">
              <CountUp value={item.value} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

export function TickerBand() {
  const row = (duplicate: boolean) =>
    TICKER.map((item) => (
      <li
        key={`${duplicate ? "b" : "a"}-${item}`}
        data-duplicate={duplicate ? "" : undefined}
        aria-hidden={duplicate || undefined}
        className="flex items-center gap-6 px-3 font-mono text-xs font-semibold tracking-[0.16em] whitespace-nowrap text-white/90 uppercase"
      >
        {item}
        <span aria-hidden className="size-1.5 rounded-full bg-white/50" />
      </li>
    ));
  return (
    <section aria-label="App capabilities" className="marquee overflow-hidden bg-brand py-4">
      <ul className="marquee-track flex w-max gap-y-3">
        {row(false)}
        {row(true)}
      </ul>
    </section>
  );
}

export function InstallGuideSection() {
  return (
    <Section
      id="install"
      eyebrow="Installation guide"
      title="Installing the APK on Android"
      intro="Apps installed from an APK file come from outside the Play Store, so Android asks for one extra permission. Menu names differ slightly between phone brands."
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <ol className="space-y-3">
          {INSTALL_STEPS.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={Math.min(index, 3) * 60}>
                <div className="flex gap-4 rounded-2xl border border-line bg-white p-5">
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand-tint font-mono text-sm font-semibold text-brand"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">
                      <span className="sr-only">Step {index + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-1 leading-relaxed text-muted">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <aside aria-label="Installation safety tips" className="rounded-3xl border border-tide/20 bg-tide-tint p-6 lg:sticky lg:top-24">
            <ShieldAlert aria-hidden className="size-6 text-tide" />
            <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">Stay safe when installing</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink/80">
              <li>Download {SITE.name} only from this official page.</li>
              <li>Never install an APK sent to you through chat messages or unknown websites.</li>
              <li>After installing, you can switch &ldquo;Install unknown apps&rdquo; off again for your browser.</li>
              <li>The app only asks for location, camera, photos and notifications for the features described on this page.</li>
            </ul>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}

/** The three things every visitor should take away: what it is, where it works, who it's for. */
const ABOUT = [
  {
    icon: Siren,
    question: "What is it?",
    answer: "A geolocation-based emergency and assistance coordination app.",
    detail:
      "SOS alerts, incident reports, evacuation centers and official alerts in one Android app, with every request pinned to an exact location.",
  },
  {
    icon: MapPin,
    question: "Where does it work?",
    answer: "Only in the Municipality of Cordova, Cebu.",
    detail: "All 13 barangays, including Gilutongan Island. SOS and reports are blocked outside Cordova's boundary.",
  },
  {
    icon: Users,
    question: "Who is it for?",
    answer: "Cordova residents, and the teams who respond.",
    detail:
      "Residents ask for help. Barangay responders and the municipal response team receive, accept and resolve each request.",
  },
] as const;

export function AboutSection() {
  return (
    <Section id="about" eyebrow="About" title={`About ${SITE.name}`} className="bg-surface">
      <ul className="grid gap-4 lg:grid-cols-3">
        {ABOUT.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={item.question}>
              <Reveal delay={index * 100} className="h-full">
                <article className="flex h-full flex-col rounded-3xl border border-line bg-white p-7">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-white shadow-[0_8px_18px_-8px_rgba(200,16,46,0.6)]">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="mt-6 text-sm font-semibold tracking-wide text-brand uppercase">{item.question}</h3>
                  <p className="mt-2 font-display text-2xl leading-snug font-bold tracking-tight text-ink">{item.answer}</p>
                  <p className="mt-3 leading-relaxed text-muted">{item.detail}</p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
      <Reveal delay={300}>
        <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-brand/15 bg-brand-tint p-4 text-sm leading-relaxed text-ink/85">
          <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
          Location is shared only when you send an SOS or a report. The app supports responders; in a
          life-threatening emergency, still call a hotline directly.
        </p>
      </Reveal>
    </Section>
  );
}

export function ReviewsSection() {
  return (
    <Section
      id="reviews"
      eyebrow="Reviews"
      title="What people are saying."
      intro="Real reviews from people using CORDOVA RISKQ."
      className="bg-surface"
      centered
    >
      <Reveal>
        <Reviews />
      </Reveal>
    </Section>
  );
}

export function FaqSection() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Frequently asked questions." centered>
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-3xl border border-line bg-white">
        {FAQS.map((faq, index) => (
          <Reveal key={faq.id} delay={Math.min(index, 7) * 60}>
            <details id={`faq-${faq.id}`} className="faq-item group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-5 py-5 text-left font-semibold text-ink transition-colors hover:text-brand sm:px-6">
                <span>{faq.question}</span>
                <ChevronDown aria-hidden className="faq-chevron size-5 shrink-0 text-muted" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-muted sm:px-6">{faq.answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
