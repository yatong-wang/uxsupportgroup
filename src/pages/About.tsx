import { Link } from "react-router-dom";

const MEETUP_EVENTS =
  "https://www.meetup.com/ux-support-group/events/?eventOrigin=home_groups_you_organize";
const LINKEDIN_COMPANY = "https://www.linkedin.com/company/uxsg/";

const linkClass =
  "font-medium text-uxsg-ink underline underline-offset-4 decoration-uxsg-ink/40 transition-colors hover:decoration-uxsg-ink hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uxsg-ink/30 focus-visible:rounded-sm";

const About = () => (
  <main id="main" className="container mx-auto px-4 py-16 md:py-24">
    <article className="mx-auto max-w-3xl font-body text-foreground/90">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-uxsg-ink mb-4">About UX Support Group</h1>
      <p className="text-lg md:text-xl text-foreground/85 font-medium mb-12">
        The Future of UX Is Human. Come Define It With Us.
      </p>

      <section className="space-y-4 mb-12">
        <p>
          The UX landscape is changing fast. New tools, new rules, new workflows. It&apos;s a lot to take in — but
          it&apos;s also incredibly exciting if you have the right place to explore it.
        </p>
        <p>
          UX Support Group (UXSG) is your sandbox to figure it out — together.
        </p>
        <p>
          We are not a lecture hall where you sit quietly and take notes. We are a playground for the curious. We
          believe that Human Ingenuity + AI {">"} AI alone, and the best way to learn is to open your laptop and play.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-uxsg-ink mb-4">A Turning Point</h2>
        <div className="space-y-4">
          <p>
            In fall 2024, as AI began reshaping the tech industry in real time, we sharpened our focus. Design teams
            were being restructured. Job postings were changing. The questions our community was asking got more
            urgent.
          </p>
          <p>
            We made a decision: UXSG would stop being a place to process the change and start being a place to lead it.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-uxsg-ink mb-4">Our mission</h2>
        <blockquote className="border-l-4 border-uxsg-ink/25 pl-5 py-1 text-lg text-foreground/90 italic">
          &ldquo;To empower UX designers to become indispensable — positioning them not only to survive change, but to
          dominate.&rdquo;
        </blockquote>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-uxsg-ink mb-4">What Makes Us Different</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong className="text-uxsg-ink font-semibold">Active Exploration</strong> — We don&apos;t just talk about
            the future; we build it. We run live experiments with new tools to see what breaks and what works.
          </li>
          <li>
            <strong className="text-uxsg-ink font-semibold">Permission to Play</strong> — Forget &ldquo;best
            practices&rdquo; for a moment. This is a low-stakes environment where you can ask &ldquo;what if?&rdquo;,
            test bold ideas, and learn by doing.
          </li>
          <li>
            <strong className="text-uxsg-ink font-semibold">Human-First</strong> — We focus on how technology amplifies
            your unique human strengths — empathy, strategy, and creativity.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-uxsg-ink mb-4">Who&apos;s Here</h2>
        <div className="space-y-4">
          <p>
            Whether you&apos;re just starting to dip your toes into AI or you&apos;re a seasoned leader looking for
            fresh inspiration, you belong here if you&apos;re curious.
          </p>
          <p>
            Our community spans UX designers, product designers, UX researchers, content designers, design leaders, and
            career-changers breaking into the field. We&apos;re rooted in New York City, but our reach has grown well
            beyond the city.
          </p>
          <p>
            Today, UXSG is a community of 9000+ UX and product design professionals — one of the most active design
            communities in the country.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-uxsg-ink mb-4">Guided by Experience</h2>
        <div className="space-y-4">
          <p>
            UXSG was founded by Danny Setiawan, a UX leader with 20+ years of experience across organizations like The
            Economist, Yahoo Finance, and AmericanEagle.com, and an MFA from Parsons School of Design.
          </p>
          <p>
            Danny also runs{" "}
            <a
              href="https://cocreate.consulting/"
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              CoCreate
            </a>
            , a cohort-based learning program helping designers build new skills — including fluency with AI — without
            losing what makes them effective practitioners.
          </p>
          <p>UXSG is driven by a team of practitioner-facilitators. We bring the structure; you bring the curiosity.</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-uxsg-ink mb-4">Our Events</h2>
        <div className="space-y-4">
          <p>
            From casual meetups to structured workshops, UXSG brings the community together regularly — in-person in NYC
            and virtually for members everywhere.
          </p>
          <p>
            <a href={MEETUP_EVENTS} className={linkClass} target="_blank" rel="noopener noreferrer">
              See upcoming events →
            </a>
          </p>
          <p>
            Our flagship event is the AIxUX Virtual Summit, an annual two-day virtual event exploring the intersection of
            AI and UX practice — bringing designers, researchers, and design leaders together for hands-on sessions,
            honest conversations, and real takeaways.
          </p>
          <p>
            The next AIxUX Virtual Summit is June 18–19, 2026.{" "}
            <Link to="/summit" className={linkClass}>
              Learn more →
            </Link>
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-uxsg-ink mb-4">Join Us</h2>
        <div className="space-y-4">
          <p>
            Whether you&apos;re a seasoned design leader or just starting out, there&apos;s a place for you here.
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <a href={MEETUP_EVENTS} className={linkClass} target="_blank" rel="noopener noreferrer">
              See upcoming events
            </a>
            <span className="text-muted-foreground" aria-hidden>
              ·
            </span>
            <a href={LINKEDIN_COMPANY} className={linkClass} target="_blank" rel="noopener noreferrer">
              Follow us on LinkedIn
            </a>
          </p>
        </div>
      </section>
    </article>
  </main>
);

export default About;
