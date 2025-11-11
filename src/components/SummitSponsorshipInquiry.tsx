import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hubbleLogo from "@/assets/hubble-logo.png";
import cocreateLogo from "@/assets/cocreate-logo.png";

const SummitSponsorshipInquiry = () => {
  const navigate = useNavigate();

  const handleBecomeASponsor = () => {
    navigate('/sponsor');
    setTimeout(() => {
      document.querySelector('#summit')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-muted">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-12 text-foreground">
            Sponsors
          </h2>
          <div className="flex items-center justify-center gap-12 mb-16">
            <img 
              src={hubbleLogo} 
              alt="Hubble" 
              className="h-12 object-contain grayscale hover:grayscale-0 transition-all"
            />
            <img 
              src={cocreateLogo} 
              alt="CoCreate" 
              className="h-20 object-contain grayscale hover:grayscale-0 transition-all"
            />
          </div>
          
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
            Interested in Sponsoring?
          </h3>
          <p className="text-base text-foreground/70 mb-6 max-w-2xl mx-auto">
            Connect with senior UX professionals and decision-makers at our virtual summit. Showcase your brand, products, and services to a highly engaged audience.
          </p>
          <Button
            onClick={handleBecomeASponsor}
            className="h-12 px-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all group"
          >
            Become a Sponsor
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SummitSponsorshipInquiry;
