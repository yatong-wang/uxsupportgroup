import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import ConceptSection from "@/components/ConceptSection";
import AgendaSection from "@/components/AgendaSection";
import ProfileCallout from "@/components/ProfileCallout";
import SummitSponsorshipInquiry from "@/components/SummitSponsorshipInquiry";
import FAQSection from "@/components/FAQSection";

/** Inside SketchyLayout for global chrome; `.summit-2025-legacy` restores Space Grotesk in main. */
const Summit = () => (
  <main id="main" className="summit-2025-legacy">
    <Hero />
    <ConceptSection />
    <SocialProof />
    <AgendaSection />
    <ProfileCallout />
    <SummitSponsorshipInquiry />
    <FAQSection />
  </main>
);

export default Summit;