import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import portrait from "@/assets/faith-portrait.webp";
import { BookCall, btn } from "@/components/site/BookCall";
import { ContactForm } from "@/components/site/ContactForm";
import { PlanBuilder } from "@/components/site/PlanBuilder";
import { LINKEDIN, X_URL, CALENDLY } from "@/lib/analytics";
import { CountUp, useReveal, useScrollState } from "@/components/site/motion";

const SITE = "https://faithroberts.xyz/";
const TITLE = "Faith M. Roberts | GTM & Fundraising Support for Founders";
const DESC =
  "I help founders get seen, sold and funded through positioning, go-to-market and investor readiness. Africa and emerging markets. Book a call.";
const OG = "https://faithroberts.xyz/og-image.jpg";

const FAQS = [
  {
    q: "What does a GTM consultant for startups do?",
    a: "A GTM consultant helps you decide who to sell to, how to position your product and which channels will actually reach your buyers. I work with founders on positioning, customer acquisition, the sales process and strategic partnerships, so attention turns into revenue.",
  },
  {
    q: "How do I know if my startup is investor-ready?",
    a: "You are close to investor-ready when you have a clear story, evidence of traction or real demand, a defined use of funds, and a realistic reason for the amount you are raising. If any of those are missing, that is where we start.",
  },
  {
    q: "Do you guarantee funding or investor introductions?",
    a: "No. I help founders prepare and position themselves well. Funding decisions are made by investors, and I never promise funding outcomes.",
  },
  {
    q: "What is the difference between Seen, Sold and Funded?",
    a: "Seen is about positioning and visibility, so the right people understand why they should care. Sold is go-to-market: turning that attention into customers, sales and partnerships. Funded is investor readiness: getting your story, numbers and materials ready for the right capital.",
  },
  {
    q: "Do you work with founders outside Nigeria or outside tech?",
    a: "Yes. I work with founders and businesses across Africa and emerging markets, in any sector.",
  },
  {
    q: "How do engagements and pricing work?",
    a: "Every engagement is scoped after a short call. You can work with me on one pillar or all three, and pricing depends on the scope we agree.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Faith M. Roberts",
    url: "https://faithroberts.xyz",
    image: OG,
    jobTitle: "Growth & Venture Ecosystem Strategist",
    worksFor: { "@type": "Organization", name: "Dermon Capital" },
    sameAs: [LINKEDIN, X_URL],
    knowsAbout: [
      "go-to-market strategy",
      "startup fundraising",
      "investor readiness",
      "venture scouting",
      "African startup ecosystem",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Faith M. Roberts",
    url: "https://faithroberts.xyz",
    image: OG,
    areaServed: { "@type": "Place", name: "Africa" },
    description: DESC,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: SITE },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG },
    ],
    links: [
      { rel: "canonical", href: SITE },
      { rel: "preload", as: "image", href: portrait, type: "image/webp" },
    ],
    scripts: jsonLd.map((d) => ({ type: "application/ld+json", children: JSON.stringify(d) })),
  }),
  component: Index,
});

