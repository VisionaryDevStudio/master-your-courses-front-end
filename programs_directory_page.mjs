import { escapeHtml, renderSharedShell } from "./site_shell.mjs";
import {
  ORG_ID,
  WEBSITE_ID,
  buildBreadcrumbSchema,
  toCanonicalUrl
} from "./seo_schemas.mjs";

const FORMATS_ALL = ["1-on-1", "Live Cohort", "Practice Course"];
const FORMATS_TUTOR = ["1-on-1"];

export const DIRECTORY_SECTIONS = [
  {
    id: "ap",
    heading: "AP Courses & Exam Prep",
    eyebrow: "22 AP Subjects",
    overviewHref: "./ap-prep.html",
    overviewLabel: "AP Prep Overview",
    description: "Build deep conceptual mastery for both your school grade all year and a 5 in May.",
    items: [
      { title: "AP Biology", href: "./ap-biology.html", family: "Sciences", formats: FORMATS_ALL, summary: "Cellular energetics, genetics, gene expression, ecology, and data-driven FRQs without rote memorization.", keywords: "bio campbell genetics cells lab frq" },
      { title: "AP Chemistry", href: "./ap-chemistry.html", family: "Sciences", formats: FORMATS_ALL, summary: "Thermodynamics, kinetics, equilibrium, acids and bases, buffers, and electrochemistry from first principles.", keywords: "chem stoichiometry titration lab frq" },
      { title: "AP Physics 1", href: "./ap-physics-1.html", family: "Sciences", formats: FORMATS_ALL, summary: "Algebra-based kinematics, forces, energy, momentum, rotation, oscillations, and fluids.", keywords: "mechanics newton qqt torque" },
      { title: "AP Physics 2", href: "./ap-physics-2.html", family: "Sciences", formats: FORMATS_ALL, summary: "Thermodynamics, electric circuits, electromagnetism, geometric optics, waves, and modern physics.", keywords: "circuits magnetism optics quantum" },
      { title: "AP Physics C: Mechanics", href: "./ap-physics-c-mechanics.html", family: "Sciences", formats: FORMATS_ALL, summary: "Calculus-based motion, differential equations, rotational dynamics, oscillations, and gravitation.", keywords: "calc physics engineering derivatives integrals" },
      { title: "AP Physics C: E&M", href: "./ap-physics-c-em.html", family: "Sciences", formats: FORMATS_ALL, summary: "Gauss’s law, electric potential, RC and RL circuits, magnetic induction, and Maxwell’s equations.", keywords: "electricity magnetism flux maxwell" },
      { title: "AP Environmental Science", href: "./ap-environmental-science.html", family: "Sciences", formats: FORMATS_ALL, summary: "Ecosystems, earth systems, energy calculations, pollution models, and solution-design FRQs.", keywords: "apes ecology climate math" },
      { title: "AP Precalculus", href: "./ap-precalculus.html", family: "Math & CS", formats: FORMATS_ALL, summary: "Polynomial, rational, exponential, logarithmic, trigonometric, and polar function modeling.", keywords: "precalc trig functions graphing" },
      { title: "AP Calculus AB", href: "./ap-calculus-ab.html", family: "Math & CS", formats: FORMATS_ALL, summary: "Limits, derivatives, optimization, accumulation integrals, and differential equations.", keywords: "calc ab derivatives integrals motion" },
      { title: "AP Calculus BC", href: "./ap-calculus-bc.html", family: "Math & CS", formats: FORMATS_ALL, summary: "Integration techniques, parametric, polar, and vector calculus, Euler’s method, and Taylor series.", keywords: "calc bc series maclaurin polar" },
      { title: "AP Statistics", href: "./ap-statistics.html", family: "Math & CS", formats: FORMATS_ALL, summary: "Probability distributions, experimental design, confidence intervals, hypothesis tests, and FRQ 6.", keywords: "stats inference probability p-value" },
      { title: "AP Computer Science A", href: "./ap-computer-science-a.html", family: "Math & CS", formats: FORMATS_ALL, summary: "Object-oriented Java programming across classes, arrays, ArrayLists, 2D arrays, inheritance, and recursion.", keywords: "csa java coding programming oop" },
      { title: "AP CS Principles", href: "./ap-computer-science-principles.html", family: "Math & CS", formats: FORMATS_ALL, summary: "Algorithmic logic, pseudocode tracing, data systems, networks, and the Create Performance Task.", keywords: "csp coding create task algorithms" },
      { title: "AP Microeconomics", href: "./ap-microeconomics.html", family: "Econ, English & History", formats: FORMATS_ALL, summary: "Supply and demand elasticity, cost curves, market structures, game theory, and factor markets.", keywords: "micro econ graphs monopoly" },
      { title: "AP Macroeconomics", href: "./ap-macroeconomics.html", family: "Econ, English & History", formats: FORMATS_ALL, summary: "AD-AS models, fiscal and monetary policy, reserve banking, Phillips curves, and foreign exchange.", keywords: "macro econ gdp inflation fx" },
      { title: "AP Psychology", href: "./ap-psychology.html", family: "Econ, English & History", formats: FORMATS_ALL, summary: "Biological bases of behavior, cognition, development, clinical psychology, and research-design FRQs.", keywords: "psych brain memory research aaq ebq" },
      { title: "AP English Language", href: "./ap-english-language.html", family: "Econ, English & History", formats: FORMATS_ALL, summary: "Synthesis, Rhetorical Analysis, and Argument essays paired with close-reading multiple choice.", keywords: "ap lang writing rhetoric essays" },
      { title: "AP English Literature", href: "./ap-english-literature.html", family: "Econ, English & History", formats: FORMATS_ALL, summary: "Analytical essays on poetry, prose fiction, and literary argument under timed exam conditions.", keywords: "ap lit poetry prose literature essays" },
      { title: "AP U.S. History", href: "./ap-us-history.html", family: "Econ, English & History", formats: FORMATS_ALL, summary: "Causal historical reasoning across Periods 1–9 with structured practice on SAQs, DBQs, and LEQs.", keywords: "apush american history dbq leq" },
      { title: "AP World History", href: "./ap-world-history.html", family: "Econ, English & History", formats: FORMATS_ALL, summary: "Global networks, empires, revolutions, and modern shifts from 1200 CE to the present.", keywords: "whap modern world history dbq" },
      { title: "AP U.S. Government", href: "./ap-us-government.html", family: "Econ, English & History", formats: FORMATS_ALL, summary: "Foundational documents, required Supreme Court cases, quantitative data analysis, and argument essays.", keywords: "ap gov politics scotus constitution" },
      { title: "AP Human Geography", href: "./ap-human-geography.html", family: "Econ, English & History", formats: FORMATS_ALL, summary: "Population, culture, political organization, agriculture, and urban spatial models.", keywords: "aphug geography maps 9th grade" }
    ]
  },
  {
    id: "sat-act",
    heading: "Digital SAT, PSAT & ACT Prep",
    eyebrow: "College Admissions & Merit Scholarships",
    overviewHref: "./sat-prep.html",
    overviewLabel: "SAT Prep Overview",
    description: "Diagnostic-driven preparation across Reading, Writing, Math, and Science to reach top-percentile and National Merit scores.",
    items: [
      { title: "Digital SAT Prep Overview", href: "./sat-prep.html", family: "Digital SAT", formats: FORMATS_ALL, summary: "Full adaptive Module 1 and Module 2 preparation across Reading & Writing and Math—built to push past 1500+.", keywords: "dsat college board 1500 1550 desmos verbal math" },
      { title: "1-on-1 SAT Mentorship", href: "./sat-1-on-1.html", family: "Digital SAT", formats: ["1-on-1"], summary: "Private coaching customized to your baseline diagnostic, error patterns, and target test date.", keywords: "private sat tutor coaching" },
      { title: "Live SAT Group Cohort", href: "./sat-cohort.html", family: "Digital SAT", formats: ["Live Cohort"], summary: "Small-group weekly live classes covering high-yield grammar, reading comprehension, and Desmos math.", keywords: "sat class group bootcamp" },
      { title: "On-Demand SAT Practice Course", href: "./sat-practice-course.html", family: "Digital SAT", formats: ["Practice Course"], summary: "Self-paced question banks, skill drills, and realistic adaptive practice tests available 24/7.", keywords: "self study sat questions" },
      { title: "PSAT / NMSQT & National Merit Prep", href: "./psat-national-merit.html", family: "National Merit", formats: FORMATS_ALL, summary: "Selection Index optimization across Reading & Writing and Math to clear state Semifinalist cutoffs and unlock merit scholarships.", keywords: "psat nmsqt national merit semifinalist finalist scholarship 10th 11th" },
      { title: "ACT Prep — All Formats", href: "./act-prep.html", family: "ACT", formats: FORMATS_ALL, summary: "Targeted preparation across ACT English, Math, Reading, and Science reasoning with timing discipline.", keywords: "act 34 35 36 composite science" }
    ]
  },
  {
    id: "competition",
    heading: "Math, Science & Computing Olympiads",
    eyebrow: "9 Competition Tracks",
    overviewHref: "./competition-prep.html",
    overviewLabel: "Competition Overview",
    description: "First-principles problem-solving and proof training for students aiming for national distinction.",
    items: [
      { title: "AMC 8 & MATHCOUNTS", href: "./amc-8-mathcounts.html", family: "Math Contests", formats: FORMATS_ALL, summary: "Counting, number theory, geometry, and algebraic intuition for middle school competitors.", keywords: "middle school math honor roll" },
      { title: "AMC 10 Prep", href: "./amc-10.html", family: "Math Contests", formats: FORMATS_ALL, summary: "Non-routine algebra, Euclidean geometry, combinatorics, and number theory to qualify for the AIME.", keywords: "9th 10th grade maa aime cutoff" },
      { title: "AMC 12 Prep", href: "./amc-12.html", family: "Math Contests", formats: FORMATS_ALL, summary: "Complex numbers, trigonometry, logarithms, 3D geometry, and advanced combinatorics for AIME & Honor Roll.", keywords: "11th 12th grade maa aime distinction" },
      { title: "AIME & USA(J)MO / USAMO", href: "./aime-usamo.html", family: "Math Contests", formats: FORMATS_ALL, summary: "Multi-step AIME integer problem-solving and rigorous Olympiad proof writing.", keywords: "invitational proofs olympiad math" },
      { title: "Waterloo / CEMC Contests", href: "./waterloo-cemc-contests.html", family: "Math Contests", formats: FORMATS_ALL, summary: "Targeted preparation for Gauss, Pascal, Cayley, Fermat, Fryer, Galois, Hypatia, and Euclid contests.", keywords: "canada waterloo euclid written proofs" },
      { title: "F=ma & USAPhO", href: "./fma-usapho.html", family: "Science & CS Olympiads", formats: FORMATS_ALL, summary: "Advance from tricky F=ma mechanics problems to calculus-based USAPhO derivations.", keywords: "physics olympiad mechanics" },
      { title: "USNCO Chemistry Olympiad", href: "./usnco-chemistry-olympiad.html", family: "Science & CS Olympiads", formats: FORMATS_ALL, summary: "Local and National exam training across physical, organic, inorganic, analytical, and lab chemistry.", keywords: "chemistry olympiad acs" },
      { title: "USABO Biology Olympiad", href: "./usabo-biology-olympiad.html", family: "Science & CS Olympiads", formats: FORMATS_ALL, summary: "University-level physiology, biochemistry, genetics, plant biology, and experimental data analysis.", keywords: "biology olympiad campbell open semifinal" },
      { title: "USACO Computing Olympiad", href: "./usaco-computing-olympiad.html", family: "Science & CS Olympiads", formats: FORMATS_ALL, summary: "Algorithmic problem-solving in C++, Java, or Python from Bronze through Silver, Gold, and Platinum.", keywords: "coding algorithms dp graphs bronze silver gold platinum" }
    ]
  },
  {
    id: "mcat-dat",
    heading: "MCAT & DAT Pre-Health Prep",
    eyebrow: "Medical & Dental Admissions",
    overviewHref: "./mcat-dat-prep.html",
    overviewLabel: "Pre-Health Overview",
    description: "Concept-first science review, experimental passage dissection, CARS, and Perceptual Ability coaching.",
    items: [
      { title: "MCAT Prep Overview", href: "./mcat-prep.html", family: "Pre-Med", formats: FORMATS_ALL, summary: "Comprehensive 4-section mastery across Chem/Phys, CARS, Bio/Biochem, and Psych/Soc.", keywords: "medical school aamc 515 520 premed" },
      { title: "1-on-1 MCAT Mentorship", href: "./mcat-1-on-1.html", family: "Pre-Med", formats: ["1-on-1"], summary: "Custom study schedule, passage reasoning coaching, and full-length practice exam reviews.", keywords: "private mcat tutor md phd" },
      { title: "Live MCAT Group Cohort", href: "./mcat-cohort.html", family: "Pre-Med", formats: ["Live Cohort"], summary: "Weekly live small-group instruction across all four MCAT sections with structured checkpoints.", keywords: "mcat class course summer" },
      { title: "On-Demand MCAT Practice Course", href: "./mcat-practice-course.html", family: "Pre-Med", formats: ["Practice Course"], summary: "Self-paced experimental science passages, discrete drills, and CARS practice sets.", keywords: "mcat qbank passages" },
      { title: "DAT Prep — Dental Admission Test", href: "./dat-prep.html", family: "Pre-Dental", formats: FORMATS_ALL, summary: "Natural Sciences, Perceptual Ability (PAT), Reading Comprehension, and Quantitative Reasoning.", keywords: "dental school pat biology organic chem dmd" }
    ]
  },
  {
    id: "tutoring",
    heading: "Course & IB Diploma Tutoring",
    eyebrow: "High School, IB & University",
    overviewHref: "./course-tutoring.html",
    overviewLabel: "Tutoring Overview",
    description: "Private 1-on-1 mentorship matched directly to your school teacher’s, IB coordinator’s, or university professor’s syllabus.",
    items: [
      { title: "High School & Honors Tutoring", href: "./high-school-tutoring.html", family: "Grades 8–12", formats: FORMATS_TUTOR, summary: "Syllabus-matched support across Algebra, Geometry, Precalculus, Biology, Chemistry, Physics, and Humanities.", keywords: "honors high school homework tests gpa" },
      { title: "IB Diploma (HL & SL) Tutoring & Exam Prep", href: "./ib-diploma-prep.html", family: "IB Diploma", formats: FORMATS_ALL, summary: "IB Math AA/AI, Physics, Chemistry, Biology, and Economics—covering Papers 1–3, Internal Assessments (IAs), and 7-score mastery.", keywords: "international baccalaureate ib hl sl math aa ai ia internal assessment" },
      { title: "University & Pre-Med STEM Tutoring", href: "./university-tutoring.html", family: "Undergraduate", formats: FORMATS_TUTOR, summary: "1-on-1 coaching for Calculus I–III, Linear Algebra, Differential Equations, General & Organic Chemistry, Physics, and Statistics.", keywords: "college calculus orgo organic chemistry linear algebra physics" }
    ]
  },
  {
    id: "research-admissions",
    heading: "STEM Research & College Admissions Mentorship",
    eyebrow: "Research, Science Fairs & Selective Admissions",
    overviewHref: "./stem-research-mentorship.html",
    overviewLabel: "Research Mentorship",
    description: "Work 1-on-1 with PhD researchers, doctors, and senior advisors on original research papers and selective university positioning.",
    items: [
      { title: "1-on-1 STEM Research & Science Fair Mentorship", href: "./stem-research-mentorship.html", family: "Research & ISEF", formats: FORMATS_TUTOR, summary: "Guided quantitative, AI/CS, physics, or life-science research papers for Regeneron STS, ISEF, AP Research, and student journals.", keywords: "research paper isef regeneron sts science fair publication phd mentor" },
      { title: "Selective College & Pre-Med Admissions Advising", href: "./college-admissions-counseling.html", family: "College Advising", formats: FORMATS_TUTOR, summary: "9th–12th grade course and testing strategy, RSI/Simons/SSP summer applications, university lists, and STEM / BS-MD essay mentorship.", keywords: "college counseling admissions mit ivy league u of t waterloo bs md essays summer programs" }
    ]
  }
];

