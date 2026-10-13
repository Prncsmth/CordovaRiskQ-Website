import { ChevronDown, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/ui";
import { FAQS, FEATURES, HOW_IT_WORKS, INSTALL_STEPS } from "@/lib/content";
import { SITE } from "@/lib/site";

export function FeaturesSection() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="What the app does"
      intro="Everything listed here is available in the current CORDOVA RISKQ mobile app."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            // The odd card out spans the last row instead of sitting alone.
            <li
              key={feature.title}
              className={index === FEATURES.length - 1 && FEATURES.length % 3 === 1 ? "sm:col-span-2 lg:col-span-3" : undefined}
            >
              <Reveal delay={(index % 3) * 80} className="h-full">
                <article className="group h-full rounded-2xl border border-line bg-white p-6 transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_12px_32px_-20px_rgba(23,24,26,0.35)]">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{feature.description}</p>
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
      title="From install to assistance in four steps"
      className="bg-surface"
    >
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((step, index) => (
          <li key={step.title}>
            <Reveal delay={index * 70} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-white p-6">
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white"
                >
                  {index + 1}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{step.description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
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
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-brand-tint font-display text-sm font-semibold text-brand"
                  >
                    {index + 1}
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
          <aside aria-label="Installation safety tips" className="rounded-2xl border border-tide/20 bg-tide-tint p-6">
            <ShieldAlert aria-hidden className="size-6 text-tide" />
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">Stay safe when installing</h3>
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
    <Section id="about" eyebrow="About" title={`About ${SITE.name}`} className="bg-surface">
      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-4 text-lg leading-relaxed text-muted">
            <p>
              {SITE.name} is a geolocation-based emergency and assistance coordination system built
              for the people of Cordova, Cebu. It brings emergency requests, incident reports,
              evacuation center information and community alerts into one mobile app.
            </p>
            <p>
              When you send an SOS or submit a report, your location and the details you provide are
              shared with authorized response teams so they can assess the situation and coordinate
              help. Your reports stay visible to you, with their status, in Report History.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { term: "Coverage", detail: "Reports are pinned to locations within Cordova, Cebu." },
              { term: "Privacy", detail: "Location is shared only when you submit a report or send an SOS." },
              { term: "Accounts", detail: "Sign up with email or Google and a mobile number responders can call." },
              { term: "Not a replacement", detail: "Always call emergency hotlines directly when a life is at risk." },
            ].map((item) => (
              <div key={item.term} className="rounded-2xl border border-line bg-white p-5">
                <dt className="font-display font-semibold text-ink">{item.term}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

export function FaqSection() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Frequently asked questions">
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-white">
        {FAQS.map((faq) => (
          <details key={faq.id} id={`faq-${faq.id}`} className="faq-item group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-5 text-left font-semibold text-ink transition-colors hover:text-brand sm:px-6">
              <span>{faq.question}</span>
              <ChevronDown aria-hidden className="faq-chevron size-5 shrink-0 text-muted" />
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-muted sm:px-6">{faq.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
