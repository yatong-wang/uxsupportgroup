import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MembershipHero from "@/components/MembershipHero";
import MembershipAudience from "@/components/MembershipAudience";
import MembershipPricing from "@/components/MembershipPricing";
import MembershipFAQ from "@/components/MembershipFAQ";

const Membership = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MembershipHero />
        <MembershipAudience />
        <MembershipPricing />
        <MembershipFAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Membership;
