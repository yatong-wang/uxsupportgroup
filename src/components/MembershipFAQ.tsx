import { Accordion, AccordionContent } from "@/components/ui/accordion";
import { MembershipAccordionItem, MembershipAccordionTrigger } from "@/components/MembershipAccordion";
import { MembershipSectionTitle } from "@/components/MembershipSectionTitle";

const MembershipFAQ = () => {
  const faqs = [
    {
      question: "Can I cancel my membership anytime?",
      answer: "Yes! You can cancel your membership at any time. Your access will continue until the end of your current billing period."
    },
    {
      question: "What happens if I miss an event?",
      answer: "No worries! All workshops and coaching sessions are recorded and available to members unlimited. You can watch them anytime at your convenience."
    },
    {
      question: "Are the recordings really unlimited?",
      answer: "Yes! As a member, you have unlimited access to our entire library of workshop recordings for as long as you maintain your membership."
    },
    {
      question: "How do I get my 50% discount on events?",
      answer: "Once you're a member, you'll receive a unique discount code that can be applied to any paid event registration. The discount is automatically applied in our members-only Slack channel event announcements."
    },
    {
      question: "What if I attend just a few events?",
      answer: "Even attending just 3 workshops per month ($10 each) covers your membership cost. With 260+ events per year, most members save hundreds of dollars annually."
    },
    {
      question: "Is there a free trial?",
      answer: "We don't offer a free trial, but you can start with monthly membership and upgrade to annual anytime to save $58/year."
    }
  ];

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <MembershipSectionTitle>
              Frequently Asked <span className="text-gradient">Questions</span>
            </MembershipSectionTitle>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <MembershipAccordionItem
                key={index}
                value={`faq-${index}`}
              >
                <MembershipAccordionTrigger>
                  <span className="font-bold text-lg">{faq.question}</span>
                </MembershipAccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </MembershipAccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default MembershipFAQ;