const NAV = [
  ["Framework", "#framework"],
  ["Services", "#services"],
  ["Action plan", "#action-plan"],
  ["About", "#about"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
] as const;

const PILLARS = [
  ["Seen", "Make your positioning and story impossible to misunderstand."],
  ["Sold", "Turn attention into customers, sales and strategic partnerships."],
  ["Funded", "Get investor-ready and closer to the right capital."],
];

const SERVICES = [
  ["Advisory Session", ["A focused look at your biggest growth blocker", "Clear priorities for the next 30 days", "Honest feedback on your story and offer"]],
  ["Seen (Visibility)", ["Sharper positioning and messaging", "A founder story people remember", "A visibility plan for the right audience"]],
  ["Sold (Go-to-Market)", ["A go-to-market strategy for your startup", "A repeatable path to first and next customers", "Partnership targets and outreach approach"]],
  ["Funded (Investor Readiness)", ["Investor-ready narrative and deck review", "A defined use of funds and raise rationale", "Guidance on which investors fit your stage"]],
  ["Full Stack (all three)", ["Positioning, GTM and fundraising support together", "One joined-up plan across all three pillars", "Ongoing support as you execute"]],
] as const;

const STATS: [React.ReactNode, string][] = [
  [<CountUp key="a" to={400} suffix="+" />, "businesses' plans reviewed for grant applications, 2017 to 2019. Three I worked on directly through Nigeria's YouWin program were all funded."],
  [<CountUp key="b" to={700} suffix="+" />, "builders in Fitech Community, a developer community across Africa."],
  [<CountUp key="c" to={400} suffix="+" />, "hackathon applications reviewed, with 15 selected for a partner's venture programme."],
  ["Today", "Community Manager at Dermon Capital."],
  ["Today", "Venture Scout at LvlUp Ventures."],
];

function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <div className="reveal max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {intro && <p className="mt-5 text-lg text-muted-foreground">{intro}</p>}
    </div>
  );
}

