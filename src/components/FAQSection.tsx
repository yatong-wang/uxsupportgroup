import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const FAQSection = () => {
  const faqs = [{
    question: "What's included with my ticket?",
    answer: "All tickets include full-day virtual access to live workshops, interactive breakout sessions, community gallery, profile highlight, and digital resources. Plus, you'll get access to session recordings after the event."
  }, {
    question: "What time zone is the event?",
    answer: "All sessions are scheduled in Eastern Standard Time (EST/New York). The full schedule includes session times that you can easily convert to your local time zone."
  }, {
    question: "What platform will the summit be on?",
    answer: "The summit will be hosted on Zoom. You'll receive your unique Zoom link and a quick-start guide via email before the event."
  }, {
    question: "What do I need to participate?",
    answer: "A computer or laptop, stable internet connection, and headphones (recommended for workshops). All workshop materials and resources will be provided digitally. Come with an open mind and ready to create!"
  }, {
    question: "What AI tools will we use?",
    answer: "We'll be working with a variety of AI tools including Suno, ChatGPT, Midjourney, and others. No prior AI experience required—our workshops are designed for all skill levels."
  }, {
    question: "Will there be recordings?",
    answer: "Key sessions will be recorded and made available to attendees only. However, the real magic happens in live participation and networking!"
  }, {
    question: "Is there a refund policy?",
    answer: "Yes, we offer full refunds up to 14 days before the event. Within 14 days, tickets are non-refundable but can be transferred to another person via email."
  }];
  return <section className="py-24 bg-gradient-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Got <span className="text-gradient">Questions?</span>
            </h2>
            
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`faq-${index}`} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                  <span className="font-bold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </div>
    </section>;
};
export default FAQSection;