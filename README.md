# Master Your Courses — Front-End

User-facing HTML/CSS/JS front-end, shared interactive navigation & consultation shell, centralized EdTech SEO / Schema.org engine, and 120-route site architecture for **Master Your Courses**.

## Developer Quick-Start Map

| File / Folder | URL Route | Purpose |
| :--- | :--- | :--- |
| **`index.html`** | `/` | **Main Homepage (Live)** — Hero, By The Numbers, University Marquee, 4-Track Interactive Programs Showcase, 6-Step Methodology, Mentors & Profile Modal, Video Track Record, Facebook Reviews Carousel, FAQ Accordion, Qualifying Consultation `<dialog>`, Floating Advisor Concierge, and 5-Column Footer. |
| **`programs/index.html`** | `/programs/` | **All Programs Directory (Live)** — Searchable, filterable directory of all 47 programs across 6 tracks + side-by-side comparison of 1-on-1 Mentorship, Live Group Cohorts, and On-Demand Practice Courses *(generated from `programs_directory_page.mjs`)*. |
| **`login.html` & `signup.html`** | `/login.html`, `/signup.html` | **Student & Parent Auth Pages (Live, `noindex`)** — Unified Student/Parent Sign In and Create Free Account pages with Google SSO button, deferred `:user-invalid` validation, password visibility toggle, and Masumeh Rajaie (U of T) student proof *(generated from `auth_pages.mjs`)*. |
| **`sitemap.html`** | `/sitemap.html` | **Visual Architecture Map (`noindex, follow`)** — Interactive overview of all **120 routes** with `Live` vs. `Soon` status badges. |
| **`site_shell.mjs`** | *(Build module)* | Single-source shared shell that extracts `<header>`, `<dialog id="consultation-modal">`, and `<footer>` directly from `index.html` and rewrites relative paths (`./` vs. `../`) across all inner routes. |
| **`seo_schemas.mjs`** | *(Build module)* | Centralized EdTech SEO & Schema.org `@graph` builders (`EducationalOrganization`, `WebSite` + `SearchAction`, `Person` faculty profiles, `Course` + `CourseInstance`, `Book` + `Product`, `WebApplication`, `LearningResource` + `Article`, `EducationEvent`, `BreadcrumbList`, `FAQPage`, `VideoObject`) and canonical URL helper. |
| **`build_sitemap_pages.mjs`** | *(Build script)* | Generates inner pages, `sitemap.html`, and `sitemap.xml`. Unfinished placeholder routes automatically emit `noindex, follow` and stay out of `sitemap.xml` until marked `status: "live"`. |
| **`sitemap.xml` & `robots.txt`** | `/sitemap.xml`, `/robots.txt` | Auto-generated XML sitemap of live indexable routes + search & AI answer-engine crawler rules. |

### Folder Structure
- **`/programs/*`** — Goal hubs, format hubs (`1-on-1`, `Live Cohorts`, `On-Demand Practice Courses`), all 22 AP courses, Digital SAT & ACT, 9 Math/Science/CS Olympiads, MCAT & DAT pre-health tracks, and High School / University 1-on-1 tutoring.
- **`/books/*`** — Textbooks & Exam Workbooks store routes *(linked strictly in `<footer>`)*.
- **`/resources/`, `/practice/`, `/mock-exams/`, `/solutions/`, `/tools/`, `/guides/`, `/workshops/`, `/blog/`** — 5-pillar free SEO & lead-generation wing.
- **Root Company, Portal & Legal** — `pricing.html`, `schools.html` (*For Schools & Educators*), `about.html`, `methodology.html`, `mentors.html`, `results.html`, `faq.html`, `careers.html`, `contact.html`, `book-consultation.html`, `whatsapp.html`, `login.html` (*Student & Parent Sign In*), `signup.html` (*Student & Parent Sign Up*), `privacy.html`, `terms.html`, `refund-policy.html`, `cookies.html`, `social.html`.

## Scripts & Verification

Regenerate inner pages, `sitemap.html`, and `sitemap.xml`:

```bash
node build_sitemap_pages.mjs
```

Run the automated UI, accessibility, motion, SEO/Schema.org, and link-integrity test suite (**124 tests**):

```bash
node --test tests/light-mode-section-surfaces.test.mjs
```

## Pre-Production Deployment Note
Pages currently load Tailwind Play CDN (`cdn.tailwindcss.com`) for zero-build previewing during front-end iteration. Before production launch, compile Tailwind CSS statically at build time and serve `.webp`/`.avif` portrait assets for maximum Core Web Vitals / Lighthouse performance.
