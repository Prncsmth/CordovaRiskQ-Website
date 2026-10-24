import { AppGuideSection } from "@/components/app-guide";
import { DownloadSection } from "@/components/download-section";
import { HorrorDivider } from "@/components/halloween/decor";
import { HalloweenLayer } from "@/components/halloween/halloween-layer";
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
        <HorrorDivider />
        <ShowcaseSection />
        <GeofenceSection />
        <HorrorDivider eyes="left" />
        <RespondersSection />
        <GlanceBand />
        <HowItWorksSection />
        <HorrorDivider />
        <DownloadSection />
        <InstallGuideSection />
        <HorrorDivider eyes="left" />
        <AboutSection />
        <ReviewsSection />
        <HorrorDivider />
        <FaqSection />
      </main>
      <SiteFooter />
      <HalloweenLayer />
    </>
  );
}
