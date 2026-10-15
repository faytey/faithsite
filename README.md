# Stellar Business Growth

Build a premium, single-page personal brand website for Faith M. Roberts, who helps founders and businesses get SEEN, SOLD and FUNDED. The live domain is https://faithroberts.xyz. Build it as a fast, mobile-first, highly SEO-optimized site using React + TypeScript + Tailwind, semantic HTML, and react-helmet-async for head tags. Pre-render/static-generate the homepage if possible so search engines can read the full HTML.

BRAND & DESIGN
- Deep navy background (#0A1C33), white text, warm gold accents (#E6AE3F). Premium, editorial, confident, generous whitespace. No stock illustrations, no clutter, no emojis.
- Fonts: Poppins (headings, bold/extra-bold) and Inter (body), loaded with font-display: swap.
- Subtle gold gradient on key words, soft depth on cards, smooth scrolling, gentle fade-in on scroll.
- Sticky top nav: wordmark "Faith M. Roberts", links (Framework, Services, About, FAQ, Contact), gold button "Book a call".
- Fully responsive, mobile-first, large touch-friendly buttons.

PAGE STRUCTURE (one page, in this order, each section with an anchor ID)

1. HERO
- H1 (the only H1 on the page): "I help founders get Seen. Sold. Funded."
- Subheadline: "Positioning, go-to-market and investor-readiness support for founders and businesses across Africa and emerging markets."
- Buttons: "Book a call" (primary gold, links to https://calendly.com/faytey7) and "See how I work" (outline, scrolls to the framework).
- Portrait of Faith on the right (use the uploaded portrait; its navy background should blend into the page).

2. PROBLEM STRIP
- "Most founders don't have a product problem. They have a visibility problem, then a sales problem, then an investor-readiness problem."

3. FRAMEWORK
- H2: "The Seen. Sold. Funded. Framework"
- Three cards:
  - SEEN: Make your positioning and story impossible to misunderstand.
  - SOLD: Turn attention into customers, sales and strategic partnerships.
  - FUNDED: Get investor-ready and closer to the right capital.
- Line under the cards: "Work with me on one pillar, or all three."

4. SERVICES
- H2: "How we can work together"
- Cards: Advisory Session, Seen (Visibility), Sold (Go-to-Market), Funded (Investor Readiness), Full Stack (all three). Each has 3 short bullet outcomes and a "Book a call" button. Do NOT show prices.
- Note under the cards: "I never promise funding outcomes. I help you be seen, prepared and pointed in the right direction."

5. EXPERIENCE & PROOF
- H2: "Experience behind the work"
- Text-based stat cards (no logos):
  - 400+ businesses' plans reviewed for grant applications, 2017 to 2019 (three worked on directly through Nigeria's YouWin program were all funded)
  - 700+ builders in Fitech Community, a developer community across Africa
  - 400+ hackathon applications reviewed, 15 selected for a partner's venture programme
  - Community Manager at Dermon Capital
  - Venture Scout at LvlUp Ventures

6. ABOUT
- H2: "You could be building the next big thing and still be invisible."
- Use this exact copy as short paragraphs:
  "No customers. No serious partnerships. No investor calls. Not because your product is bad, but because the right people haven't understood why they should care yet."
  "I'm Faith M. Roberts. I help founders turn what they've built into attention, customers, partnerships, and capital through positioning, go-to-market strategy, and fundraising support."
  "I've worked across startups, tech, Web3, sales, communities and the investment ecosystem. I reviewed business plans for 400+ businesses applying for grants, built a 700+ builder community across Africa, and reviewed 400+ hackathon applications. Today I'm Community Manager at Dermon Capital and a Venture Scout at LvlUp Ventures."
  "If you've built something good but the traction, customers, partnerships, or investor attention haven't followed, let's fix the gap between how good your business is and how the market sees it."
- Button: "Send me 'SEEN' on LinkedIn" (https://linkedin.com/in/faytey7)

7. FOR INVESTORS & FUNDS
- H2: "For investors and funds"
- Three offers: a short list of prepared founders in your sector; workshops and training for your founder community; GTM and visibility support for portfolio companies.
- Button: "Start a conversation" that scrolls to the contact form (#contact) and preselects "Investor or fund enquiry" in the form's topic dropdown.

8. FAQ (accordion) with FAQPage schema. H2: "Frequently asked questions". Questions and answers:
- What does a GTM consultant for startups do? (Answer in 2 to 3 plain sentences about positioning, customer acquisition, sales and partnerships.)
- How do I know if my startup is investor-ready? (Clear story, evidence of traction or demand, a defined use of funds, and a realistic reason for the amount raised.)
- Do you guarantee funding or investor introductions? (No. I help founders prepare and position; funding decisions are made by investors.)
- What is the difference between Seen, Sold and Funded?
- Do you work with founders outside Nigeria or outside tech? (Yes, founders and businesses across Africa and emerging markets, in any sector.)
- How do engagements and pricing work? (Scoped after a short call; one pillar or all three.)

9. FINAL CTA + CONTACT FORM (id="contact")
- H2: "Building something good that nobody has seen yet?"
- Text: "Tell me what you're working on and let's work out the next step."
- Two buttons above the form: "Book a call" (https://calendly.com/faytey7) and "DM 'SEEN' on LinkedIn" (https://linkedin.com/in/faytey7).
- Contact form with these fields:
  - Full name (required)
  - Email address (required, validated)
  - Company or project name (optional)
  - What do you need help with? (dropdown: Seen (visibility), Sold (go-to-market), Funded (investor readiness), All three, Advisory session, Investor or fund enquiry, Something else)
  - Message: "Tell me what you're building and where you're stuck." (required, minimum 20 characters)
  - Gold submit button: "Send message"
- Form behaviour: client-side validation with clear inline error messages; disable the button while sending; show a friendly success message ("Thank you. I'll reply within 2 working days.") and a clear error message if sending fails; keyboard accessible with visible labels (not placeholder-only).
- Spam protection: a hidden honeypot field plus basic rate-limiting. Do not use CAPTCHAs that harm usability.
- Delivery: send each submission to faithroberts708@gmail.com from a backend/serverless function (for example a Lovable Cloud or Supabase edge function using an email service such as Resend). Never expose the destination email address in the client code, the HTML, or the structured data. If a backend isn't available, wire the form to a form-handling service endpoint using the placeholder [FORM_ENDPOINT] and tell me what to configure.
- Small privacy note under the form: "Your details are used only to reply to your message."

10. FOOTER
- Name, short tagline, links to LinkedIn (https://linkedin.com/in/faytey7), X (https://x.com/faytey7), Calendly, and an anchor link "Contact" that scrolls to the form. Do not display an email address anywhere.
- Disclosure line: "Disclosure: I am a Venture Scout with LvlUp Ventures and Community Manager at Dermon Capital. I will always tell you when a recommendation involves an organisation I'm connected to."

SEO REQUIREMENTS (implement all)
- <title>: "Faith M. Roberts | GTM & Fundraising Support for Founders"
- Meta description (under 155 characters): "I help founders get seen, sold and funded through positioning, go-to-market and investor readiness. Africa and emerging markets. Book a call."
- Canonical: https://faithroberts.xyz/. HTML lang="en".
- Open Graph and Twitter Card tags (title, description, URL https://faithroberts.xyz/, a 1200x630 image using the hero portrait on navy, type "website", card "summary_large_image").
- JSON-LD structured data:
  - Person (name Faith M. Roberts, url https://faithroberts.xyz, jobTitle "Growth & Venture Ecosystem Strategist", worksFor Dermon Capital, sameAs https://linkedin.com/in/faytey7 and https://x.com/faytey7, knowsAbout: go-to-market strategy, startup fundraising, investor readiness, venture scouting, African startup ecosystem). Do not include an email address.
  - ProfessionalService (name "Faith M. Roberts", areaServed Africa, url https://faithroberts.xyz)
  - FAQPage matching the FAQ exactly.
- One H1, then a logical H2/H3 hierarchy. Semantic tags: header, nav, main, section, footer. Descriptive anchor text.
- Weave these keywords naturally into headings and copy (no stuffing): go-to-market strategy for startups, startup fundraising support, investor readiness for African startups, venture scout, GTM consultant for founders, Africa startup ecosystem.
- Images: descriptive alt text (e.g., "Faith M. Roberts, growth and venture ecosystem strategist"), explicit width and height, WebP, lazy-load everything except the hero image.
- Performance: 90+ Lighthouse on mobile, no layout shift, preload the hero image and primary fonts, minimal JavaScript.
- Add /robots.txt (allow all, include "Sitemap: https://faithroberts.xyz/sitemap.xml"), /sitemap.xml listing the homepage, a favicon (gold "F" on navy) and an apple-touch-icon.
- Accessibility: AA contrast, visible focus states, keyboard-operable accordion and form, associated labels, aria-labels on icon-only buttons, aria-live region for form success/error messages.
- No lorem ipsum anywhere. Plain, confident English. No exaggerated claims or guarantees.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://stellar-business-growth.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ad00a64c-c468-5b39-8ba4-4113c6ca2b53).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
