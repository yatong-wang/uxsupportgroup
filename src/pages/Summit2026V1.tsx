import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent } from "@/components/ui/accordion";
import { MembershipAccordionItem, MembershipAccordionTrigger } from "@/components/MembershipAccordion";
import { HandDrawnHighlight } from "@/components/sketchy/HandDrawnHighlight";
import { HandDrawnRect } from "@/components/sketchy/HandDrawnRect";
import { RoughWavyUnderline } from "@/components/sketchy/RoughWavyUnderline";
import { SketchyBadge } from "@/components/sketchy/SketchyBadge";
import { SketchySectionTitle } from "@/components/sketchy/SketchySectionTitle";
import { SketchyTallCard } from "@/components/sketchy/SketchyTallCard";
import { SketchyTestimonialNote } from "@/components/sketchy/SketchyTestimonialNote";
import EstherJ from "@/assets/EstherJ.jpg";
import FarooqK from "@/assets/FarooqK-3.jpg";
import JolieC from "@/assets/JolieC.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,

  HandHeart,
  Loader2,
  MessagesSquare,
  Pencil,
  PencilLine,
  Star,
  Users,
  XCircle,
} from "lucide-react";

const DESK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAH-nbaD4vmo7ZomJxp5HMu8fW5zm7VikBFje5LjN8qywQm__JwNIt4O1SvtrH-8mPZ4roeoevCqv_J4z303fsl2_ajQnLVj6Fc7A2R-_e1Ath48QadCYCeWX9qDvnwxRigr52LK7pxp22_yqbK9fQEEn-zXJORge-KpCap-n2S2Vsr0lKx-JXFej_YcgTaqZB8a8zvZNwE83p4ZeJVnTLvCQiDaNwZwyFmyqxNg9ekHe0GADYCwTZO77J3Hoh5SHuHHYRct531s2I";
const SUMMIT_TESTIMONIALS = [
  {
    quote:
      "I think today I learned more about humans than AI…I can't wait to keep our connection going 🙏",
    name: "Farooq Khayyat",
    role: "Product Designer | Gaming & Creative Tools",
    avatarSrc: FarooqK,
  },
  {
    quote:
      "A truly great day of learning, getting to know incredible people, and giving deep into AI.",
    name: "Esther Greenfield Jakar",
    role: "Product Designer | Product Manager",
    avatarSrc: EstherJ,
  },
  {
    quote:
      "…the amazing presentations and demonstrations reframed [the] fear into a roadmap where uncertainty becomes an opportunity for growth….As a research, this was validating.",
    name: "Jolie Chen",
    role: "UX Researcher | Data Analyst",
    avatarSrc: JolieC,
  },
] as const;

const TESTIMONIAL_WALL_WRAPPERS = [
  "relative z-10 w-full max-w-[min(100%,22rem)] lg:max-w-[20rem] xl:max-w-[22rem] 2xl:max-w-[24rem] shrink-0 rotate-2 -translate-x-1 sm:translate-x-0 lg:rotate-[-2deg] lg:translate-x-0 lg:translate-y-0 lg:-ml-4 -mt-6",
  "relative z-20 w-full max-w-[min(100%,22rem)] lg:max-w-[20rem] xl:max-w-[22rem] 2xl:max-w-[24rem] shrink-0 -rotate-3 translate-x-2 sm:translate-x-3 lg:translate-x-0 lg:rotate-[2.5deg] lg:translate-y-1 lg:-ml-4 -mt-6",
  "relative z-30 w-full max-w-[min(100%,22rem)] lg:max-w-[20rem] xl:max-w-[22rem] 2xl:max-w-[24rem] shrink-0 rotate-1 -translate-x-2 sm:-translate-x-1 lg:translate-x-0 lg:-rotate-1 lg:-translate-y-0.5 lg:-ml-4 -mt-6",
] as const;

const CARD_FILL = "hsl(var(--card))";

