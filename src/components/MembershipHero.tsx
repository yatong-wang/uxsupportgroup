import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import heroBg from "@/assets/liquid-data-bust.png";

const MembershipHero = () => {
  const scrollToPricing = () => {
    document.querySelector('#pricing')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/85" />
      
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 pt-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-foreground leading-tight mb-6 md:text-7xl">
            UX Support Group Membership
          </h1>
          
          <h2 className="text-3xl text-foreground mb-8 leading-tight md:text-3xl font-semibold">
            Master AI <span className="text-gradient">×</span> UX and future-proof your career
          </h2>
          
          <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
            Stay ahead in the rapidly evolving design industry. Learn to integrate AI into your UX practice 
            with hands-on training, expert coaching, and a community of ambitious professionals.
          </p>

          <ul className="text-left space-y-4 max-w-2xl mx-auto mb-8">
            <li className="flex items-start gap-3 text-lg">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <span>50% off all paid events (260+ per year)</span>
            </li>
            <li className="flex items-start gap-3 text-lg">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <span>Unlimited access to workshop recordings</span>
            </li>
            <li className="flex items-start gap-3 text-lg">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <span>Members-only Slack channel</span>
            </li>
          </ul>

          <div className="mb-8">
            <div className="text-5xl font-bold text-foreground mb-2">$29<span className="text-2xl text-muted-foreground">/month</span></div>
          </div>

          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group"
            onClick={scrollToPricing}
          >
            Join Now
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MembershipHero;