function Index() {
  const [presetTopic, setPresetTopic] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled, barRef } = useScrollState();
  useReveal();

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <header className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${scrolled || menuOpen ? "bg-background/85 shadow-[0_6px_24px_rgb(10_28_51/0.08)] backdrop-blur-md" : "bg-transparent"}`}>
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="font-display text-lg font-bold tracking-tight">
            Faith M. <span className="text-gold">Roberts</span>
          </a>
          <ul className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            {NAV.map(([l, h]) => (
              <li key={h}><a href={h} className="transition hover:text-foreground">{l}</a></li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <BookCall location="nav" className="min-h-10 px-5 text-sm" />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>
        <div ref={barRef} aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary" />
        {menuOpen && (
          <ul id="mobile-menu" className="border-t border-border bg-background px-5 py-3 lg:hidden">
            {NAV.map(([l, h]) => (
              <li key={h}><a href={h} onClick={() => setMenuOpen(false)} className="block py-3 text-base">{l}</a></li>
            ))}
          </ul>
        )}
      </header>

      <main id="main">
        {/* HERO */}
        <section id="top" className="relative -mt-16 overflow-hidden pt-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="blob absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl" />
            <div className="blob absolute right-0 top-40 h-[380px] w-[380px] rounded-full bg-blue/10 blur-3xl [animation-delay:-9s]" />
          </div>
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:pb-24 lg:pt-20">
            <div>
              <p className="hero-in text-sm font-semibold uppercase tracking-[0.2em] text-gold">GTM consultant for founders</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="hero-in block [animation-delay:80ms]">I help founders get</span>{" "}
                <span className="hero-in relative inline-block pb-3 [animation-delay:160ms]">
                  <span className="text-gold-gradient">Seen. Sold. Funded.</span>
                  <svg aria-hidden="true" className="underline-draw absolute -bottom-1 left-0 h-4 w-full" viewBox="0 0 300 16" preserveAspectRatio="none" fill="none">
                    <path d="M3 11 C 60 3, 130 4, 190 8 S 270 13, 297 5" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="hero-in mt-6 max-w-xl text-lg text-muted-foreground [animation-delay:240ms] sm:text-xl">
                Positioning, go-to-market and investor-readiness support for founders and businesses across Africa and emerging markets.
              </p>
              <div className="hero-in mt-9 flex flex-col gap-3 [animation-delay:320ms] sm:flex-row">
                <BookCall location="hero" className="pulse-gold" />
                <a href="#framework" className={btn("outline")}>See how I work</a>
              </div>
            </div>
            <div className="hero-in relative mx-auto w-full max-w-md [animation-delay:200ms] lg:max-w-[520px]">
              <div aria-hidden="true" className="float absolute -left-4 top-16 z-10 h-12 w-12 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--gold-light),var(--gold-deep))] shadow-lg [animation-delay:-2s]" />
              <div aria-hidden="true" className="float absolute -right-3 bottom-20 z-10 h-8 w-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,#8fb3ff,var(--blue))] shadow-lg [animation-delay:-4s]" />
              <div className="float navy rounded-t-[999px] rounded-b-[2.5rem] p-2 ring-2 ring-primary/70 ring-offset-4 ring-offset-background shadow-[0_30px_60px_-20px_rgb(10_28_51/0.45)]">
                <img
                  src={portrait}
                  alt="Faith M. Roberts, growth and venture ecosystem strategist"
                  width={900}
                  height={900}
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-[4/5] w-full rounded-t-[999px] rounded-b-[2.2rem] object-cover object-top"
                />
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div aria-hidden="true" className="overflow-hidden border-y border-border bg-cream py-3">
          <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.3em]">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className={i % 2 ? "text-gold" : "text-foreground"}>Seen. Sold. Funded. &#9670;</span>
            ))}
          </div>
        </div>

        {/* PROBLEM */}
        <section aria-label="The problem" className="bg-secondary">
          <p className="reveal mx-auto max-w-5xl px-5 py-14 text-center font-display text-2xl font-semibold leading-snug sm:px-8 sm:text-3xl">
            Most founders don't have a product problem. They have a <span className="text-gold">visibility</span> problem, then a <span className="text-gold">sales</span> problem, then an <span className="text-gold">investor-readiness</span> problem.
          </p>
        </section>

        {/* FRAMEWORK */}
        <section id="framework" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <SectionHead eyebrow="Framework" title={<>The <span className="text-gold-gradient">Seen. Sold. Funded.</span> Framework</>} intro="A simple way to see where your startup is stuck, from positioning and go-to-market strategy to startup fundraising support." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PILLARS.map(([t, d], i) => (
              <article key={t} style={{ "--d": `${i * 100}ms` } as React.CSSProperties} className="reveal lift rounded-3xl border border-border bg-card p-8 card-depth">
                <p className="font-display text-sm font-bold text-gold">0{i + 1}</p>
                <h3 className="mt-3 text-3xl font-extrabold uppercase tracking-tight">{t}</h3>
                <p className="mt-4 text-muted-foreground">{d}</p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-lg font-medium">Work with me on one pillar, or all three.</p>
        </section>

        {/* SERVICES */}
        <section id="services" className="bg-secondary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHead eyebrow="Services" title="How we can work together" />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map(([t, items], i) => (
                <article key={t} style={{ "--d": `${(i % 3) * 100}ms` } as React.CSSProperties} className="reveal lift glow flex flex-col rounded-3xl border border-border bg-card p-8 card-depth">
                  <h3 className="text-xl font-bold">{t}</h3>
                  <ul className="mt-5 flex-1 space-y-3 text-muted-foreground">
                    {items.map((x) => (
                      <li key={x} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{x}</li>
                    ))}
                  </ul>
                  <BookCall location={`service-${(t.split(" ")[0] ?? "").toLowerCase()}`} variant="outline" className="mt-8" />
                </article>
              ))}
            </div>
            <p className="mt-10 max-w-3xl text-muted-foreground">I never promise funding outcomes. I help you be seen, prepared and pointed in the right direction.</p>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <SectionHead eyebrow="Proof" title="Experience behind the work" intro="Years inside the Africa startup ecosystem, as a reviewer, community builder and venture scout." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map(([n, d], i) => (
              <div key={i} style={{ "--d": `${(i % 3) * 100}ms` } as React.CSSProperties} className="reveal lift rounded-3xl border border-border bg-card p-8 card-depth">
                <p className="font-display text-4xl font-extrabold text-gold-gradient">{n}</p>
                <p className="mt-3 text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-cream py-20 lg:py-28">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <SectionHead eyebrow="About" title={<>You could be building the next big thing and <span className="text-gold-gradient">still be invisible.</span></>} />
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>No customers. No serious partnerships. No investor calls. Not because your product is bad, but because the right people haven't understood why they should care yet.</p>
              <p className="text-foreground">I'm Faith M. Roberts. I help founders turn what they've built into attention, customers, partnerships, and capital through positioning, go-to-market strategy, and fundraising support.</p>
              <p>I've worked across startups, tech, Web3, sales, communities and the investment ecosystem. I reviewed business plans for 400+ businesses applying for grants, built a 700+ builder community across Africa, and reviewed 400+ hackathon applications. Today I'm Community Manager at Dermon Capital and a Venture Scout at LvlUp Ventures.</p>
              <p>If you've built something good but the traction, customers, partnerships, or investor attention haven't followed, let's fix the gap between how good your business is and how the market sees it.</p>
            </div>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={`${btn("gold")} mt-9`}>Send me 'SEEN' on LinkedIn</a>
          </div>
        </section>

        {/* INVESTORS */}
        <section id="investors" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <SectionHead eyebrow="Partners" title="For investors and funds" intro="Investor readiness for African startups works best when funds and founders meet prepared." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {([
              ["Prepared founders", "A short list of prepared founders in your sector."],
              ["Founder workshops", "Workshops and training for your founder community."],
              ["Portfolio support", "GTM and visibility support for portfolio companies."],
            ] as const).map(([t, d], i) => (
              <article key={t} style={{ "--d": `${i * 100}ms` } as React.CSSProperties} className="reveal lift rounded-3xl border border-border bg-card p-8 card-depth">
                <h3 className="text-xl font-bold">{t}</h3>
                <p className="mt-3 text-muted-foreground">{d}</p>
              </article>
            ))}
          </div>
          <a href="#contact" onClick={() => setPresetTopic("Investor or fund enquiry")} className={`${btn("outline")} mt-10`}>Start a conversation</a>
        </section>

        {/* ACTION PLAN */}
        <section id="action-plan" className="bg-secondary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHead eyebrow="Free tool" title={<>Get your <span className="text-gold-gradient">Seen, Sold and Funded</span> action plan</>} intro="Describe your business, traction and goals. You'll get a short, personalised plan for each pillar in under a minute." />
            <div className="mt-12"><PlanBuilder /></div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28">
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card card-depth">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-6 sm:px-8">
                <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-4 py-5">
                  <h3 className="text-lg font-semibold">{f.q}</h3>
                  <span aria-hidden="true" className="faq-icon text-2xl text-gold">+</span>
                </summary>
                <p className="pb-6 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="navy relative overflow-hidden py-20 lg:py-28">
          <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <SectionHead eyebrow="Contact" title={<>Building something good that <span className="text-gold-gradient">nobody has seen yet?</span></>} intro="Tell me what you're working on and let's work out the next step." />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <BookCall location="contact" />
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={btn("outline")}>DM 'SEEN' on LinkedIn</a>
              </div>
            </div>
            <ContactForm presetTopic={presetTopic} />
          </div>
        </section>
      </main>

      <footer className="navy border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="font-display text-lg font-bold">Faith M. <span className="text-gold">Roberts</span></p>
              <p className="mt-1 text-sm text-muted-foreground">Helping founders get seen, sold and funded.</p>
            </div>
            <ul className="flex flex-wrap gap-6 text-sm">
              <li><a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="hover:text-gold">LinkedIn</a></li>
              <li><a href={X_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold">X (Twitter)</a></li>
              <li><a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Book on Calendly</a></li>
              <li><a href="#contact" className="hover:text-gold">Contact</a></li>
            </ul>
          </div>
          <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
            Disclosure: I am a Venture Scout with LvlUp Ventures and Community Manager at Dermon Capital. I will always tell you when a recommendation involves an organisation I'm connected to.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">© {new Date().getFullYear()} Faith M. Roberts</p>
        </div>
      </footer>
    </>
  );
}