const AGENDA_DAY1 = [
  { time: "09:00 AM", title: "Welcome" },
  { time: "09:15 AM", title: "Keynote: Designer's New Mandate" },
  {
    time: "10:00 AM",
    title: "Create Your Summit Agent (build together!)",
  },
  { time: "10:45 AM", title: "Break" },
  { time: "11:00 AM", title: "Trust, Transparency & Control" },
  { time: "12:00 PM", title: "Multimodal Futures" },
  { time: "12:45 PM", title: "Close & Day 2 preview" },
];

const AGENDA_DAY2 = [
  { time: "09:00 AM", title: "Welcome back" },
  { time: "09:15 AM", title: "Orchestrating Complexity" },
  { time: "10:15 AM", title: "Break" },
  { time: "10:30 AM", title: "Building Your Process" },
  { time: "11:30 AM", title: "Your Path Forward" },
  { time: "12:15 PM", title: "Break" },
  {
    time: "12:30 PM",
    title: "Design Your AI Networking Agent (refine + collaborate)",
  },
  { time: "01:35 PM", title: "Close" },
];

const FEATURE_ROWS: { icon: typeof Pencil; text: string }[] = [
  { icon: PencilLine, text: "Hands-on labs where you build real AI x UX artifacts." },
  { icon: Users, text: "Opportunities to make great connections with peers and experts." },
  { icon: MessagesSquare, text: "Facilitated sessions led by experienced practitioners." },
  { icon: Star, text: "A curated group of designers, product builders, and leaders." },
  { icon: HandHeart, text: "Space to reflect on ethics, craft, and long-term impact." },
];

const FOR_YOU = [
  "You're a UX/Product designer looking to evolve your craft.",
  "You learn best by doing, not just watching presentations.",
  "You're actively figuring out your role in an AI-driven future.",
  "You value meaningful connections over mass networking.",
];

const NOT_FOR_YOU = [
  'You\'re looking for a "What is AI?" 101 basic introduction.',
  'You prefer a passive, "watch and listen" webinar format.',
  "You're only here for high-profile celebrity keynotes.",
  "You want purely theoretical academic discussions.",
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Will the sessions be recorded?",
    a: "Yes! Every attendee gets full access to the high-quality recordings.",
  },
  {
    q: "Which platform will be used?",
    a: "The summit will be hosted on Zoom. Attendees will receive their unique Zoom link and a quick-start guide via email before the event.",
  },
  {
    q: "What is the refund policy?",
    a: "Details TBD.",
  },
];

