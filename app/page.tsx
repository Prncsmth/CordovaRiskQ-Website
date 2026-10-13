import { DownloadSection } from "@/components/download-section";
import { Hero } from "@/components/hero";
import {
  AboutSection,
  FaqSection,
  FeaturesSection,
  HowItWorksSection,
  InstallGuideSection,
} from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <DownloadSection />
        <FeaturesSection />
        <HowItWorksSection />
        <InstallGuideSection />
        <AboutSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