export function renderProgramsDirectoryPage() {
  const totalCount = DIRECTORY_SECTIONS.reduce((sum, sec) => sum + sec.items.length, 0);

  const extraHeadCss = `
    .directory-filter-input {
      font: inherit;
      font-size: max(1rem, 1em);
      min-height: 48px;
      box-sizing: border-box;
    }
    @media (pointer: coarse) {
      .directory-filter-input {
        min-height: 52px;
      }
    }
    .filter-pill-scroller {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }
    .filter-pill-scroller::-webkit-scrollbar {
      display: none;
    }
    .filter-pill-label {
      scroll-snap-align: start;
      cursor: pointer;
      user-select: none;
      min-block-size: 2.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.95rem;
      border-radius: 9999px;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--background));
      color: hsl(var(--muted-foreground));
      font-size: 0.8125rem;
      font-weight: 700;
      white-space: nowrap;
      transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease, scale 150ms ease;
    }
    .filter-pill-label:hover {
      color: hsl(var(--foreground));
      border-color: rgb(99 102 241 / 0.45);
    }
    @media (prefers-reduced-motion: no-preference) {
      .filter-pill-label:active {
        scale: 0.97;
      }
      .program-directory-card {
        transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
      }
      @media (hover: hover) and (pointer: fine) {
        .program-directory-card:hover {
          transform: translateY(-2px);
        }
      }
    }
    .filter-radio:checked + .filter-pill-label {
      background: hsl(var(--foreground));
      color: hsl(var(--background));
      border-color: hsl(var(--foreground));
      box-shadow: 0 6px 18px rgb(15 23 42 / 0.14);
    }
    .filter-radio:focus-visible + .filter-pill-label {
      outline: 2px solid #6366f1;
      outline-offset: 3px;
    }
    .program-directory-card {
      border: 1px solid hsl(var(--border));
      border-radius: 1.5rem;
      background: rgb(255 255 255 / 0.92);
      box-shadow: 0 4px 18px rgb(15 23 42 / 0.04);
    }
    .dark .program-directory-card {
      background: rgb(24 24 27 / 0.88);
      box-shadow: 0 12px 32px rgb(0 0 0 / 0.25);
    }
    .program-directory-card:hover {
      border-color: rgb(99 102 241 / 0.45);
    }
  `;

  const trackRadios = [
    { value: "all", label: `All Programs (${totalCount})` },
    { value: "ap", label: "AP Courses (22)" },
    { value: "sat-act", label: "SAT, PSAT & ACT (6)" },
    { value: "competition", label: "Olympiads (9)" },
    { value: "mcat-dat", label: "MCAT & DAT (5)" },
    { value: "tutoring", label: "Course & IB Tutoring (3)" },
    { value: "research-admissions", label: "Research & Admissions (2)" }
  ];

  const formatRadios = [
    { value: "all", label: "Any Format" },
    { value: "1-on-1", label: "1-on-1 Mentorship" },
    { value: "Live Cohort", label: "Live Group Cohort" },
    { value: "Practice Course", label: "On-Demand Practice Course" }
  ];

  const sectionsHtml = DIRECTORY_SECTIONS.map(section => `
    <section id="section-${escapeHtml(section.id)}" data-directory-section="${escapeHtml(section.id)}" class="scroll-mt-28">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 mb-6 border-b border-border">
        <div>
          <span class="inline-block text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-display mb-1.5">${escapeHtml(section.eyebrow)}</span>
          <h2 class="text-2xl sm:text-3xl font-black font-display tracking-tight text-foreground">${escapeHtml(section.heading)}</h2>
          <p class="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">${escapeHtml(section.description)}</p>
        </div>
        <a href="${escapeHtml(section.overviewHref)}" class="shrink-0 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">${escapeHtml(section.overviewLabel)} &rarr;</a>
      </div>

      <ul role="list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        ${section.items.map(item => {
          const searchBlob = `${item.title} ${item.family} ${item.summary} ${item.keywords} ${item.formats.join(" ")}`.toLowerCase();
          return `
        <li
          class="program-card-item"
          data-track="${escapeHtml(section.id)}"
          data-formats="${escapeHtml(item.formats.join("|"))}"
          data-search="${escapeHtml(searchBlob)}"
        >
          <a href="${escapeHtml(item.href)}" class="program-directory-card group flex flex-col justify-between h-full p-5 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2.5">
                <span class="text-xs font-bold text-muted-foreground">${escapeHtml(item.family)}</span>
                <svg aria-hidden="true" class="lucide w-4 h-4 text-muted-foreground/60 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
              <h3 class="text-lg font-black font-display tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">${escapeHtml(item.title)}</h3>
              <p class="text-sm text-muted-foreground mt-2 leading-relaxed">${escapeHtml(item.summary)}</p>
            </div>
            <div class="mt-5 pt-3.5 border-t border-border/70 flex flex-wrap items-center gap-1.5">
              ${item.formats.map(fmt => `<span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-muted text-foreground/80">${escapeHtml(fmt)}</span>`).join("")}
            </div>
          </a>
        </li>`;
        }).join("")}
      </ul>
    </section>
  `).join("\n");

  const bodyHtml = `
    <!-- Hero Banner -->
    <section class="surface-hero relative overflow-hidden border-b border-border/60 py-14 sm:py-20 px-6">
      <div class="max-w-7xl mx-auto relative z-10">
        <nav aria-label="Breadcrumb" class="text-xs sm:text-sm font-medium text-muted-foreground mb-5 flex items-center gap-2">
          <a href="../index.html" class="hover:text-indigo-500 transition-colors">Home</a>
          <span aria-hidden="true">/</span>
          <span class="text-foreground font-bold">Programs</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div class="lg:col-span-8">
            <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-widest font-display mb-4">
              All Programs Directory
            </span>
            <h1 id="main-heading" tabindex="-1" class="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.06] text-foreground">
              Find the Right Program for Your Target&nbsp;Score
            </h1>
            <p class="mt-5 text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Explore all 22 AP courses, Digital SAT &amp; ACT prep, 9 Math, Science &amp; Computing Olympiads, MCAT &amp; DAT prep, and 1-on-1 course tutoring—then choose the way you learn best.
            </p>
          </div>
          <div class="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
            <button type="button" onclick="openConsultationModal()" class="w-full sm:w-auto lg:w-full px-7 py-4 rounded-full bg-foreground text-background font-bold text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2">
              Book a Consultation
              <svg aria-hidden="true" class="lucide w-4 h-4" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </button>
            <a href="#compare-formats" class="w-full sm:w-auto lg:w-full px-7 py-3.5 rounded-full border border-border bg-background/70 hover:bg-muted text-foreground font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2">
              Compare Formats
              <svg aria-hidden="true" class="lucide w-4 h-4" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Search & Filter Controls -->
    <section class="surface-mist py-8 sm:py-10 px-6 border-b border-border/60">
      <div class="max-w-7xl mx-auto">
        <search aria-label="Filter programs by subject, track, or learning format">
          <form id="programs-filter-form" action="./index.html" method="GET" class="rounded-3xl border border-border bg-background/95 p-5 sm:p-6 shadow-lg space-y-5">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div class="lg:col-span-7 flex flex-col gap-1.5">
                <label for="program-search" class="text-xs font-extrabold uppercase tracking-wider text-foreground font-display">Search by Course, Exam, or Topic</label>
                <div class="relative">
                  <svg aria-hidden="true" class="lucide w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input
                    type="search"
                    id="program-search"
                    name="q"
                    placeholder="Try AP Physics C, Calculus BC, Digital SAT, AMC 10, MCAT, Organic Chemistry..."
                    autocorrect="off"
                    autocapitalize="none"
                    spellcheck="false"
                    enterkeyhint="search"
                    class="directory-filter-input w-full rounded-2xl border border-border bg-muted/40 pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              <div class="lg:col-span-5 flex items-center justify-between lg:justify-end gap-3 pt-1">
                <p id="programs-visible-count" class="text-sm font-bold text-muted-foreground" aria-hidden="true">Showing all ${totalCount} programs</p>
                <p id="programs-live-announcer" class="visually-hidden" role="status" aria-live="polite" aria-atomic="true"></p>
                <button type="button" id="programs-reset-btn" hidden class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1">
                  Reset filters
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 pt-2 border-t border-border/70">
              <fieldset class="xl:col-span-7 min-w-0">
                <legend class="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground font-display mb-2">Goal Track</legend>
                <div class="filter-pill-scroller pb-1">
                  ${trackRadios.map((r, i) => `
                  <div>
                    <input type="radio" id="filter-track-${escapeHtml(r.value)}" name="track" value="${escapeHtml(r.value)}" class="filter-radio visually-hidden" ${i === 0 ? "checked" : ""} />
                    <label for="filter-track-${escapeHtml(r.value)}" class="filter-pill-label">${escapeHtml(r.label)}</label>
                  </div>`).join("")}
                </div>
              </fieldset>

              <fieldset class="xl:col-span-5 min-w-0">
                <legend class="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground font-display mb-2">Learning Format</legend>
                <div class="filter-pill-scroller pb-1">
                  ${formatRadios.map((r, i) => `
                  <div>
                    <input type="radio" id="filter-format-${escapeHtml(r.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}" name="format" value="${escapeHtml(r.value)}" class="filter-radio visually-hidden" ${i === 0 ? "checked" : ""} />
                    <label for="filter-format-${escapeHtml(r.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}" class="filter-pill-label">${escapeHtml(r.label)}</label>
                  </div>`).join("")}
                </div>
              </fieldset>
            </div>
          </form>
        </search>
      </div>
    </section>

    <!-- Grouped Program Cards -->
    <div class="py-14 sm:py-20 px-6">
      <div class="max-w-7xl mx-auto space-y-16" id="programs-directory-results">
        ${sectionsHtml}

        <div id="programs-empty-state" hidden class="rounded-3xl border border-border bg-muted/30 p-10 sm:p-14 text-center max-w-2xl mx-auto">
          <h2 class="text-2xl font-black font-display text-foreground">No matching programs found</h2>
          <p class="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
            Don’t see your exact course or exam listed? Our 1-on-1 mentors also support custom school, Honors, IB, and university STEM syllabi.
          </p>
          <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button type="button" id="programs-empty-reset" class="w-full sm:w-auto px-6 py-3 rounded-full border border-border bg-background hover:bg-muted font-bold text-sm transition-colors">
              Show All ${totalCount} Programs
            </button>
            <button type="button" onclick="openConsultationModal()" class="w-full sm:w-auto px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors">
              Ask About Custom 1-on-1 Tutoring
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Side-by-Side Format Comparison -->
    <section id="compare-formats" class="surface-indigo section-space-major px-6 border-t border-border/60 scroll-mt-20">
      <div class="max-w-7xl mx-auto">
        <div class="max-w-3xl mb-10 sm:mb-12">
          <span class="inline-block text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-display mb-2">Three Ways to Learn</span>
          <h2 class="text-3xl sm:text-4xl font-black font-display tracking-tight text-foreground">Choose How Your Student Learns Best</h2>
          <p class="text-base sm:text-lg text-muted-foreground mt-3 leading-relaxed">
            Every exam pathway is built on the same first-principles curriculum and exam-calibrated question banks—offered in three flexible formats.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div class="rounded-3xl border border-border bg-background/95 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-black font-display text-foreground">1-on-1 Private Mentorship</h3>
              <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
                Matched deliberately with an award-winning educator, researcher, or doctor around your exact starting point, syllabus, and schedule.
              </p>
              <ul class="mt-5 space-y-2.5 text-sm text-foreground/90">
                <li class="flex items-start gap-2.5"><svg aria-hidden="true" class="lucide w-4 h-4 text-emerald-500 shrink-0 mt-1" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Custom diagnostic roadmap &amp; flexible weekly scheduling</span></li>
                <li class="flex items-start gap-2.5"><svg aria-hidden="true" class="lucide w-4 h-4 text-emerald-500 shrink-0 mt-1" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Between-session Q&amp;A support &amp; parent progress updates</span></li>
                <li class="flex items-start gap-2.5"><svg aria-hidden="true" class="lucide w-4 h-4 text-emerald-500 shrink-0 mt-1" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Available for every exam and school/university course</span></li>
              </ul>
            </div>
            <div class="mt-7 pt-5 border-t border-border/70 flex flex-col gap-2.5">
              <button type="button" onclick="openConsultationModal()" class="w-full py-3 px-5 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity">Book a Consultation</button>
              <a href="./1-on-1-mentorship.html" class="text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline py-1">How 1-on-1 Mentorship Works &rarr;</a>
            </div>
          </div>

          <div class="rounded-3xl border border-border bg-background/95 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-black font-display text-foreground">Live Group Cohorts</h3>
              <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
                Small, interactive weekly classes with motivated peers preparing for the exact same AP, SAT, ACT, Olympiad, or MCAT exam date.
              </p>
              <ul class="mt-5 space-y-2.5 text-sm text-foreground/90">
                <li class="flex items-start gap-2.5"><svg aria-hidden="true" class="lucide w-4 h-4 text-emerald-500 shrink-0 mt-1" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Structured syllabus with live Q&amp;A and session replays</span></li>
                <li class="flex items-start gap-2.5"><svg aria-hidden="true" class="lucide w-4 h-4 text-emerald-500 shrink-0 mt-1" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Weekly graded problem sets &amp; timed mock checkpoints</span></li>
                <li class="flex items-start gap-2.5"><svg aria-hidden="true" class="lucide w-4 h-4 text-emerald-500 shrink-0 mt-1" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Seasonal fall, winter, and spring exam intensives</span></li>
              </ul>
            </div>
            <div class="mt-7 pt-5 border-t border-border/70 flex flex-col gap-2.5">
              <a href="./live-cohorts.html" class="w-full py-3 px-5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm text-center transition-colors">Explore Live Cohorts</a>
              <button type="button" onclick="openConsultationModal()" class="text-center text-xs font-bold text-muted-foreground hover:text-foreground transition-colors py-1">Ask About Cohort Placement &rarr;</button>
            </div>
          </div>

          <div class="rounded-3xl border border-border bg-background/95 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-black font-display text-foreground">On-Demand Practice Courses</h3>
              <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
                24/7 self-paced access to concise concept lessons, unit-by-unit exam-level problem sets, and full-length mock tests.
              </p>
              <ul class="mt-5 space-y-2.5 text-sm text-foreground/90">
                <li class="flex items-start gap-2.5"><svg aria-hidden="true" class="lucide w-4 h-4 text-emerald-500 shrink-0 mt-1" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Application-heavy MCQs, FRQs &amp; step-by-step solutions</span></li>
                <li class="flex items-start gap-2.5"><svg aria-hidden="true" class="lucide w-4 h-4 text-emerald-500 shrink-0 mt-1" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Topic mastery analytics &amp; score projections</span></li>
                <li class="flex items-start gap-2.5"><svg aria-hidden="true" class="lucide w-4 h-4 text-emerald-500 shrink-0 mt-1" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>Start anytime—ideal solo or paired with tutoring</span></li>
              </ul>
            </div>
            <div class="mt-7 pt-5 border-t border-border/70 flex flex-col gap-2.5">
              <a href="./practice-courses.html" class="w-full py-3 px-5 rounded-full border border-border bg-muted/60 hover:bg-muted text-foreground font-bold text-sm text-center transition-colors">Browse Practice Courses</a>
              <a href="../pricing.html" class="text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline py-1">View Plans &amp; Tuition &rarr;</a>
            </div>
          </div>
        </div>

        <!-- Accessible Comparison Table -->
        <div class="overflow-x-auto rounded-3xl border border-border bg-background/95 shadow-sm">
          <table class="w-full text-left border-collapse text-sm">
            <caption class="sr-only">Comparison of 1-on-1 Mentorship, Live Group Cohorts, and On-Demand Practice Courses</caption>
            <thead>
              <tr class="border-b border-border bg-muted/40">
                <th scope="col" class="py-4 px-5 font-black font-display text-foreground">Feature</th>
                <th scope="col" class="py-4 px-5 font-black font-display text-foreground">1-on-1 Mentorship</th>
                <th scope="col" class="py-4 px-5 font-black font-display text-foreground">Live Group Cohort</th>
                <th scope="col" class="py-4 px-5 font-black font-display text-foreground">Practice Course</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/70">
              <tr>
                <th scope="row" class="py-3.5 px-5 font-bold text-foreground">Pacing &amp; Schedule</th>
                <td class="py-3.5 px-5 text-muted-foreground">100% custom to your calendar</td>
                <td class="py-3.5 px-5 text-muted-foreground">Fixed weekly class + recordings</td>
                <td class="py-3.5 px-5 text-muted-foreground">24/7 self-paced access</td>
              </tr>
              <tr>
                <th scope="row" class="py-3.5 px-5 font-bold text-foreground">Practice &amp; Mock Exams</th>
                <td class="py-3.5 px-5 text-muted-foreground">Included + reviewed 1-on-1</td>
                <td class="py-3.5 px-5 text-muted-foreground">Included + cohort review clinics</td>
                <td class="py-3.5 px-5 text-muted-foreground">Full unit banks &amp; mock exams</td>
              </tr>
              <tr>
                <th scope="row" class="py-3.5 px-5 font-bold text-foreground">School Syllabus Alignment</th>
                <td class="py-3.5 px-5 text-muted-foreground">Matched to exact teacher/professor</td>
                <td class="py-3.5 px-5 text-muted-foreground">Aligned to official exam blueprint</td>
                <td class="py-3.5 px-5 text-muted-foreground">Aligned to official exam blueprint</td>
              </tr>
              <tr>
                <th scope="row" class="py-3.5 px-5 font-bold text-foreground">How to Get Started</th>
                <td class="py-3.5 px-5 text-muted-foreground">Academic Consultation</td>
                <td class="py-3.5 px-5 text-muted-foreground">Cohort Enrollment / Placement</td>
                <td class="py-3.5 px-5 text-muted-foreground">Self-Serve Account</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="section-space-major bg-zinc-950 text-white px-6 relative overflow-hidden border-t border-white/10">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[44rem] h-[22rem] bg-indigo-500/20 rounded-full blur-[110px] pointer-events-none"></div>
      <div class="max-w-3xl mx-auto text-center relative z-10">
        <h2 class="text-3xl sm:text-5xl font-black font-display tracking-tight leading-[1.1]">
          Not sure which track or format fits best?
        </h2>
        <p class="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Share your student’s current classes, target scores, and exam timeline—our team will map out the clearest, highest-return plan.
        </p>
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button type="button" onclick="openConsultationModal()" class="w-full sm:w-auto px-9 py-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-base transition-colors shadow-lg">
            Book a Consultation
          </button>
          <a href="../pricing.html" class="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-zinc-100 font-bold text-base transition-colors">
            View Plans &amp; Tuition
          </a>
        </div>
      </div>
    </section>
  `;

  const extraBodyScripts = `
  <script>
    (function () {
      const form = document.getElementById("programs-filter-form");
      const searchInput = document.getElementById("program-search");
      const visibleCountEl = document.getElementById("programs-visible-count");
      const liveAnnouncerEl = document.getElementById("programs-live-announcer");
      const resetBtn = document.getElementById("programs-reset-btn");
      const emptyState = document.getElementById("programs-empty-state");
      const emptyResetBtn = document.getElementById("programs-empty-reset");
      const cards = [...document.querySelectorAll(".program-card-item")];
      const sections = [...document.querySelectorAll("[data-directory-section]")];
      const totalPrograms = cards.length;
      let announceTimer = 0;

      function applyFilters({ announce = false, debounceAnnounce = false } = {}) {
        const query = (searchInput?.value || "").trim().toLowerCase();
        const selectedTrack = form?.elements.namedItem("track")?.value || "all";
        const selectedFormat = form?.elements.namedItem("format")?.value || "all";

        let matchedCount = 0;
        cards.forEach(card => {
          const trackMatch = selectedTrack === "all" || card.dataset.track === selectedTrack;
          const formats = (card.dataset.formats || "").split("|");
          const formatMatch = selectedFormat === "all" || formats.includes(selectedFormat);
          const queryMatch = !query || (card.dataset.search || "").includes(query);
          const visible = trackMatch && formatMatch && queryMatch;
          card.hidden = !visible;
          if (visible) matchedCount += 1;
        });

        sections.forEach(sec => {
          const hasVisibleCard = [...sec.querySelectorAll(".program-card-item")].some(item => !item.hidden);
          sec.hidden = !hasVisibleCard;
        });

        if (emptyState) emptyState.hidden = matchedCount > 0;
        const isFiltered = Boolean(query) || selectedTrack !== "all" || selectedFormat !== "all";
        if (resetBtn) resetBtn.hidden = !isFiltered;

        const summaryText = isFiltered
          ? \`Showing \${matchedCount} of \${totalPrograms} programs\`
          : \`Showing all \${totalPrograms} programs\`;
        if (visibleCountEl) visibleCountEl.textContent = summaryText;

        if (announce && liveAnnouncerEl) {
          clearTimeout(announceTimer);
          if (debounceAnnounce) {
            announceTimer = window.setTimeout(() => {
              liveAnnouncerEl.textContent = summaryText;
            }, 350);
          } else {
            liveAnnouncerEl.textContent = summaryText;
          }
        }
      }

      form?.addEventListener("submit", event => {
        event.preventDefault();
        applyFilters({ announce: true });
      });

      searchInput?.addEventListener("input", () => {
        applyFilters({ announce: true, debounceAnnounce: true });
      });

      form?.addEventListener("change", event => {
        if (event.target !== searchInput) {
          applyFilters({ announce: true, debounceAnnounce: false });
        }
      });

      function resetAllFilters() {
        form?.reset();
        if (searchInput) searchInput.value = "";
        applyFilters({ announce: true });
        searchInput?.focus();
      }

      resetBtn?.addEventListener("click", resetAllFilters);
      emptyResetBtn?.addEventListener("click", resetAllFilters);

      const urlParams = new URLSearchParams(window.location.search);
      const initialQ = urlParams.get("q");
      const initialTrack = urlParams.get("track");
      const initialFormat = urlParams.get("format");
      if (initialQ && searchInput) searchInput.value = initialQ;
      if (initialTrack) {
        const trackRadio = form?.querySelector(\`input[name="track"][value="\${CSS.escape(initialTrack)}"]\`);
        if (trackRadio) trackRadio.checked = true;
      }
      if (initialFormat) {
        const fmtRadio = form?.querySelector(\`input[name="format"][value="\${CSS.escape(initialFormat)}"]\`);
        if (fmtRadio) fmtRadio.checked = true;
      }
      applyFilters({ announce: false });
    })();
  </script>`;

  const allItems = DIRECTORY_SECTIONS.flatMap(sec => sec.items);
  const directoryUrl = toCanonicalUrl("programs/index.html");
  const breadcrumbGraphNode = buildBreadcrumbSchema("programs/index.html", ["Programs"]);
  const directorySchema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbGraphNode,
      {
        "@type": "CollectionPage",
        "@id": `${directoryUrl}#collection`,
        name: "All Programs Directory — Master Your Courses",
        url: directoryUrl,
        inLanguage: "en-US",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORG_ID },
        breadcrumb: { "@id": breadcrumbGraphNode["@id"] },
        description: "Explore all 22 AP courses, Digital SAT & ACT prep, 9 Math, Science & Computing Olympiads, MCAT & DAT prep, and 1-on-1 course tutoring.",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: allItems.length,
          itemListElement: allItems.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: item.title,
            url: toCanonicalUrl(`programs/${item.href.replace(/^\.\//, "")}`)
          }))
        }
      }
    ]
  };

  return renderSharedShell({
    prefix: "../",
    title: "All Programs — AP, Digital SAT, ACT, Olympiads, MCAT, DAT & Tutoring",
    description: "Explore all 22 AP courses, Digital SAT & ACT prep, 9 Math, Science & Computing Olympiads, MCAT & DAT prep, and 1-on-1 course tutoring at Master Your Courses.",
    canonicalPath: "programs/index.html",
    jsonLd: directorySchema,
    extraHeadCss,
    bodyHtml,
    extraBodyScripts
  });
}