const Summit2026V1 = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || trimmedName.length > 100) {
      toast({
        title: "Name required",
        description: "Please enter your name (max 100 characters).",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || trimmedEmail.length > 255 || !emailRegex.test(trimmedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("join-summit-waitlist", {
        body: {
          name: trimmedName,
          email: trimmedEmail,
        },
      });

      if (error || !data?.success) {
        console.error("[WAITLIST] Error response", error || data);
        throw new Error(
          (data && (data as { error?: string }).error) || "Failed to join waitlist. Please try again."
        );
      }

      toast({
        title: "You're on the waitlist!",
        description:
          "Thank you. We'll email you as soon as AIxUX Summit 2026 dates and tickets are announced.",
      });

      setFormData({ name: "", email: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      console.error("[WAITLIST] Submission error", err);
      toast({
        title: "Submission failed",
        description: message || "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ticketSoon = () => {
    toast({
      title: "Tickets coming soon",
      description: "Checkout will open closer to the event. Join the waitlist to get early access.",
    });
  };

  return (
    <main id="main" className="space-y-24 md:space-y-32 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-6 sm:pt-8 md:pt-10 py-6 lg:py-8">
        <div className="flex flex-col items-center gap-10 lg:gap-12">
          <div className="space-y-8 text-center w-full max-w-3xl mx-auto pt-4 md:pt-6">
            <div className="inline-flex items-center gap-4 px-6 py-2 bg-uxsg-yellow border-b-2 border-uxsg-ink/5 font-body text-xs tracking-widest uppercase">
              June 18-19, 2026
              <span className="w-1 h-1 bg-uxsg-ink rounded-full"></span>
              Online / Global
            </div>
            <h1 className="font-bold text-foreground leading-tight">
              <span className="block text-6xl md:text-7xl">
                AI<span className="text-gradient">x</span>UX Summit 2026
              </span>
              <span className="relative text-gradient inline-block">
                  Becoming AI Designer
                  <span className="absolute -bottom-0.5 md:-bottom-1 left-0 right-0 block w-full text-[var(--uxsg-yellow)] pointer-events-none">
                    <RoughWavyUnderline className="w-full h-3 md:h-4" strokeW={7} expandToBounds />
                  </span>
              </span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              A virtual, 2-day, deeply hands-on learning experience for UX and product designers navigating the
              AI shift. <br />No hype. No fluff.
            </p>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get{" "}
              <HandDrawnHighlight>real practice</HandDrawnHighlight> facilitated by a{" "}
              <HandDrawnHighlight>community</HandDrawnHighlight> of builders who care about both{" "}
              <HandDrawnHighlight>AI</HandDrawnHighlight> and{" "}
              <HandDrawnHighlight>human experience</HandDrawnHighlight>.
            </p>
            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="relative inline-flex shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                  }
                  aria-describedby="hero-limited-seats-badge"
                  className="inline-flex items-center justify-center relative bg-[#e67e22] text-white px-10 py-5 rounded-full text-xl font-extrabold font-heading border-[1.5px] border-uxsg-ink shadow-[1px_1px_0_0_var(--uxsg-ink),-1px_2px_0_0_var(--uxsg-ink)] hover:scale-105 active:scale-95 transition-all"
                >
                  Register Now
                </button>
                <SketchyBadge
                  id="hero-limited-seats-badge"
                  variant="white"
                  rotation="subtle"
                  className="pointer-events-none absolute -top-2.5 -right-2 z-20 shadow-sm"
                >
                  Limited seats
                </SketchyBadge>
              </div>
              <div className="font-hand text-xl text-muted-foreground inline-flex max-w-full flex-row flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center sm:flex-nowrap">
                <span className="text-3xl shrink-0 leading-none" aria-hidden>
                  ✨
                </span>
                <span>30+ designers joined us last year.</span>
                <Link
                  to="/summit-2025"
                  className="font-hand text-xl text-muted-foreground underline underline-offset-6 decoration-uxsg-ink/40 hover:text-foreground hover:decoration-uxsg-ink transition-colors"
                >
                  See what actually happened →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials — sticky note wall */}
      <section className="max-w-7xl mx-auto px-6 pb-4 overflow-visible">
        <div className="flex flex-col items-center lg:flex-row lg:flex-nowrap lg:justify-center lg:items-start gap-8 lg:gap-5 xl:gap-7 2xl:gap-8 w-full min-w-0">
          {SUMMIT_TESTIMONIALS.map((item, i) => (
            <div key={`${item.name}-${item.role}`} className={TESTIMONIAL_WALL_WRAPPERS[i]}>
              <SketchyTestimonialNote
                quote={item.quote}
                name={item.name}
                role={item.role}
                avatarSrc={item.avatarSrc}
                className="p-6 sm:p-8 lg:p-10 xl:p-12 w-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* This year's features */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start">
        <div className="md:col-span-1 lg:col-span-1 min-w-0">
          <h3 className="font-headline text-3xl lg:text-4xl text-uxsg-ink mb-4 md:mb-0 lg:ml-16">
            Same DNA as our inaugural summit: laptops open, tools in hand.
          </h3>
        </div>
        <div className="md:col-span-1 lg:col-span-2 flex flex-col items-start justify-self-start w-fit max-w-full min-w-0">
          <ul className="space-y-4 lg:space-y-6 font-body text-lg w-full min-w-0">
            {FEATURE_ROWS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-4 items-start">
                <Icon className="w-7 h-7 shrink-0 text-uxsg-rsvp" strokeWidth={2} aria-hidden />
                <span className="text-foreground/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Agenda */}
      <section id="agenda" className="max-w-7xl mx-auto px-6 scroll-mt-24">
        <SketchySectionTitle
          className="mb-4"
          badge={<SketchyBadge rotation="subtle">Tentative</SketchyBadge>}
        >
          The Agenda
        </SketchySectionTitle>
        <p className="font-body text-lg text-center text-foreground/90 mb-16 max-w-2xl mx-auto">
          Theme:{" "}
          <HandDrawnHighlight className="-rotate-[0.35deg]">
            Becoming AI Designer
          </HandDrawnHighlight>
        </p>
        <p className="mt-0 mb-4 text-left font-hand text-xl text-muted-foreground">
          *ALl time are in UTC-4 (Eastern Daylight Time).
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {(
            [
              { day: "Day 1 (June 18)", theme: "The Shift", rows: AGENDA_DAY1 },
              { day: "Day 2 (June 19)", theme: "The Practice", rows: AGENDA_DAY2 },
            ] as const
          ).map(({ day, theme, rows }) => (
            <div key={day} className="summit-notebook-sheet p-8 pl-14 relative">
              <div className="summit-notebook-margin-rail" aria-hidden />
              <h3 className="font-headline text-3xl mb-2 text-uxsg-ink relative z-10">{day}</h3>
              <p className="font-body text-uxsg-rsvp font-bold mb-8 italic relative z-10">
                Theme: &ldquo;{theme}&rdquo;
              </p>
              <div className="space-y-4 relative z-10">
                {rows.map((row) => (
                  <div
                    key={`${row.time}-${row.title}`}
                    className="summit-notebook-row flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 font-mono text-[0.95rem] text-neutral-600"
                  >
                    <span className="font-bold shrink-0 text-neutral-700">{row.time}</span>
                    <span className="text-right">{row.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

     {/* Facilitators */}
     <section id="facilitators" className="max-w-7xl mx-auto px-6">
      <SketchySectionTitle className="mb-4">Meet the Facilitators</SketchySectionTitle>
        <p className="font-body text-lg text-center text-foreground/90 mt-8 mb-16 max-w-2xl mx-auto">
        Coming soon...hold tight!
        </p>
     </section>

      {/* Pricing — full-bleed gradient; content stays max-w-7xl */}
      <section id="pricing" className="relative w-full py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SketchySectionTitle className="mb-6">Get Your Ticket</SketchySectionTitle>
        <div className="flex justify-center mb-10">
          <div className="inline-block p-4 bg-[#ffe24a] border-2 border-uxsg-ink -rotate-1 font-hand text-lg max-w-md text-center">
            ⚡ Early Bird closes ~June 4–5. Price goes up after.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SketchyTallCard
            variant="light"
            fill="#ffe24a"
            strokeWidth={1.5}
            paddingClassName="p-8"
            tapes={[
              { position: "topLeft", size: "sm" },
              { position: "bottomRight", size: "sm" },
            ]}
            className="h-full"
            innerClassName="flex flex-col justify-between min-h-[300px] relative"
          >
            <div>
              <h3 className="font-headline text-2xl mb-4 text-uxsg-ink">Early Bird</h3>
              <div className="text-4xl font-black mb-2 text-uxsg-ink">$2.90</div>
              <p className="font-body text-sm mb-8 opacity-80">Yeah, you read that right. Cheaper than your morning coffee.<br /> <br />Sale closes ~June 4–5.</p>
            </div>
            <button
              type="button"
              onClick={ticketSoon}
              className="relative flex items-center justify-center w-full py-3 text-base font-body"
            >
              <HandDrawnRect fill="#090907" stroke="#090907" strokeWidth={2} />
              <span className="relative z-10 text-white">Get Ticket</span>
            </button>
          </SketchyTallCard>
          <SketchyTallCard
            variant="light"
            fill={CARD_FILL}
            strokeWidth={1.5}
            paddingClassName="p-8"
            tapes={[
              { position: "topLeft", size: "sm" },
              { position: "bottomRight", size: "sm" },
            ]}
            className="h-full"
            innerClassName="flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <h3 className="font-headline text-2xl mb-4 text-uxsg-ink">Regular</h3>
              <div className="text-4xl font-black mb-2 text-uxsg-ink">$29</div>
              <p className="font-body text-sm mb-8 opacity-80">Standard access after June 4–5.</p>
            </div>
            <button
              type="button"
              onClick={ticketSoon}
              className="relative flex items-center justify-center w-full py-3 text-base font-body"
            >
              <HandDrawnRect fill="#090907" stroke="#090907" strokeWidth={2} />
              <span className="relative z-10 text-white">Sales Not Open Yet</span>
            </button>
          </SketchyTallCard>
          <SketchyTallCard
            variant="light"
            fill={CARD_FILL}
            strokeWidth={1.5}
            paddingClassName="p-8"
            tapes={[
              { position: "topLeft", size: "sm" },
              { position: "bottomRight", size: "sm" },
            ]}
            className="h-full"
            innerClassName="flex flex-col justify-between min-h-[300px]"
          >
            <div>
              <h3 className="font-headline text-2xl mb-4 text-uxsg-ink">UXSG Members</h3>
              <div className="text-4xl font-black mb-2 text-uxsg-ink">Free</div>
              <p className="font-body text-sm mb-8 opacity-80">Included in your Skool membership.</p>
            </div>
            <button
              type="button"
              onClick={ticketSoon}
              className="relative flex items-center justify-center w-full py-3 text-base font-body"
            >
              <HandDrawnRect fill="#090907" stroke="#090907" strokeWidth={2} />
              <span className="relative z-10 text-white">Redeem Free Ticket</span>
            </button>
          </SketchyTallCard>
        </div>
        </div>
      </section>

      {/* Is this for you */}
      <div className="w-full px-4 min-[420px]:px-5 sm:px-6 md:px-8 lg:px-10">
        <section className="max-w-5xl mx-auto scroll-mt-24 rounded-3xl border border-uxsg-ink/10 bg-muted/50 px-7 py-10 sm:px-9 sm:py-11 md:px-11 md:py-12 lg:px-12 lg:py-14">
        <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl mb-10 sm:mb-12 md:mb-16 text-uxsg-ink">Is This For You?</h2>
        <div className="grid md:grid-cols-2 gap-12 sm:gap-14 md:gap-16 lg:gap-20">
          <div>
            <h3 className="font-headline text-2xl md:text-3xl mb-8 flex items-center gap-3 text-uxsg-ink">
              <CheckCircle2 className="w-9 h-9 shrink-0 text-secondary" strokeWidth={1.75} aria-hidden />
              This is for you if...
            </h3>
            <ul className="space-y-4 font-body text-md">
              {FOR_YOU.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-2xl md:text-3xl mb-8 flex items-center gap-3 text-uxsg-ink">
              <XCircle className="w-9 h-9 shrink-0 text-destructive" strokeWidth={1.75} aria-hidden />
              This is NOT for you if...
            </h3>
            <ul className="space-y-4 font-body text-md opacity-60">
              {NOT_FOR_YOU.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      </div>

      {/* FAQ */}
      <section id="faq" className="max-w-4xl mx-auto px-6 pb-12">
        <SketchySectionTitle className="mb-16">Got Questions?</SketchySectionTitle>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <MembershipAccordionItem key={item.q} value={`faq-${i}`}>
              <MembershipAccordionTrigger>
                <span className="font-bold text-lg">{item.q}</span>
              </MembershipAccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground">{item.a}</p>
              </AccordionContent>
            </MembershipAccordionItem>
          ))}
        </Accordion>
      </section>

    </main>
  );
};

export default Summit2026V1;
