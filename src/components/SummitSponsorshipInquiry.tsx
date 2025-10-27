import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <section className="py-24 relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Interested in <span className="text-gradient">Sponsoring?</span>
          </h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Connect with senior UX professionals and decision-makers at our virtual summit. Showcase your brand, products, and services to a highly engaged audience.
          </p>
          <Button
            onClick={handleBecomeASponsor}
            className="h-14 px-8 text-lg font-bold bg-background text-foreground hover:bg-background/90 shadow-2xl hover:shadow-3xl transition-all group uppercase"
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
