# Master Your Courses — Front-End

User-facing HTML/CSS/JS front-end, interactive navigation system, qualifying consultation flow, and 113-route site map architecture for **Master Your Courses**.

## Key Entry Points

- **`index.html`** — Complete live Homepage (Hero, By The Numbers, University Marquee, 4-Track Interactive Programs Showcase, 6-Step Methodology, Mentors & Profile Modal, Video Track Record, Facebook Reviews Carousel, FAQ Accordion, Qualifying Consultation `<dialog>`, Floating Advisor Concierge, and 1-to-1 Footer).
- **`sitemap.html`** — Interactive visual architecture overview of all **113 routes** across:
  - **`/programs/*`** — Goal hubs, format hubs (`1-on-1`, `Live Cohorts`, `On-Demand Practice Courses`), all 22 AP courses, Digital SAT & ACT, 9 Math/Science/CS Olympiads, MCAT & DAT pre-health tracks, and High School / University 1-on-1 tutoring.
  - **`/books/*`** — Textbooks & Exam Workbooks store routes.
  - **`/resources/`, `/practice/`, `/mock-exams/`, `/solutions/`, `/tools/`, `/guides/`, `/workshops/`, `/blog/`** — 5-pillar free SEO & lead-generation wing.
  - **Root Company, Portal & Legal** — `pricing.html`, `schools.html`, `about.html`, `methodology.html`, `mentors.html`, `results.html`, `faq.html`, `careers.html`, `contact.html`, `book-consultation.html`, `whatsapp.html`, `login.html` (Student & Parent Sign In), `signup.html` (Student & Parent Sign Up), `privacy.html`, `terms.html`, `refund-policy.html`, `cookies.html`, `social.html`.
- **`sitemap.xml` & `robots.txt`** — Search-engine XML sitemap and crawler configuration.

## Scripts & Verification

Regenerate all Coming Soon route shells, `sitemap.html`, and `sitemap.xml`:

```bash
node build_sitemap_pages.mjs
```

Run the automated UI, accessibility, motion, and link-integrity test suite (`120` tests):

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```
