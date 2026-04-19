import DannyS from "@/assets/Summit2026-DannyS.png";
import SuyenL from "@/assets/Summit2026-SuyenL.png";
import SilviaB from "@/assets/Summit2026-SilviaB.png";
import VolkanU from "@/assets/Summit2026-VolkanU.png";
import RenataR from "@/assets/Summit2026-RenataR.png";
import AlexisB from "@/assets/Summit2026-AlexisB.png";
import CoreyM from "@/assets/CoreyM-2.png";

/** Agenda-aligned order: Day 1 appearance, then Day 2 (see Summit2026V1 agenda). */
export type Summit2026FacilitatorEntry = {
  name: string;
  title: string;
  company: string | null;
  bio: string;
  linkedin: string;
  /** Omit for placeholder avatar (initials). */
  image?: string;
};

export function formatSummitFacilitatorRoleLine(title: string, company: string | null): string {
  if (company) return `${title} @ ${company}`.toUpperCase();
  return title.toUpperCase();
}

export const SUMMIT_2026_FACILITATORS: Summit2026FacilitatorEntry[] = [
  {
    name: "Suyen Stevenson",
    title: "UX Designer, AI Practitioner, Hackathon Junkie",
    company: null,
    bio: "Creative and analytical designer with a strong track record in UX design, digital product development, and product ops. Conference moderator skilled at engaging audiences and facilitating meaningful discussions. Brings over a decade of experience in visual design. Former: Revlon, LLNS, AFCEA Ace, First Responders Childrens Foundation, TASH",
    linkedin: "https://www.linkedin.com/in/suyenlyn/",
    image: SuyenL,
  },
  {
    name: "Danny Setiawan",
    title: "Founder UXSG, Co-Create Consulting",
    company: null,
    bio: "UX leader and AI educator with a track record delivering product innovation for global brands including Yahoo!, The Economist, Disney, Sony, and Men's Warehouse, as well as growing the community of UX professionals with over 8800 members from all over the world.",
    linkedin: "https://www.linkedin.com/in/dnystwn/",
    image: DannyS,
  },
  {
    name: "Silvia Balu",
    title: "UX/UI Designer, International UX & AI Community Lead",
    company: null,
    bio: "Recognized for innovation in design research and for bridging psychology, user experience, and AI to inspire more emotionally intelligent digital products.",
    linkedin: "https://www.linkedin.com/in/silviabalu/",
    image: SilviaB,
  },
  {
    name: "Corey Malone",
    title: "Sr Product Designer, Fintech/Enterprise",
    company: null,
    bio: "I'm a Senior Product Designer who's been obsessed with algorithmic thinking since I started coding at twelve, a foundation that now fuels my work in agentic AI. With nearly a decade in fintech and enterprise, I focus on the entire AI-integrated journey—not just to figure out what we can build, but to have the discipline to decide what we shouldn't.",
    linkedin: "https://www.linkedin.com/in/coreymalone/",
    image: CoreyM,
  },
  {
    name: "Volkan Unsal",
    title: "Senior Front End Engineer",
    company: "Amazon Web Services (AWS)",
    bio: "Expert in cloud technology, civic tech, and startup development. Former: Co-Founder, Citiesense; Code for America.",
    linkedin: "https://www.linkedin.com/in/volkanunsal/",
    image: VolkanU,
  },
  {
    name: "Renata Rocha",
    title: "Senior UX Designer",
    company: null,
    bio: "UX and product design leader specializing in digital financial services and e-commerce. Renata drives design for Amazon's payments platform and has led teams at JPMorgan Chase, impacting customer experience for millions. She has delivered over 600 websites, shaped major initiatives for Fortune 500s and Globo affiliates, and helped train the next generation of designers in academia.",
    linkedin: "https://www.linkedin.com/in/rerocha/",
    image: RenataR,
  },
  {
    name: "Alexis Brochu",
    title: "Principal, AI Product Strategist",
    company: "Alexis Design",
    bio: "Human-first product leader specializing in AI-powered transformation across design, technology, and business domains. Expertise in UX-informed product strategy and developing business acumen in technical leaders. Former: California Governor's Office of Emergency Services, Rhode Island T.F. Green International Airport, WLNE-ABC6-TV, Brown University Health Systems, Mallinckrodt Pharmaceuticals.",
    linkedin: "https://www.linkedin.com/in/alexisbrochu/",
    image: AlexisB,
  },
];
