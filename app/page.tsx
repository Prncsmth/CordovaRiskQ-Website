import { AppGuideSection } from "@/components/app-guide";
import { DownloadSection } from "@/components/download-section";
import { Hero } from "@/components/hero";
import {
  AboutSection,
  FaqSection,
  GeofenceSection,
  GlanceBand,
  HowItWorksSection,
  InstallGuideSection,
  RespondersSection,
  ReviewsSection,
  ShowcaseSection,
  TickerBand,
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
        <GeofenceSection />
        <RespondersSection />
        <GlanceBand />
        <HowItWorksSection />
        <DownloadSection />
        <InstallGuideSection />
        <AboutSection />
        <ReviewsSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
