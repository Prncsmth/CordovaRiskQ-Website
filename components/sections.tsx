import { Check, ChevronDown, ShieldAlert, X, Zap } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { FeatureRail } from "@/components/feature-rail";
import { Reveal } from "@/components/reveal";
import { Showcase } from "@/components/showcase";
import { Section } from "@/components/ui";
import { COMPARISON, FAQS, GLANCE, HOW_IT_WORKS, INSTALL_STEPS, TICKER, USE_CASES } from "@/lib/content";
import { SITE } from "@/lib/site";

export function ShowcaseSection() {
  return (
    <Section
      id="showcase"
      eyebrow="Showcase"
      title="Everything you need when it matters"
      intro="Pick a feature to see what it does, what it shares, and where to find it in the app."
    >
      <Reveal>
        <Showcase />
      </Reveal>
    </Section>
  );
}

export function ComparisonSection() {
  const columns = [
    { ...COMPARISON.without, positive: false },
    { ...COMPARISON.with, positive: true },
  ];
  return (
    <Section
      eyebrow="Why it helps"
      title="Less guesswork in an emergency"
      intro="When something happens, the hardest parts are often explaining where you are and knowing what happens next. CORDOVA RISKQ keeps both in one place."
      className="bg-surface"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {columns.map((column, columnIndex) => (
          <Reveal key={column.title} delay={columnIndex * 90} className="h-full">
            <div
              className={
                column.positive
                  ? "h-full rounded-3xl border border-brand/25 bg-white p-6 shadow-[0_24px_50px_-34px_rgba(200,16,46,0.45)] sm:p-8"
                  : "h-full rounded-3xl border border-line bg-white/60 p-6 sm:p-8"
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className={
                    column.positive
                      ? "flex size-11 items-center justify-center rounded-xl bg-brand text-white"
                      : "flex size-11 items-center justify-center rounded-xl bg-line-muted text-muted"
                  }
                >
                  {column.positive ? <Zap aria-hidden className="size-5" /> : <X aria-hidden className="size-5" />}
                </span>
                <div>
                  <h3 className="font-wordmark text-lg tracking-tight text-ink uppercase">{column.title}</h3>
                  <p className="font-mono text-xs text-faint">{column.subtitle}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {column.items.map((item) => (
                  <li key={item.title} className="flex gap-3 rounded-2xl border border-line-muted bg-surface/70 p-4">
                    {column.positive ? (
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                    ) : (
                      <X aria-hidden className="mt-0.5 size-4 shrink-0 text-faint" />
                    )}
                    <div>
                      <p className="font-mono text-xs font-semibold tracking-wide text-ink uppercase">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        The app supports coordination — in a life-threatening emergency, still call a hotline directly.
      </p>
    </Section>
  );
}

export function FeaturesSection() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Made for Cordova residents"
      intro="Tools for asking for help, reporting incidents, finding safety and staying informed — in one app built for Cordova."
    >
      <FeatureRail />
    </Section>
  );
}

export function UseCasesSection() {
  return (
    <Section
      eyebrow="When to use it"
      title="Built for the situations you face"
      intro="From floods in coastal barangays to road accidents on the way home — here is how the app fits in."
      className="bg-surface"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((useCase, index) => {
          const Icon = useCase.icon;
          return (
            <li key={useCase.title}>
              <Reveal delay={(index % 3) * 80} className="h-full">
                <article className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-brand/25">
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-surface text-brand transition-colors group-hover:border-brand/30 group-hover:bg-brand-tint">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span aria-hidden className="font-mono text-sm text-faint">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 font-wordmark text-lg tracking-tight text-ink uppercase">{useCase.title}</h3>
                  <p className="font-mono text-xs text-faint">{useCase.subtitle}</p>
                  <p className="mt-3 leading-relaxed text-muted">{useCase.description}</p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function HowItWorksSection() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Four steps From install to assistance"
      intro="Set it up once, before you need it."
    >
      <div className="relative">
        {/* Dashed connector that draws across behind the step cards (desktop). */}
        <Reveal className="pointer-events-none absolute top-[3.1rem] right-[12%] left-[12%] hidden lg:block">
          <span
            aria-hidden
            className="steps-line block h-px bg-[repeating-linear-gradient(90deg,#c8102e66_0_6px,transparent_6px_12px)]"
          />
        </Reveal>
        <ol className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step, index) => (
            <li key={step.title} className="relative">
              <Reveal delay={index * 140} className="h-full">
                <div className="h-full rounded-3xl border border-line bg-white p-6">
                  <span
                    aria-hidden
                    className="step-badge relative flex size-12 items-center justify-center rounded-2xl bg-brand font-wordmark text-lg text-white shadow-[0_8px_18px_-8px_rgba(200,16,46,0.6)]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-wordmark text-lg tracking-tight text-ink uppercase">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
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
            <dd className="font-wordmark text-5xl text-brand tabular-nums sm:text-6xl">
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
            <h3 className="mt-4 font-wordmark text-lg tracking-tight text-ink uppercase">Stay safe when installing</h3>
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

export function AboutSection() {
  return (
    <Section id="about" eyebrow="About" title={`About ${SITE.name}.`} className="bg-surface">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-lg leading-relaxed text-muted">
          <Reveal>
            <p>
              {SITE.name} is a geolocation-based emergency and assistance coordination system built
              for the people of Cordova, Cebu. It brings emergency requests, incident reports,
              evacuation center information and community alerts into one mobile app.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p>
              When you send an SOS or submit a report, your location and the details you provide are
              shared with authorized response teams so they can assess the situation and coordinate
              help. Your reports stay visible to you, with their status, in Report History.
            </p>
          </Reveal>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            { term: "Coverage", detail: "Reports are pinned to locations within Cordova, Cebu." },
            { term: "Privacy", detail: "Location is shared only when you submit a report or send an SOS." },
            { term: "Accounts", detail: "Sign up with email or Google and a mobile number responders can call." },
            { term: "Not a replacement", detail: "Always call emergency hotlines directly when a life is at risk." },
          ].map((item, index) => (
            // Each Reveal is the dt/dd group itself, so the <dl> stays valid.
            <Reveal
              key={item.term}
              delay={100 + index * 90}
              className="rounded-2xl border border-line bg-white p-5 hover:border-brand/25"
            >
              <dt className="font-mono text-xs font-semibold tracking-wider text-brand uppercase">{item.term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
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
