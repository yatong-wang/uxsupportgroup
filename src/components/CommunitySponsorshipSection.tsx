import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

const CommunitySponsorshipSection = () => {
  const scrollToContact = (packageName: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('package', packageName);
    window.history.replaceState({}, '', url);
    
    document.querySelector('#contact')?.scrollIntoView({
      behavior: 'smooth'
    });
    
    window.dispatchEvent(new CustomEvent('packageSelected', { detail: packageName }));
  };

  const quarterlyFeatures = [
    { text: "3 Monthly Workshops", subtitle: "(co-facilitated with Danny)" },
    { text: "Full Video Rights", subtitle: "for all content" },
    { text: "Dedicated Landing Page", subtitle: "on uxsupportgroup.com" },
    { text: "Slack Community Access", subtitle: "(office hours + AMA channel)" },
    { text: "Logo Placements", subtitle: "(website + events)" },
    { text: "Custom Promo Code", subtitle: "for tracking" },
    { text: "Category Exclusivity", subtitle: "(3-month lock-out)" },
    { text: "Performance Guarantee:", subtitle: "50+ trials or 25% discount" }
  ];

  return (
    <>
      {/* Section Header */}
      <section id="community" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Community <span className="text-gradient">Sponsorship</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Ongoing partnership with workshops, content, and community access
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {/* Quarterly Package */}
            <Card className="p-8 relative overflow-hidden border-2 border-primary/50 shadow-xl">
              <div className="mb-6 pb-6 border-b-2 border-dashed border-border">
                <h3 className="text-2xl font-bold mb-3 uppercase">Quarterly Partnership</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-foreground">$5,000</span>
                  <span className="text-lg text-muted-foreground">/ 3 months</span>
                </div>
                <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                  💡 Save 15% with annual commitment
                </span>
              </div>
              
              <p className="font-semibold mb-4 text-lg">Test the channel with low commitment</p>
              
              {/* ROI Callout */}
              <div className="bg-primary/10 rounded-lg p-3 mb-6 text-sm">
                <span className="font-bold text-primary">📊 At industry benchmarks:</span>{" "}
                <span className="text-foreground">50 trials → ~10 customers → ~$150K revenue → ~29x ROI</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {quarterlyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm border-b border-border/50 pb-3 last:border-0">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{feature.text}</strong> {feature.subtitle}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full h-12 text-base font-bold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all group uppercase" 
                onClick={() => scrollToContact('Quarterly Partnership - $5,000')}
              >
                Select Quarterly
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>

          {/* Custom Plan */}
          <div className="max-w-xl mx-auto mt-12 text-center">
            <Card className="p-8 border-2 border-dashed border-border bg-muted/30">
              <h3 className="text-xl font-bold mb-3 uppercase">Need Something Different?</h3>
              <p className="text-muted-foreground mb-6">
                Build a custom partnership with flexible terms, adjusted workshop frequency, or unique add-ons tailored to your goals.
              </p>
              <Button 
                variant="outline"
                className="font-bold uppercase group border-2"
                onClick={() => scrollToContact('Custom Partnership')}
              >
                Discuss Custom Partnership
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunitySponsorshipSection;
