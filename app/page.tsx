import { AppGuideSection } from "@/components/app-guide";
import { DownloadSection } from "@/components/download-section";
import { Hero } from "@/components/hero";
import {
  AboutSection,
  ComparisonSection,
  FaqSection,
  FeaturesSection,
  GlanceBand,
  HowItWorksSection,
  InstallGuideSection,
  ShowcaseSection,
  TickerBand,
  UseCasesSection,
} from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <TickerBand />
        <AppGuideSection />
        <ShowcaseSection />
        <ComparisonSection />
        <FeaturesSection />
        <GlanceBand />
        <UseCasesSection />
        <HowItWorksSection />
        <DownloadSection />
        <InstallGuideSection />
        <AboutSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
