import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

const FORMATS_EXAM = ["1-on-1 Mentorship", "Live Group Cohort", "On-Demand Practice Course"];
const FORMATS_TUTORING = ["1-on-1 Mentorship"];

export const SITEMAP_PAGES = [
  // Hub & Track Overviews
  {
    path: "programs/index.html",
    group: "Programs Hub",
    breadcrumb: ["Programs"],
    title: "All Programs Directory",
    subtitle: "Explore every AP exam, Digital SAT track, Math/Science Olympiad, and 1-on-1 course tutoring pathway.",
    formats: FORMATS_EXAM,
    planned: [
      "Interactive filter by grade level, subject, exam date, and learning format",
      "Side-by-side comparison of 1-on-1 Mentorship, Live Group Cohorts, and On-Demand Practice Courses",
      "Direct links to all 22 AP courses, Digital SAT, 9 Olympiad tracks, and Course Tutoring"
    ]
  },
  {
    path: "programs/ap-prep.html",
    group: "Goal Track Hubs",
    breadcrumb: ["Programs", "AP Prep"],
    title: "AP Prep Overview",
    subtitle: "First-principles preparation across 22 high-demand AP courses in Sciences, Math, Computer Science, Economics, English, and History.",
    formats: FORMATS_EXAM,
    planned: [
      "Complete 22-course AP directory grouped by subject family",
      "How 1-on-1 Mentorship, Live Group Cohorts, and On-Demand Practice Courses work for AP 5s",
      "Fall/Winter full-year mastery vs. Spring AP Exam review intensives"
    ]
  },
  {
    path: "programs/sat-prep.html",
    group: "Goal Track Hubs",
    breadcrumb: ["Programs", "Digital SAT Prep"],
    title: "Digital SAT Prep Overview",
    subtitle: "Diagnostic-driven preparation for both Reading & Writing and Math—built to push ambitious students past 1500+.",
    formats: FORMATS_EXAM,
    planned: [
      "Adaptive Module 1 & Module 2 Digital SAT strategy breakdown",
      "Comparison of 1-on-1 Mentorship, Live Group Cohort, and On-Demand Practice Course",
      "Verified 1500+ student score progressions and diagnostic roadmap"
    ]
  },
  {
    path: "programs/competition-prep.html",
    group: "Goal Track Hubs",
    breadcrumb: ["Programs", "Competition Prep"],
    title: "Competition & Olympiad Prep Overview",
    subtitle: "Deep proof-based and multi-step problem-solving for AMC, AIME, USAMO, Waterloo/CEMC, F=ma, USAPhO, USNCO, USABO, and USACO.",
    formats: FORMATS_EXAM,
    planned: [
      "Complete competition calendar & qualification cutoffs (AMC -> AIME -> USAMO, F=ma -> USAPhO, USACO divisions)",
      "1-on-1 Olympiad mentorship, live competition cohorts, and curated problem-set courses",
      "Diagnostic placement by prior contest scores"
    ]
  },
  {
    path: "programs/course-tutoring.html",
    group: "Goal Track Hubs",
    breadcrumb: ["Programs", "Course Tutoring"],
    title: "1-on-1 Course Tutoring Overview",
    subtitle: "Private mentorship matched directly to your student’s exact high school, Honors, AP, or university syllabus.",
    formats: FORMATS_TUTORING,
    planned: [
      "How syllabus-matched 1-on-1 mentorship turns Cs and Bs into confident As",
      "High school Honors/AP vs. university & pre-med STEM coursework tracks",
      "Between-session Q&A support and weekly parent progress visibility"
    ]
  },

  // Learning Format Hubs (3)
  {
    path: "programs/1-on-1-mentorship.html",
    group: "Learning Format Hubs",
    breadcrumb: ["Programs", "1-on-1 Mentorship"],
    title: "1-on-1 Private Mentorship",
    subtitle: "Bespoke diagnostic pacing, custom problem sets, and deliberate mentor matching across APs, the Digital SAT, Olympiads, and university STEM.",
    formats: ["1-on-1 Mentorship"],
    planned: [
      "How 1-on-1 diagnostic mapping, custom weekly pacing, and between-session Q&A work",
      "Mentor matching criteria & rematch guarantee",
      "1-on-1 Academic Consultation to map out your student’s custom roadmap"
    ]
  },
  {
    path: "programs/live-cohorts.html",
    group: "Learning Format Hubs",
    breadcrumb: ["Programs", "Live Group Cohorts"],
    title: "Live Group Cohorts & Exam Bootcamps",
    subtitle: "Small, interactive weekly cohorts led by top instructors—combining structured pacing, peer momentum, and proctored mock exams.",
    formats: ["Live Group Cohort"],
    planned: [
      "Upcoming Fall, Winter & Spring AP, Digital SAT, and AMC/F=ma cohort schedules",
      "Live class format, seat caps, session recordings & weekly homework review",
      "Cohort enrollment & placement check"
    ]
  },
  {
    path: "programs/practice-courses.html",
    group: "Learning Format Hubs",
    breadcrumb: ["Programs", "On-Demand Practice Courses"],
    title: "On-Demand Practice Courses",
    subtitle: "Self-serve, exam-calibrated problem banks, concise concept breakdowns, and full-length mock tests—available 24/7 with instant enrollment.",
    formats: ["On-Demand Practice Course"],
    planned: [
      "Direct self-serve catalog across AP courses, Digital SAT, and AMC/Olympiad problem sets",
      "Inside preview of unit checkpoints, step-by-step explanations & score analytics",
      "Instant self-serve checkout (no consultation required)"
    ]
  },

  // AP Sciences (7)
  {
    path: "programs/ap-biology.html",
    group: "AP Prep — Sciences",
    breadcrumb: ["Programs", "AP Prep", "AP Biology"],
    title: "AP Biology Prep",
    subtitle: "Master cellular energetics, genetics, gene expression, ecology, and data-heavy AP Bio FRQs without rote memorization.",
    formats: FORMATS_EXAM,
    planned: ["Unit 1–8 AP Biology concept roadmap", "Experimental design & FRQ rubric training", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-chemistry.html",
    group: "AP Prep — Sciences",
    breadcrumb: ["Programs", "AP Prep", "AP Chemistry"],
    title: "AP Chemistry Prep",
    subtitle: "Build deep chemical intuition across thermodynamics, kinetics, equilibrium, acids/bases, and electrochemistry.",
    formats: FORMATS_EXAM,
    planned: ["Unit 1–9 AP Chemistry mastery breakdown", "Multi-part FRQ & lab-analysis drills", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-physics-1.html",
    group: "AP Prep — Sciences",
    breadcrumb: ["Programs", "AP Prep", "AP Physics 1"],
    title: "AP Physics 1 Prep",
    subtitle: "Conquer algebra-based mechanics, rotational dynamics, energy, momentum, oscillations, and fluids from first principles.",
    formats: FORMATS_EXAM,
    planned: ["Conceptual & qualitative-quantitative translation (QQT) FRQ training", "Unit-by-unit problem sets calibrated to College Board rigor", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-physics-2.html",
    group: "AP Prep — Sciences",
    breadcrumb: ["Programs", "AP Prep", "AP Physics 2"],
    title: "AP Physics 2 Prep",
    subtitle: "Master thermodynamics, electric circuits, electromagnetism, optics, waves, and modern physics with total clarity.",
    formats: FORMATS_EXAM,
    planned: ["Complete AP Physics 2 curriculum & exam checkpoints", "Field/circuit modeling & FRQ reasoning practice", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-physics-c-mechanics.html",
    group: "AP Prep — Sciences",
    breadcrumb: ["Programs", "AP Prep", "AP Physics C: Mechanics"],
    title: "AP Physics C: Mechanics Prep",
    subtitle: "Calculus-based kinematics, Newton’s laws, differential equations of motion, rotation, and gravitation engineered for a 5.",
    formats: FORMATS_EXAM,
    planned: ["Calculus-integrated physics problem-solving framework", "Timed AP Physics C derivation & experimental FRQs", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-physics-c-em.html",
    group: "AP Prep — Sciences",
    breadcrumb: ["Programs", "AP Prep", "AP Physics C: E&M"],
    title: "AP Physics C: Electricity & Magnetism Prep",
    subtitle: "Turn Gauss’s Law, electric potential, RC/RL circuits, magnetic induction, and Maxwell’s equations into strengths.",
    formats: FORMATS_EXAM,
    planned: ["3D symmetry, flux integrals & differential circuit derivations", "Exam-level E&M FRQ & MCQ simulations", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-environmental-science.html",
    group: "AP Prep — Sciences",
    breadcrumb: ["Programs", "AP Prep", "AP Environmental Science"],
    title: "AP Environmental Science (APES) Prep",
    subtitle: "Connect ecosystems, earth systems, energy math, pollution models, and solution-design FRQs for a confident 5.",
    formats: FORMATS_EXAM,
    planned: ["Unit 1–9 APES synthesis & quantitative dimensional-analysis drills", "Environmental solution & data FRQ practice", "1-on-1, Live Cohort & On-Demand Practice options"]
  },

  // AP Math & Computer Science (6)
  {
    path: "programs/ap-precalculus.html",
    group: "AP Prep — Math & Computer Science",
    breadcrumb: ["Programs", "AP Prep", "AP Precalculus"],
    title: "AP Precalculus Prep",
    subtitle: "Build rock-solid function modeling across polynomial, rational, exponential, logarithmic, trigonometric, and polar functions.",
    formats: FORMATS_EXAM,
    planned: ["Graphing calculator & non-calculator exam fluency", "Foundation for AP Calculus BC & 790+ SAT Math", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-calculus-ab.html",
    group: "AP Prep — Math & Computer Science",
    breadcrumb: ["Programs", "AP Prep", "AP Calculus AB"],
    title: "AP Calculus AB Prep",
    subtitle: "Understand limits, derivatives, optimization, accumulation integrals, and differential equations visually and analytically.",
    formats: FORMATS_EXAM,
    planned: ["Calculator & non-calculator AP Calculus AB FRQ mastery", "Rate-in/rate-out, particle motion & area/volume drills", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-calculus-bc.html",
    group: "AP Prep — Math & Computer Science",
    breadcrumb: ["Programs", "AP Prep", "AP Calculus BC"],
    title: "AP Calculus BC Prep",
    subtitle: "Excel in integration techniques, parametric/polar/vector calculus, Euler’s method, and Taylor/Maclaurin series.",
    formats: FORMATS_EXAM,
    planned: ["Complete AB + BC topic mastery with series convergence fluency", "Timed College Board FRQ & MCQ mock checkpoints", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-statistics.html",
    group: "AP Prep — Math & Computer Science",
    breadcrumb: ["Programs", "AP Prep", "AP Statistics"],
    title: "AP Statistics Prep",
    subtitle: "Master probability distributions, experimental design, confidence intervals, hypothesis tests, and Investigative Task FRQ6.",
    formats: FORMATS_EXAM,
    planned: ["Exact AP Statistics inference templates & rubric communication", "Investigative Task (Question 6) strategy & scoring", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-computer-science-a.html",
    group: "AP Prep — Math & Computer Science",
    breadcrumb: ["Programs", "AP Prep", "AP Computer Science A"],
    title: "AP Computer Science A (Java) Prep",
    subtitle: "Write clean, bug-free Java across object-oriented design, arrays, ArrayLists, 2D arrays, inheritance, and recursion.",
    formats: FORMATS_EXAM,
    planned: ["Hands-on Java FRQ coding & code-tracing drills", "Class design, 2D array & ArrayList exam patterns", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-computer-science-principles.html",
    group: "AP Prep — Math & Computer Science",
    breadcrumb: ["Programs", "AP Prep", "AP Computer Science Principles"],
    title: "AP Computer Science Principles (CSP) Prep",
    subtitle: "Ace algorithmic logic, pseudocode tracing, networks, data systems, and your Create Performance Task written responses.",
    formats: FORMATS_EXAM,
    planned: ["Create Performance Task architecture & written-response prep", "Pseudocode, binary/logic & network MCQ drills", "1-on-1, Live Cohort & On-Demand Practice options"]
  },

  // AP Economics, English & History/Social Sciences (9)
  {
    path: "programs/ap-microeconomics.html",
    group: "AP Prep — Economics, English & Humanities",
    breadcrumb: ["Programs", "AP Prep", "AP Microeconomics"],
    title: "AP Microeconomics Prep",
    subtitle: "Master supply & demand elasticity, cost curves, perfect competition, monopoly, game theory, and factor markets.",
    formats: FORMATS_EXAM,
    planned: ["Precision graph-drawing drills for every market structure", "Timed short & long FRQ practice", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-macroeconomics.html",
    group: "AP Prep — Economics, English & Humanities",
    breadcrumb: ["Programs", "AP Prep", "AP Macroeconomics"],
    title: "AP Macroeconomics Prep",
    subtitle: "Connect AD-AS, fiscal & monetary policy, reserve banking, Phillips curves, and foreign exchange markets with precision.",
    formats: FORMATS_EXAM,
    planned: ["Multi-graph macroeconomic shock & policy tracing", "Monetary banking & FX FRQ drills", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-psychology.html",
    group: "AP Prep — Economics, English & Humanities",
    breadcrumb: ["Programs", "AP Prep", "AP Psychology"],
    title: "AP Psychology Prep",
    subtitle: "Master biological bases of behavior, cognition, development, clinical psychology, and the updated research-design FRQs.",
    formats: FORMATS_EXAM,
    planned: ["Article Analysis Question (AAQ) & Evidence-Based Question (EBQ) drills", "Active-recall concept application vs. passive flashcards", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-english-language.html",
    group: "AP Prep — Economics, English & Humanities",
    breadcrumb: ["Programs", "AP Prep", "AP English Language"],
    title: "AP English Language & Composition Prep",
    subtitle: "Write sophisticated Synthesis, Rhetorical Analysis, and Argument essays while sharpening timed reading comprehension.",
    formats: FORMATS_EXAM,
    planned: ["6-point rubric mastery across Synthesis, Rhetorical Analysis & Argument", "Rhetorical MCQ & composition revision drills", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-english-literature.html",
    group: "AP Prep — Economics, English & Humanities",
    breadcrumb: ["Programs", "AP Prep", "AP English Literature"],
    title: "AP English Literature & Composition Prep",
    subtitle: "Analyze complex poetry, prose fiction, and literary argument under timed exam pressure with clear analytical structure.",
    formats: FORMATS_EXAM,
    planned: ["Poetry, Prose Fiction & Literary Argument FRQ workshops", "Close-reading MCQ precision drills", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-us-history.html",
    group: "AP Prep — Economics, English & Humanities",
    breadcrumb: ["Programs", "AP Prep", "AP U.S. History"],
    title: "AP U.S. History (APUSH) Prep",
    subtitle: "Connect Periods 1–9 through causal historical reasoning and master Stimulus MCQs, SAQs, DBQs, and LEQs.",
    formats: FORMATS_EXAM,
    planned: ["7-point DBQ & 6-point LEQ thesis, sourcing & evidence frameworks", "Stimulus-based MCQ & SAQ timed drills", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-world-history.html",
    group: "AP Prep — Economics, English & Humanities",
    breadcrumb: ["Programs", "AP Prep", "AP World History"],
    title: "AP World History: Modern Prep",
    subtitle: "Synthesize global networks, empires, revolutions, and 20th-century shifts from 1200 CE to the present.",
    formats: FORMATS_EXAM,
    planned: ["Cross-regional comparison, causation & CCOT essay frameworks", "DBQ, LEQ & SAQ rubric-scored practice", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-us-government.html",
    group: "AP Prep — Economics, English & Humanities",
    breadcrumb: ["Programs", "AP Prep", "AP U.S. Government"],
    title: "AP U.S. Government & Politics Prep",
    subtitle: "Command foundational documents, landmark Supreme Court cases, quantitative data analysis, and Argument Essays.",
    formats: FORMATS_EXAM,
    planned: ["15 required SCOTUS cases & 9 foundational documents mastery", "SCOTUS comparison & Argument Essay FRQ drills", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/ap-human-geography.html",
    group: "AP Prep — Economics, English & Humanities",
    breadcrumb: ["Programs", "AP Prep", "AP Human Geography"],
    title: "AP Human Geography Prep",
    subtitle: "Build top-tier AP exam habits across population, culture, political geography, agriculture, and urban spatial models.",
    formats: FORMATS_EXAM,
    planned: ["Spatial models, map/data stimulus analysis & 7-point FRQ training", "Ideal 9th/10th-grade AP exam readiness system", "1-on-1, Live Cohort & On-Demand Practice options"]
  },

  // Digital SAT Formats (3)
  {
    path: "programs/sat-1-on-1.html",
    group: "SAT & ACT Prep",
    breadcrumb: ["Programs", "Digital SAT Prep", "1-on-1 Mentorship"],
    title: "1-on-1 Digital SAT Mentorship",
    subtitle: "Custom diagnostic roadmap, private Reading & Writing + Math coaching, and error-log accountability built for 1500–1580+.",
    formats: ["1-on-1 Mentorship"],
    planned: ["Full baseline diagnostic & custom test-date countdown plan", "Desmos fluency, hard Module 2 math & craft/structure verbal mastery", "Weekly proctored mock analytics"]
  },
  {
    path: "programs/sat-cohort.html",
    group: "SAT & ACT Prep",
    breadcrumb: ["Programs", "Digital SAT Prep", "Live Group Cohort"],
    title: "Live Digital SAT Group Cohort",
    subtitle: "Structured weekly small-group instruction covering high-yield Digital SAT Reading & Writing and Math strategies.",
    formats: ["Live Group Cohort"],
    planned: ["Cohort syllabus & upcoming test-date schedules", "Live interactive problem-solving + recorded replays", "Full-length adaptive practice tests & review clinics"]
  },
  {
    path: "programs/sat-practice-course.html",
    group: "SAT & ACT Prep",
    breadcrumb: ["Programs", "Digital SAT Prep", "On-Demand Practice Course"],
    title: "On-Demand Digital SAT Practice Course",
    subtitle: "24/7 access to concept breakdowns, skill-tagged verbal & math drills, and realistic adaptive mock exams.",
    formats: ["On-Demand Practice Course"],
    planned: ["Topic-by-topic Reading & Writing and Math drill banks", "Step-by-step explanations for every question", "Real-time score projection dashboard"]
  },
  {
    path: "programs/act-prep.html",
    group: "SAT & ACT Prep",
    breadcrumb: ["Programs", "ACT Prep"],
    title: "ACT Prep — English, Math, Reading & Science",
    subtitle: "Structured preparation for the updated ACT through 1-on-1 mentorship, live group cohorts, and self-paced practice sets.",
    formats: FORMATS_EXAM,
    planned: [
      "Section-by-section mastery across ACT English, Math, Reading, and Science reasoning",
      "Pacing and timing strategy tailored to the updated ACT format",
      "1-on-1 Mentorship, Live Group Cohort & On-Demand Practice options"
    ]
  },

  // Competition & Olympiad Prep (9)
  {
    path: "programs/amc-8-mathcounts.html",
    group: "Competition Prep — Math",
    breadcrumb: ["Programs", "Competition Prep", "AMC 8 & MATHCOUNTS"],
    title: "AMC 8 & MATHCOUNTS Prep",
    subtitle: "Build creative counting, number theory, geometry, and algebraic intuition for middle school competition standouts.",
    formats: FORMATS_EXAM,
    planned: ["Honor Roll & Distinguished Honor Roll (Top 1%) training", "MATHCOUNTS Sprint, Target & Team round speed/accuracy", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/amc-10.html",
    group: "Competition Prep — Math",
    breadcrumb: ["Programs", "Competition Prep", "AMC 10"],
    title: "AMC 10 Prep",
    subtitle: "Master non-routine algebra, Euclidean geometry, combinatorics, and number theory to qualify for the AIME in 9th or 10th grade.",
    formats: FORMATS_EXAM,
    planned: ["Problems 1–15 accuracy lock + Problems 16–25 AIME-cutoff breakthroughs", "AMC 10A & 10B timed mock simulation cycles", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/amc-12.html",
    group: "Competition Prep — Math",
    breadcrumb: ["Programs", "Competition Prep", "AMC 12"],
    title: "AMC 12 Prep",
    subtitle: "Command complex numbers, trigonometry, logarithms, 3D geometry, and advanced combinatorics for AIME & Honor Roll Distinction.",
    formats: FORMATS_EXAM,
    planned: ["AMC 12-exclusive toolkit (complex plane, trig identities, polynomials)", "Pacing & expected-value decision strategy for 100+ / AIME cutoffs", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/aime-usamo.html",
    group: "Competition Prep — Math",
    breadcrumb: ["Programs", "Competition Prep", "AIME & USAMO"],
    title: "AIME & USA(J)MO / USAMO Prep",
    subtitle: "Bridge from multi-step AIME integer problems (000–999) to rigorous Olympiad proof writing for USAJMO and USAMO.",
    formats: FORMATS_EXAM,
    planned: ["3-hour AIME endurance & mid-to-late problem (Q6–Q15) strategy", "Olympiad proof structure, invariants, inequalities & projective geometry", "1-on-1 mentorship & advanced Olympiad seminars"]
  },
  {
    path: "programs/waterloo-cemc-contests.html",
    group: "Competition Prep — Math",
    breadcrumb: ["Programs", "Competition Prep", "Waterloo / CEMC Contests"],
    title: "Waterloo / CEMC Math Contests Prep",
    subtitle: "Targeted preparation for University of Waterloo’s Gauss, Pascal, Cayley, Fermat, Fryer, Galois, Hypatia, and Euclid contests.",
    formats: FORMATS_EXAM,
    planned: ["Euclid full-solution written proof grading & Honour Roll prep", "Pascal, Cayley & Fermat Part C multi-step problem mastery", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/fma-usapho.html",
    group: "Competition Prep — Science & CS Olympiads",
    breadcrumb: ["Programs", "Competition Prep", "F=ma & USAPhO"],
    title: "F=ma & USAPhO Physics Olympiad Prep",
    subtitle: "Advance from tricky F=ma mechanics problems to calculus-based USAPhO Olympiad derivations across all physics domains.",
    formats: FORMATS_EXAM,
    planned: ["75-minute F=ma speed, dimensional intuition & conserved-quantity tricks", "USAPhO long-form mechanics, E&M, thermodynamics & relativity derivations", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/usnco-chemistry-olympiad.html",
    group: "Competition Prep — Science & CS Olympiads",
    breadcrumb: ["Programs", "Competition Prep", "USNCO"],
    title: "USNCO Chemistry Olympiad Prep",
    subtitle: "Excel on USNCO Local and National exams across physical, inorganic, organic, analytical, and laboratory chemistry.",
    formats: FORMATS_EXAM,
    planned: ["Local Exam MCQ mastery & National Part I / Part II FRQ problem sets", "Organic synthesis, coordination chemistry & thermodynamics deep dives", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/usabo-biology-olympiad.html",
    group: "Competition Prep — Science & CS Olympiads",
    breadcrumb: ["Programs", "Competition Prep", "USABO"],
    title: "USABO Biology Olympiad Prep",
    subtitle: "Go beyond Campbell Biology into university-level physiology, biochemistry, genetics, plant biology, and biosystematics.",
    formats: FORMATS_EXAM,
    planned: ["USABO Open Exam -> Semifinalist structured reading & problem roadmap", "Experimental figure interpretation & multi-select question drills", "1-on-1, Live Cohort & On-Demand Practice options"]
  },
  {
    path: "programs/usaco-computing-olympiad.html",
    group: "Competition Prep — Science & CS Olympiads",
    breadcrumb: ["Programs", "Competition Prep", "USACO"],
    title: "USACO Computing Olympiad Prep",
    subtitle: "Promote cleanly from Bronze to Silver, Gold, and Platinum with algorithmic problem-solving in C++, Java, or Python.",
    formats: FORMATS_EXAM,
    planned: ["Division-specific roadmaps: Greedy/Simulation, Prefix Sums/DFS, DP, Graphs & Trees", "4-hour contest debugging & time-complexity intuition", "1-on-1, Live Cohort & On-Demand Practice options"]
  },

  // MCAT & DAT Pre-Health Prep (6)
  {
    path: "programs/mcat-dat-prep.html",
    group: "MCAT & DAT Prep",
    breadcrumb: ["Programs", "MCAT & DAT Prep"],
    title: "MCAT & DAT Prep Overview",
    subtitle: "First-principles pre-med and pre-dental exam preparation led by doctors, researchers, and top science instructors.",
    formats: FORMATS_EXAM,
    planned: [
      "Complete roadmap for MCAT (472–528) and DAT (Academic Average & Perceptual Ability)",
      "Comparison of 1-on-1 Mentorship, Live Group Cohorts, and On-Demand Practice Courses",
      "Study timelines for 3-month summer intensives vs. 6-month semester plans"
    ]
  },
  {
    path: "programs/mcat-prep.html",
    group: "MCAT & DAT Prep",
    breadcrumb: ["Programs", "MCAT & DAT Prep", "MCAT Prep"],
    title: "MCAT Prep — Full 4-Section Mastery",
    subtitle: "Deep conceptual review and passage reasoning across Chem/Phys, CARS, Bio/Biochem, and Psych/Soc.",
    formats: FORMATS_EXAM,
    planned: [
      "Experimental passage dissection & AAMC-style reasoning across all four sections",
      "High-yield biochemistry, organic chemistry, physics, and behavioral science mastery",
      "1-on-1 Mentorship, Live Group Cohort & On-Demand Practice options"
    ]
  },
  {
    path: "programs/mcat-1-on-1.html",
    group: "MCAT & DAT Prep",
    breadcrumb: ["Programs", "MCAT & DAT Prep", "1-on-1 MCAT Mentorship"],
    title: "1-on-1 MCAT Mentorship",
    subtitle: "Private coaching customized to your diagnostic baseline, target medical school score, and full-length practice exam reviews.",
    formats: ["1-on-1 Mentorship"],
    planned: [
      "Custom week-by-week MCAT study schedule built around classes, research, or clinical hours",
      "Deep review of every full-length practice test to fix passage timing and reasoning gaps",
      "Matched directly with an experienced medical/science mentor"
    ]
  },
  {
    path: "programs/mcat-cohort.html",
    group: "MCAT & DAT Prep",
    breadcrumb: ["Programs", "MCAT & DAT Prep", "Live MCAT Cohort"],
    title: "Live MCAT Group Cohort",
    subtitle: "Structured weekly small-group classes covering all four MCAT sections, CARS workshops, and timed full-length checkpoints.",
    formats: ["Live Group Cohort"],
    planned: [
      "Upcoming spring, summer, and fall MCAT cohort schedules",
      "Live interactive passage walkthroughs plus recorded replays",
      "Structured weekly content review and practice milestones"
    ]
  },
  {
    path: "programs/mcat-practice-course.html",
    group: "MCAT & DAT Prep",
    breadcrumb: ["Programs", "MCAT & DAT Prep", "MCAT Practice Course"],
    title: "On-Demand MCAT Practice Course",
    subtitle: "Self-paced passage banks, discrete science drills, CARS practice, and detailed explanations available 24/7.",
    formats: ["On-Demand Practice Course"],
    planned: [
      "Section-by-section passage and discrete question banks",
      "Clear explanations connecting every answer back to core science principles",
      "Progress tracking by AAMC foundational concept"
    ]
  },
  {
    path: "programs/dat-prep.html",
    group: "MCAT & DAT Prep",
    breadcrumb: ["Programs", "MCAT & DAT Prep", "DAT Prep"],
    title: "DAT Prep — Dental Admission Test",
    subtitle: "Comprehensive preparation for Survey of Natural Sciences, Perceptual Ability (PAT), Reading Comprehension, and Quantitative Reasoning.",
    formats: FORMATS_EXAM,
    planned: [
      "Biology, General Chemistry, and Organic Chemistry review guided by dental & science faculty",
      "Dedicated Perceptual Ability (PAT) spatial visualization training and Quantitative Reasoning speed drills",
      "1-on-1 Mentorship, Live Group Cohort & On-Demand Practice options"
    ]
  },

  // Textbooks & Workbooks Store (5)
  {
    path: "books/index.html",
    group: "Textbooks & Workbooks Store",
    breadcrumb: ["Textbooks & Workbooks"],
    title: "Textbooks & Exam Workbooks",
    subtitle: "Clear, concept-first textbooks and problem workbooks written by Master Your Courses educators across AP, SAT, ACT, Competitions, MCAT, and DAT.",
    formats: [],
    planned: [
      "Complete catalog of published print and digital textbooks & workbooks",
      "Sample chapter previews and table of contents for every book",
      "Direct ordering links and bundle options with our practice courses"
    ]
  },
  {
    path: "books/ap-prep-books.html",
    group: "Textbooks & Workbooks Store",
    breadcrumb: ["Textbooks & Workbooks", "AP Textbooks"],
    title: "AP Textbooks & Unit Workbooks",
    subtitle: "Structured textbooks and exam-level MCQ/FRQ workbooks for AP Sciences, Calculus, Statistics, Computer Science, and Humanities.",
    formats: [],
    planned: [
      "Unit-by-unit concept lessons paired with graded practice sets and full solutions",
      "Built for both self-study students and classroom/tutoring use",
      "Sample pages and direct purchase options"
    ]
  },
  {
    path: "books/sat-act-books.html",
    group: "Textbooks & Workbooks Store",
    breadcrumb: ["Textbooks & Workbooks", "SAT & ACT Books"],
    title: "Digital SAT & ACT Prep Books",
    subtitle: "Focused strategy guides and realistic practice problem books for Digital SAT Reading & Writing, Math, and the ACT.",
    formats: [],
    planned: [
      "Complete grammar, reading comprehension, and math topic books",
      "Realistic practice sets with step-by-step written solutions",
      "Sample chapters and ordering links"
    ]
  },
  {
    path: "books/competition-math-books.html",
    group: "Textbooks & Workbooks Store",
    breadcrumb: ["Textbooks & Workbooks", "Competition Books"],
    title: "AMC, AIME & Olympiad Problem Books",
    subtitle: "Problem-solving books teaching counting, number theory, geometry, algebra, and physics competition intuition from the ground up.",
    formats: [],
    planned: [
      "Graded problem sets from AMC 8/10/12 foundations through AIME and F=ma",
      "Multiple solution approaches highlighting how to spot the key idea",
      "Sample chapters and ordering links"
    ]
  },
  {
    path: "books/mcat-dat-books.html",
    group: "Textbooks & Workbooks Store",
    breadcrumb: ["Textbooks & Workbooks", "MCAT & DAT Books"],
    title: "MCAT & DAT Review Books",
    subtitle: "High-clarity review textbooks and passage workbooks for Biology, Biochemistry, General & Organic Chemistry, Physics, CARS, and PAT.",
    formats: [],
    planned: [
      "Focused science review without bloated filler chapters",
      "Passage-based practice questions and worked explanations",
      "Sample chapters and ordering links"
    ]
  },

  // Course Tutoring Levels (2)
  {
    path: "programs/high-school-tutoring.html",
    group: "1-on-1 Course Tutoring",
    breadcrumb: ["Programs", "Course Tutoring", "High School & Honors"],
    title: "High School & Honors 1-on-1 Tutoring",
    subtitle: "Private mentorship aligned to your school’s exact pacing across Algebra, Geometry, Precalculus, Biology, Chemistry, Physics, and English.",
    formats: FORMATS_TUTORING,
    planned: ["Unit test & midterm/final exam preparation ahead of school pacing", "Custom homework & lab-report mastery without crutch shortcuts", "Direct parent progress updates"]
  },
  {
    path: "programs/university-tutoring.html",
    group: "1-on-1 Course Tutoring",
    breadcrumb: ["Programs", "Course Tutoring", "University & Pre-Med STEM"],
    title: "University & Pre-Med 1-on-1 STEM Tutoring",
    subtitle: "Rigorous 1-on-1 support from graduate-level researchers and doctors across Calculus I–III, Linear Algebra, Gen Chem, Organic Chem, Physics, and Stats.",
    formats: FORMATS_TUTORING,
    planned: ["Matched directly to your university professor’s syllabus & problem sets", "Pre-med weed-out course protection (Gen Chem, Organic Chem, Physics, Biochem)", "Midterm & final exam simulation"]
  },

  // Root Company, Conversion, Portal & Legal Pages (15)
  {
    path: "about.html",
    group: "Company & Proof",
    breadcrumb: ["About Us"],
    title: "About Master Your Courses",
    subtitle: "Our academic mission, founder story, and why we built a first-principles alternative to formula-memorization tutoring.",
    formats: [],
    planned: [
      "Origin story & educational philosophy behind Master Your Courses",
      "Academic leadership & <3% mentor selection standards",
      "By-the-numbers student outcomes & institutional values"
    ]
  },
  {
    path: "methodology.html",
    group: "Company & Proof",
    breadcrumb: ["How It Works"],
    title: "How It Works — Our 6-Step Mastery System",
    subtitle: "Inside our diagnostic-first pedagogy, exam-calibrated practice platform, between-session Q&A, and parent progress tracking.",
    formats: [],
    planned: ["Step-by-step walkthrough from Day 1 Diagnostic to Exam Day", "Inside look at student practice sets, mock checkpoints & progress dashboards", "Why first-principles intuition outperforms formula cramming"]
  },
  {
    path: "mentors.html",
    group: "Company & Proof",
    breadcrumb: ["Mentors"],
    title: "Meet Our Mentors",
    subtitle: "Explore our selective faculty of National Virtual Teachers of the Year, Killam Award-winning university instructors, researchers, and doctors.",
    formats: [],
    planned: ["Filterable mentor profiles across AP, Digital SAT, Olympiads & University STEM", "Our <3% mentor selection & teaching-audition standards", "How we match your student by subject, baseline, and learning style"]
  },
  {
    path: "results.html",
    group: "Company & Proof",
    breadcrumb: ["Student Results"],
    title: "Student Results & Case Studies",
    subtitle: "Verified AP 5s, 200+ point Digital SAT jumps, C-to-A grade turnarounds, Olympiad qualifiers, and top university admissions.",
    formats: [],
    planned: ["Filterable video & written stories from parents and students", "Score-jump case studies across AP STEM, Digital SAT & Course Tutoring", "University matriculation highlights"]
  },
  // Free Resources & SEO Hub-and-Spoke Wing (29)
  {
    path: "resources/index.html",
    group: "Free Resources — Hub",
    breadcrumb: ["Free Resources"],
    title: "Free Learning Hub — Practice, Mock Exams, Calculators & Guides",
    subtitle: "Explore free exam-calibrated practice questions, diagnostic mock tests, score calculators, and study roadmaps built by our mentors.",
    formats: [],
    planned: [
      "Filterable directory by exam (22 AP courses, Digital SAT, AMC/AIME, F=ma, USACO) and resource type",
      "Direct access to interactive score calculators, topic quizzes, diagnostic tests, and formula sheets",
      "Tailored recommendations for On-Demand Practice Courses, Live Group Cohorts, and 1-on-1 Mentorship"
    ]
  },
  {
    path: "tools/index.html",
    group: "Free Resources — Calculators & Study Tools",
    breadcrumb: ["Free Resources", "Tools & Calculators"],
    title: "Interactive Score Calculators & Academic Tools",
    subtitle: "Instant, curve-calibrated score calculators for all 22 AP exams, the adaptive Digital SAT, AMC/AIME cutoffs, and weighted high school GPA.",
    formats: [],
    planned: [
      "Interactive sliders converting raw MCQ + FRQ scores into projected 1–5 AP or 400–1600 SAT scores",
      "Historical exam curve comparisons & target-score gap analysis",
      "One-click study plan based on how many points you need for your target score"
    ]
  },
  {
    path: "tools/ap-score-calculators.html",
    group: "Free Resources — Calculators & Study Tools",
    breadcrumb: ["Free Resources", "Tools & Calculators", "AP Score Calculators"],
    title: "AP Score Calculators (All 22 AP Exams)",
    subtitle: "Calculate your projected 1–5 AP score using official section weights and updated College Board rubric curves across every major AP course.",
    formats: [],
    planned: [
      "Subject-specific MCQ & FRQ sliders for AP Bio, Chem, Physics 1/2/C, Calc AB/BC, Stats, CS, Econ, Psych, English & History",
      "Exact raw-score cutoffs needed to lock in an AP 4 or 5",
      "Direct links to unit practice sets for any weak FRQ section"
    ]
  },
  {
    path: "tools/digital-sat-score-calculator.html",
    group: "Free Resources — Calculators & Study Tools",
    breadcrumb: ["Free Resources", "Tools & Calculators", "Digital SAT Score Calculator"],
    title: "Digital SAT Score Calculator",
    subtitle: "Estimate your scaled Reading & Writing (200–800) and Math (200–800) scores across adaptive Module 1 and Module 2 routing.",
    formats: [],
    planned: [
      "Interactive Module 1 + Module 2 adaptive routing score estimator",
      "Breakdown of how hard-module vs. easy-module routing impacts 1500+ ceilings",
      "Recommended Digital SAT practice drills to close your exact score gap"
    ]
  },
  {
    path: "tools/amc-aime-cutoff-calculator.html",
    group: "Free Resources — Calculators & Study Tools",
    breadcrumb: ["Free Resources", "Tools & Calculators", "AMC & AIME Cutoff Calculator"],
    title: "AMC 10 / 12 & AIME Qualification Calculator",
    subtitle: "Model answered vs. blank strategy (+6 correct, +1.5 blank, 0 wrong) and compare against historical AIME, Honor Roll, and USAMO index cutoffs.",
    formats: [],
    planned: [
      "Real-time AMC 10/12 score & AIME qualification probability calculator",
      "USA(J)MO index calculator (AMC score + 10 × AIME score) with historical cutoffs",
      "Pacing & blank-vs-guess strategy simulator"
    ]
  },
  {
    path: "tools/gpa-calculator.html",
    group: "Free Resources — Calculators & Study Tools",
    breadcrumb: ["Free Resources", "Tools & Calculators", "Weighted & AP GPA Calculator"],
    title: "High School Weighted & AP GPA Calculator",
    subtitle: "Calculate both unweighted (4.0) and weighted Honors/AP/IB GPA across semesters to plan an ambitious, balanced course load.",
    formats: [],
    planned: [
      "Semester-by-semester unweighted & weighted (+0.5 Honors / +1.0 AP) GPA calculator",
      "Cumulative GPA projection tool for upcoming junior and senior AP schedules",
      "Guidance on high-impact STEM course selection"
    ]
  },
  {
    path: "tools/act-score-calculator.html",
    group: "Free Resources — Calculators & Study Tools",
    breadcrumb: ["Free Resources", "Tools & Calculators", "ACT Score Calculator"],
    title: "ACT Composite Score Calculator (1–36)",
    subtitle: "Convert raw section scores across English, Math, Reading, and Science into scaled 1–36 section and composite ACT scores.",
    formats: [],
    planned: [
      "Interactive 1–36 section and composite score calculator updated for the current ACT",
      "Target-score gap breakdown showing where a few extra questions raise your composite",
      "Links to matching ACT practice drills"
    ]
  },
  {
    path: "tools/mcat-score-calculator.html",
    group: "Free Resources — Calculators & Study Tools",
    breadcrumb: ["Free Resources", "Tools & Calculators", "MCAT Score Calculator"],
    title: "MCAT Score Calculator (472–528)",
    subtitle: "Estimate your scaled 118–132 section scores and 472–528 total MCAT score across Chem/Phys, CARS, Bio/Biochem, and Psych/Soc.",
    formats: [],
    planned: [
      "Four-section raw-to-scaled MCAT score & percentile estimator",
      "Breakdown of points needed for 510+, 515+, and 520+ milestones",
      "Recommended MCAT passage sets based on your lowest section"
    ]
  },
  {
    path: "tools/study-schedule-planner.html",
    group: "Free Resources — Calculators & Study Tools",
    breadcrumb: ["Free Resources", "Tools & Calculators", "Study Schedule & Exam Dates"],
    title: "Exam Date Countdown & Study Schedule Generator",
    subtitle: "Track official AP, Digital SAT, AMC, AIME, and Olympiad exam dates and generate a custom week-by-week review schedule.",
    formats: [],
    planned: [
      "Interactive 2026–2027 AP, Digital SAT & Olympiad exam countdown calendar",
      "Custom weekly study-plan generator based on test date and available hours per week",
      "Built-in checkpoint milestones for unit reviews and full-length mock tests"
    ]
  },
  {
    path: "practice/index.html",
    group: "Free Resources — Practice, Quizzes & Flashcards",
    breadcrumb: ["Free Resources", "Practice & Quizzes"],
    title: "Free Practice Questions, Quizzes & Flashcards",
    subtitle: "Sharpen your intuition on application-heavy AP MCQs & FRQs, hard Digital SAT Module 2 problems, Olympiad drills, and active-recall decks.",
    formats: [],
    planned: [
      "Bite-sized 5-to-15 question topic quizzes with instant step-by-step explanations",
      "Active-recall flashcard decks and university STEM worked problem sets",
      "Seamless preview of our full On-Demand Practice Courses"
    ]
  },
  {
    path: "practice/ap-practice-questions.html",
    group: "Free Resources — Practice, Quizzes & Flashcards",
    breadcrumb: ["Free Resources", "Practice & Quizzes", "AP Practice Questions"],
    title: "Free AP Practice Questions & Unit Quizzes",
    subtitle: "Unit-by-unit practice questions and rubric-scored FRQ walkthroughs across AP Sciences, Math, Computer Science, Economics, English, and History.",
    formats: [],
    planned: [
      "Unit quizzes for all 22 AP courses with detailed first-principles explanations",
      "Worked College Board-style FRQ examples & common trap breakdowns",
      "Unlockable full-course problem banks via On-Demand Practice Courses"
    ]
  },
  {
    path: "practice/sat-practice-questions.html",
    group: "Free Resources — Practice, Quizzes & Flashcards",
    breadcrumb: ["Free Resources", "Practice & Quizzes", "Digital SAT Practice"],
    title: "Free Digital SAT Practice Questions & Skill Quizzes",
    subtitle: "High-difficulty Reading & Writing craft/inference passages and Module 2 Math problems with Desmos and algebraic walkthroughs.",
    formats: [],
    planned: [
      "Skill-tagged verbal quizzes (Rhetorical Synthesis, Logical Completion, Boundaries, Cross-Text)",
      "Hard Module 2 Math drills (nonlinear systems, circle geometry, parameter constants)",
      "Instant scoring & timing benchmarks"
    ]
  },
  {
    path: "practice/competition-problems.html",
    group: "Free Resources — Practice, Quizzes & Flashcards",
    breadcrumb: ["Free Resources", "Practice & Quizzes", "Competition Problems"],
    title: "Free AMC, AIME, F=ma & Olympiad Worked Problems",
    subtitle: "Curated competition problems in algebra, number theory, geometry, combinatorics, mechanics, and algorithms—solved from first principles.",
    formats: [],
    planned: [
      "Difficulty-graded problem sets for AMC 8, AMC 10/12, AIME, Waterloo Euclid, F=ma & USACO",
      "Multiple solution paths showing how experienced competitors spot the key insight",
      "Topic tags linking directly to structured Olympiad training"
    ]
  },
  {
    path: "practice/ap-flashcards.html",
    group: "Free Resources — Practice, Quizzes & Flashcards",
    breadcrumb: ["Free Resources", "Practice & Quizzes", "AP Flashcards"],
    title: "Free Active-Recall AP Flashcards & Key-Term Decks",
    subtitle: "Spaced, concept-driven flashcard decks for high-volume AP exams including AP Biology, Psychology, U.S. History, World History, Gov, Human Geo, and Chemistry.",
    formats: [],
    planned: [
      "Unit-by-unit active-recall decks (processes, landmark SCOTUS cases, historical periods, reactions & pathways)",
      "Confidence-graded review mode that resurfaces missed concepts automatically",
      "Direct links to matching unit MCQs and FRQ drills"
    ]
  },
  {
    path: "practice/act-practice-questions.html",
    group: "Free Resources — Practice, Quizzes & Flashcards",
    breadcrumb: ["Free Resources", "Practice & Quizzes", "ACT Practice Questions"],
    title: "Free ACT Practice Questions & Section Quizzes",
    subtitle: "Timed practice passages and math drills across ACT English, Math, Reading, and Science with clear explanations.",
    formats: [],
    planned: [
      "Topic quizzes for rhetorical English rules, ACT geometry/trig, reading speed, and data passages",
      "Step-by-step explanations and pacing benchmarks",
      "Direct preview of our full ACT prep options"
    ]
  },
  {
    path: "practice/mcat-dat-practice-questions.html",
    group: "Free Resources — Practice, Quizzes & Flashcards",
    breadcrumb: ["Free Resources", "Practice & Quizzes", "MCAT & DAT Practice"],
    title: "Free MCAT & DAT Practice Passages & Questions",
    subtitle: "Experimental science passages, CARS practice, discrete questions, and DAT Perceptual Ability drills with worked explanations.",
    formats: [],
    planned: [
      "AAMC-style Chem/Phys, Bio/Biochem, Psych/Soc, and CARS practice sets",
      "DAT Natural Sciences and PAT spatial reasoning sample sets",
      "Detailed walkthroughs of every answer choice"
    ]
  },
  {
    path: "practice/university-stem-problems.html",
    group: "Free Resources — Practice, Quizzes & Flashcards",
    breadcrumb: ["Free Resources", "Practice & Quizzes", "University STEM Problems"],
    title: "Free University & Pre-Med STEM Worked Problems",
    subtitle: "Midterm- and final-caliber worked problems across Calculus I–III, Linear Algebra, Differential Equations, General & Organic Chemistry, and Physics.",
    formats: [],
    planned: [
      "Step-by-step university exam problems with full derivations and mechanism arrows",
      "Organized by standard undergraduate & pre-med course topics",
      "Direct path to 1-on-1 University STEM Tutoring when you want tailored syllabus support"
    ]
  },
  {
    path: "solutions/index.html",
    group: "Free Resources — Past Exam & FRQ Solutions",
    breadcrumb: ["Free Resources", "Past Exam Solutions"],
    title: "Past Exam & Official FRQ Solutions Archive",
    subtitle: "Year-by-year step-by-step written and video walkthroughs for past AP Free-Response Questions, AMC, AIME, Waterloo CEMC, F=ma, USAPhO, and Olympiads.",
    formats: [],
    planned: [
      "Searchable archive by exam, year, and question number",
      "Rubric point-by-point breakdowns showing how graders award full credit",
      "Links from every past problem to targeted practice sets on the exact underlying concept"
    ]
  },
  {
    path: "solutions/ap-frq-solutions.html",
    group: "Free Resources — Past Exam & FRQ Solutions",
    breadcrumb: ["Free Resources", "Past Exam Solutions", "AP FRQ Solutions"],
    title: "Past AP Free-Response (FRQ) Solutions & Rubric Walkthroughs",
    subtitle: "Clear, first-principles solutions and scoring-guideline commentary for recent AP Free-Response exams across all 22 AP subjects.",
    formats: [],
    planned: [
      "Year-by-year AP FRQ walkthroughs for Sciences, Math, CS, Economics, English & History",
      "Common student traps that cost rubric points—and how to avoid them",
      "Related unit study guides and practice drills for each FRQ part"
    ]
  },
  {
    path: "solutions/amc-aime-solutions.html",
    group: "Free Resources — Past Exam & FRQ Solutions",
    breadcrumb: ["Free Resources", "Past Exam Solutions", "AMC & AIME Solutions"],
    title: "Past AMC 8, AMC 10, AMC 12 & AIME Worked Solutions",
    subtitle: "Intuitive, multi-method solutions for past AMC 8, AMC 10A/10B, AMC 12A/12B, and AIME I/II contest problems.",
    formats: [],
    planned: [
      "Both clean algebraic/geometric proofs and fast contest-day synthetic shortcuts",
      "Tagged by topic (Number Theory, Counting, Geometry, Algebra) and difficulty",
      "Direct bridges into AIME & USAMO training tracks"
    ]
  },
  {
    path: "solutions/waterloo-euclid-solutions.html",
    group: "Free Resources — Past Exam & FRQ Solutions",
    breadcrumb: ["Free Resources", "Past Exam Solutions", "Waterloo CEMC Solutions"],
    title: "Past Waterloo Euclid, Fermat, Cayley & Pascal Solutions",
    subtitle: "Model written-proof and short-answer solutions for University of Waterloo CEMC mathematics competitions.",
    formats: [],
    planned: [
      "Full-mark Euclid written-solution formatting examples for Questions 7–10",
      "Part C multi-step breakthroughs for Pascal, Cayley & Fermat contests",
      "Honour Roll preparation benchmarks"
    ]
  },
  {
    path: "solutions/olympiad-solutions.html",
    group: "Free Resources — Past Exam & FRQ Solutions",
    breadcrumb: ["Free Resources", "Past Exam Solutions", "Science & CS Olympiad Solutions"],
    title: "Past F=ma, USAPhO, USNCO, USABO & USACO Solutions",
    subtitle: "Rigorous derivations, chemical mechanisms, experimental breakdowns, and C++/Java/Python code walkthroughs for national Olympiads.",
    formats: [],
    planned: [
      "F=ma & USAPhO mechanics and electromagnetism derivations",
      "USNCO Local/National and USABO Open/Semifinal worked explanations",
      "USACO Bronze, Silver, Gold & Platinum algorithmic complexity walkthroughs"
    ]
  },
  {
    path: "mock-exams/index.html",
    group: "Free Resources — Diagnostic & Mock Exams",
    breadcrumb: ["Free Resources", "Diagnostic Mock Exams"],
    title: "Free Diagnostic & Sample Mock Exams",
    subtitle: "Benchmark your current score under realistic timed conditions and receive a personalized topic-by-topic gap report.",
    formats: [],
    planned: [
      "Timed online diagnostic exams for the Digital SAT, AP courses, and AMC contests",
      "Detailed score breakdown highlighting conceptual vs. pacing errors",
      "Recommended roadmap across On-Demand Practice, Live Cohorts, or 1-on-1 Mentorship"
    ]
  },
  {
    path: "mock-exams/digital-sat-diagnostic.html",
    group: "Free Resources — Diagnostic & Mock Exams",
    breadcrumb: ["Free Resources", "Diagnostic Mock Exams", "Digital SAT Diagnostic"],
    title: "Free Adaptive Digital SAT Diagnostic Exam",
    subtitle: "Take a timed, adaptive Digital SAT Reading & Writing + Math diagnostic to pinpoint your baseline score and fastest path past 1500+.",
    formats: [],
    planned: [
      "Realistic two-stage adaptive Digital SAT interface with built-in Desmos graphing calculator",
      "Domain-by-domain accuracy & pacing analytics",
      "Custom 10-to-16 week study plan generated from your results"
    ]
  },
  {
    path: "mock-exams/ap-diagnostics.html",
    group: "Free Resources — Diagnostic & Mock Exams",
    breadcrumb: ["Free Resources", "Diagnostic Mock Exams", "AP Readiness Diagnostics"],
    title: "Free AP Readiness & Mid-Year Diagnostic Exams",
    subtitle: "Assess where you stand on a 1–5 scale weeks or months before May so you can close unit gaps early.",
    formats: [],
    planned: [
      "Subject readiness diagnostics across AP Bio, Chem, Physics 1/C, Calc AB/BC, Stats, CS & Humanities",
      "Unit-level mastery heatmap showing exactly which topics need review",
      "Step-by-step video & written explanations"
    ]
  },
  {
    path: "mock-exams/amc-placement-test.html",
    group: "Free Resources — Diagnostic & Mock Exams",
    breadcrumb: ["Free Resources", "Diagnostic Mock Exams", "AMC Placement Test"],
    title: "Free AMC 8 / 10 / 12 Placement Diagnostic",
    subtitle: "Identify your competition baseline across algebra, geometry, counting, and number theory before starting AIME-track training.",
    formats: [],
    planned: [
      "Timed 40-minute diagnostic calibrated to AMC 8, AMC 10, and AMC 12 benchmarks",
      "Four-pillar score profile (Algebra, Geometry, Number Theory, Combinatorics)",
      "Recommended competition cohort or 1-on-1 training level"
    ]
  },
  {
    path: "mock-exams/act-diagnostic.html",
    group: "Free Resources — Diagnostic & Mock Exams",
    breadcrumb: ["Free Resources", "Diagnostic Mock Exams", "ACT Diagnostic"],
    title: "Free ACT Diagnostic Practice Test",
    subtitle: "Take a realistic timed ACT diagnostic to benchmark your 1–36 composite score and compare SAT vs. ACT strengths.",
    formats: [],
    planned: [
      "Timed online ACT diagnostic with section-by-section scoring",
      "Side-by-side comparison to help students decide between the Digital SAT and ACT",
      "Personalized study plan based on your section breakdown"
    ]
  },
  {
    path: "mock-exams/mcat-dat-diagnostics.html",
    group: "Free Resources — Diagnostic & Mock Exams",
    breadcrumb: ["Free Resources", "Diagnostic Mock Exams", "MCAT & DAT Diagnostics"],
    title: "Free MCAT & DAT Baseline Diagnostic Tests",
    subtitle: "Establish your starting score across core pre-med or pre-dental sections before mapping out your multi-month study schedule.",
    formats: [],
    planned: [
      "Half-length MCAT diagnostic (Chem/Phys, CARS, Bio/Biochem, Psych/Soc) with 472–528 projection",
      "DAT baseline diagnostic covering Natural Sciences, PAT, Reading & Quantitative Reasoning",
      "Topic-level gap report and recommended study timeline"
    ]
  },
  {
    path: "guides/index.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Study Guides"],
    title: "Study Guides, Formula Sheets & Exam Roadmaps",
    subtitle: "In-depth exam guides, printable formula sheets, FRQ rubrics, and STEM planning articles written by our educators and researchers.",
    formats: [],
    planned: [
      "Searchable library of AP unit guides, printable equation sheets & exam calendars",
      "Digital SAT 1500+ strategy playbooks & Desmos reference guides",
      "Parent guides to high school STEM sequencing & university preparation"
    ]
  },
  {
    path: "guides/ap-study-guides.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Study Guides", "AP Study Guides"],
    title: "AP Study Guides, Formula Sheets & FRQ Rubrics",
    subtitle: "Clear, concept-first unit summaries, annotated equation sheets, and FRQ scoring checklists across all 22 AP courses.",
    formats: [],
    planned: [
      "Downloadable formula & reference guides for AP Physics, Chemistry, Calculus, Statistics & Biology",
      "'How to Score a 5' timelines & common FRQ mistake breakdowns",
      "Direct links to matching unit quizzes & practice sets"
    ]
  },
  {
    path: "guides/sat-prep-guides.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Study Guides", "Digital SAT Guides"],
    title: "Digital SAT 1500+ Strategy & Desmos Guides",
    subtitle: "Complete playbooks on mastering Digital SAT grammar rules, dense reading passages, Desmos shortcuts, and hard Module 2 pacing.",
    formats: [],
    planned: [
      "Complete Digital SAT Standard English Conventions & rhetorical synthesis handbook",
      "High-speed Desmos regression, system-solving & slider techniques",
      "Week-by-week study schedules for 100–250+ point score jumps"
    ]
  },
  {
    path: "guides/olympiad-roadmaps.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Study Guides", "Olympiad Roadmaps"],
    title: "AMC, AIME, F=ma & Olympiad Preparation Roadmaps",
    subtitle: "How ambitious students progress from school STEM classes to national distinction in Math, Physics, Chemistry, Biology, and Computing Olympiads.",
    formats: [],
    planned: [
      "Year-round competition calendar (AMC 8/10/12, AIME, Waterloo CEMC, F=ma, USNCO, USABO, USACO)",
      "Recommended book lists, topic prerequisites & training schedules by grade",
      "How Olympiad problem-solving strengthens MIT/Stanford/Ivy STEM applications"
    ]
  },
  {
    path: "guides/parent-academic-guides.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Study Guides", "Parent Guides"],
    title: "Parent Guides — AP Course Loads & STEM Admissions Strategy",
    subtitle: "Practical, candid advice for parents navigating Honors vs. AP placement, SAT timing, STEM competitions, and balanced student schedules.",
    formats: [],
    planned: [
      "Grade-by-grade STEM course sequencing (8th grade through 12th grade)",
      "When to choose 1-on-1 Mentorship vs. a Live Cohort vs. an On-Demand Practice Course",
      "How top universities evaluate AP exam scores, Digital SATs & Olympiad distinctions"
    ]
  },
  {
    path: "guides/university-stem-guides.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Study Guides", "University STEM Guides"],
    title: "University & Pre-Med STEM Formula & Summary Sheets",
    subtitle: "Concise reference sheets and exam study guides for Calculus I–III, Linear Algebra, Organic Chemistry reactions, General Chemistry, and Physics.",
    formats: [],
    planned: [
      "Organic Chemistry reaction & mechanism summary maps for pre-med students",
      "Multivariable Calculus, Taylor series & Linear Algebra theorem cheat sheets",
      "Midterm & final exam preparation checklists"
    ]
  },
  {
    path: "guides/mcat-dat-study-guides.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Study Guides", "MCAT & DAT Guides"],
    title: "MCAT & DAT Study Guides, Equations & Schedules",
    subtitle: "High-yield amino acid, biochemistry, organic chemistry, physics equation sheets, and 3-to-6 month study schedules.",
    formats: [],
    planned: [
      "Printable MCAT physics equations, metabolic pathways, and amino acid reference sheets",
      "DAT biology, organic chemistry reaction summaries, and PAT strategy guides",
      "Sample 12-week and 24-week MCAT & DAT study calendars"
    ]
  },
  {
    path: "guides/video-lessons.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Study Guides", "Concept Video Library"],
    title: "Free Concept Video Lessons & Exam Crash Courses",
    subtitle: "Short, high-clarity video breakdowns teaching notoriously tough AP, Digital SAT, and Olympiad topics from first principles.",
    formats: [],
    planned: [
      "5-to-15 minute concept walkthroughs organized by subject and unit",
      "Live problem-solving demonstrations showing how top mentors attack unfamiliar questions",
      "Paired practice quizzes right below every video"
    ]
  },
  {
    path: "workshops/index.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Live Workshops & Seminars"],
    title: "Free Live Workshops & Parent Strategy Seminars",
    subtitle: "Seasonal live exam-strategy clinics for students and academic planning Q&As for parents—hosted by our lead mentors.",
    formats: [],
    planned: [
      "Upcoming live AP Spring Review Clinics, Digital SAT 1500+ Strategy Sessions & AMC Workshops",
      "Parent seminars on STEM course planning, exam timelines & university readiness",
      "On-demand recordings of past workshops"
    ]
  },
  {
    path: "blog/index.html",
    group: "Free Resources — Guides, Videos & Workshops",
    breadcrumb: ["Free Resources", "Exam Updates & Articles"],
    title: "Exam Updates, Score Analysis & Admissions Articles",
    subtitle: "Timely analysis on AP score distributions, Digital SAT & ACT updates, Olympiad cutoffs, and university STEM admissions.",
    formats: [],
    planned: [
      "Annual AP, SAT, ACT, AMC, and MCAT score-distribution breakdowns",
      "Plain-English guides whenever College Board, ACT, MAA, or AAMC updates an exam format",
      "Practical advice from our mentors on course selection and test-day strategy"
    ]
  },
  {
    path: "pricing.html",
    group: "Company & Proof",
    breadcrumb: ["Plans & Tuition"],
    title: "Plans, Formats & Tuition Overview",
    subtitle: "Clear options across self-serve Textbooks, On-Demand Practice Courses, Live Group Cohorts, and custom 1-on-1 Mentorship.",
    formats: [],
    planned: [
      "Side-by-side comparison of Textbooks, On-Demand Practice Courses, Live Group Cohorts, and 1-on-1 Mentorship",
      "Transparent self-serve pricing for Practice Courses & Textbooks plus cohort tuition ranges",
      "How custom 1-on-1 Mentorship plans are tailored during your Academic Consultation"
    ]
  },
  {
    path: "schools.html",
    group: "Company & Proof",
    breadcrumb: ["For Schools & Educators"],
    title: "For Schools, Districts & Classroom Educators",
    subtitle: "Bring Master Your Courses textbooks, exam-calibrated practice banks, and specialist review clinics to your classroom or school.",
    formats: [],
    isSchoolsDestination: true,
    planned: [
      "Classroom Textbook & Workbook Sets — desk-copy requests and school Purchase Order (PO) support",
      "Classroom Practice-Platform Access — section & department licensing for AP, SAT/ACT, and Olympiad problem banks",
      "School-Sponsored Bootcamps & Clubs — Spring AP review clinics, school-day SAT bootcamps, and AMC/Olympiad club coaching",
      "Simple School & Educator Inquiry / Desk-Copy Request form"
    ]
  },
  {
    path: "faq.html",
    group: "Company & Proof",
    breadcrumb: ["FAQ"],
    title: "Frequently Asked Questions",
    subtitle: "Complete answers for parents and students on formats, mentor matching, timelines, scheduling, mock exams, and academic consultations.",
    formats: [],
    planned: ["Categorized FAQs: Programs & Formats, Mentor Matching, Scheduling, Diagnostics & Consultations", "Direct path to request an Academic Consultation"]
  },
  {
    path: "contact.html",
    group: "Conversion & Portal",
    breadcrumb: ["Contact Us"],
    title: "Contact & Family Support",
    subtitle: "Reach our academic support team for enrolled family assistance, school counseling partnerships, or general inquiries.",
    formats: [],
    planned: [
      "Direct support contact form & email channels for current families",
      "Academic Consultation shortcut for prospective families",
      "School, club & educational partnership inquiries"
    ]
  },
  {
    path: "careers.html",
    group: "Company & Proof",
    breadcrumb: ["Become a Mentor"],
    title: "Become a Mentor at Master Your Courses",
    subtitle: "We partner with award-winning educators, PhD/MSc researchers, Olympiad medalists, and doctors who love making hard concepts click.",
    formats: [],
    planned: [
      "What we look for: subject mastery, first-principles clarity & student empathy",
      "Open subject roles across AP, Digital SAT, Olympiads & University STEM",
      "Mentor application & teaching-audition process"
    ]
  },
  {
    path: "book-consultation.html",
    group: "Conversion & Portal",
    breadcrumb: ["Book a Consultation"],
    title: "Schedule Your Academic Consultation",
    subtitle: "Select a time with our Academic Advisory Team to review your student’s goals, coursework, and recommended roadmap.",
    formats: [],
    isBookingDestination: true,
    planned: [
      "Real-time scheduling with an Academic Advisor matched to your student’s grade and target exam",
      "Personalized review of current coursework, diagnostic scores, and timeline",
      "Instant calendar confirmation & pre-consultation preparation checklist"
    ]
  },
  {
    path: "whatsapp.html",
    group: "Conversion & Portal",
    breadcrumb: ["WhatsApp Concierge"],
    title: "Message Our Academic Team on WhatsApp",
    subtitle: "Direct messaging channel for quick parent questions before scheduling an Academic Consultation.",
    formats: [],
    planned: [
      "Direct WhatsApp chat with our Academic Advisory Team",
      "Fast answers on course fit, cohort schedules, and next steps"
    ]
  },
  {
    path: "login.html",
    group: "Conversion & Portal",
    breadcrumb: ["Sign In"],
    title: "Sign In to Master Your Courses",
    subtitle: "Sign in as a student or parent to access your On-Demand Practice Courses, saved quiz & diagnostic scores, cohort replays, and 1-on-1 session schedule.",
    formats: [],
    isLoginDestination: true,
    planned: [
      "Unified student & parent portal authentication",
      "Saved quiz progress, diagnostic score analytics & study schedules",
      "1-on-1 session calendar, homework sets & cohort recordings"
    ]
  },
  {
    path: "signup.html",
    group: "Conversion & Portal",
    breadcrumb: ["Sign In", "Create Free Account"],
    title: "Create Your Free Account",
    subtitle: "Join as a student or parent—save diagnostic and quiz progress, access self-serve practice courses, or follow your student’s weekly mastery and session notes.",
    formats: [],
    isSignupDestination: true,
    planned: [
      "Student Account — take free diagnostics, save quiz & flashcard progress, build study schedules, and access courses",
      "Parent Account — link to your child’s profile, view real-time mastery & mock exam scores, read session notes, and manage enrollments",
      "Fast registration with email or Google sign-in"
    ]
  },
  {
    path: "privacy.html",
    group: "Legal & Social",
    breadcrumb: ["Legal", "Privacy Policy"],
    title: "Privacy Policy",
    subtitle: "How Master Your Courses protects student and family information across our mentorship and learning platform.",
    formats: [],
    planned: ["Data collection, student privacy protections & retention policy", "Contact details for privacy inquiries"]
  },
  {
    path: "terms.html",
    group: "Legal & Social",
    breadcrumb: ["Legal", "Terms of Service"],
    title: "Terms of Service",
    subtitle: "Enrollment terms, session scheduling policies, cohort guidelines, and platform usage terms.",
    formats: [],
    planned: ["1-on-1 rescheduling, cohort access & practice course license terms", "Academic integrity & account policies"]
  },
  {
    path: "refund-policy.html",
    group: "Legal & Social",
    breadcrumb: ["Legal", "Returns & Refund Policy"],
    title: "Shipping, Returns & Refund Policy",
    subtitle: "Clear return, shipping, and refund terms for physical textbooks, digital practice courses, live group cohorts, and 1-on-1 mentorship.",
    formats: [],
    planned: [
      "Shipping timelines, damaged-copy replacements, and return window for print textbooks",
      "Access, cancellation, and refund terms for On-Demand Practice Courses and Live Group Cohorts",
      "1-on-1 Mentorship session rescheduling and mentor rematch policy"
    ]
  },
  {
    path: "cookies.html",
    group: "Legal & Social",
    breadcrumb: ["Legal", "Cookie Policy"],
    title: "Cookie Policy",
    subtitle: "Details on essential session cookies, theme preferences, and analytics controls.",
    formats: [],
    planned: ["Essential vs. analytics cookie breakdown", "Browser & preference management controls"]
  },
  {
    path: "social.html",
    group: "Legal & Social",
    breadcrumb: ["Official Channels"],
    title: "Master Your Courses — Official Social Channels",
    subtitle: "Follow our exam-strategy breakdowns, AP/SAT study tips, and student spotlights across Facebook, Instagram, YouTube, TikTok, and X.",
    formats: [],
    isSocialDestination: true,
    planned: ["Direct links to verified Facebook, YouTube, Instagram, TikTok & X profiles"]
  }
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}

function renderSharedShell({ prefix, title, description = "", jsonLd = null, bodyHtml }) {
  const metaDesc = description
    ? `\n  <meta name="description" content="${escapeHtml(description)}" />`
    : "";
  const schemaTag = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : "";
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} — Master Your Courses</title>${metaDesc}
  <link rel="icon" href="${prefix}logo/logo.svg" type="image/svg+xml" />${schemaTag}
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    (function () {
      const saved = localStorage.getItem("theme");
      const theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
    })();
    function toggleTheme() {
      const nextDark = !document.documentElement.classList.contains("dark");
      document.documentElement.classList.toggle("dark", nextDark);
      localStorage.setItem("theme", nextDark ? "dark" : "light");
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          fontFamily: {
            sans: ["Inter", "sans-serif"],
            display: ["Outfit", "sans-serif"]
          }
        }
      }
    };
  </script>
</head>
<body class="min-h-screen flex flex-col bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-zinc-50 antialiased font-sans">
  <header class="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
      <a href="${prefix}index.html" class="flex items-center gap-2 min-w-0">
        <img src="${prefix}logo/logo.svg" alt="Master Your Courses Logo" class="w-7 h-7 md:w-8 md:h-8 object-contain dark:brightness-0 dark:invert shrink-0" />
        <span class="text-lg md:text-2xl font-black font-display tracking-tight truncate">
          Master<span class="text-indigo-500">Your</span>Courses
        </span>
      </a>
      <nav aria-label="Primary" class="flex items-center gap-3 sm:gap-5 lg:gap-6">
        <a href="${prefix}programs/index.html" class="hidden md:inline text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-colors">Programs</a>
        <a href="${prefix}resources/index.html" class="hidden md:inline text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-colors">Free Resources</a>
        <a href="${prefix}results.html" class="hidden md:inline text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-colors">Results</a>
        <span aria-hidden="true" class="hidden md:block h-4 w-px bg-slate-200 dark:bg-white/15"></span>
        <button type="button" onclick="toggleTheme()" aria-label="Toggle theme" class="p-2 rounded-full hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors">
          <svg aria-hidden="true" class="w-5 h-5 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-15.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          <svg aria-hidden="true" class="w-5 h-5 hidden dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        </button>
        <a href="${prefix}login.html" class="text-xs sm:text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap">Sign In</a>
        <a href="${prefix}book-consultation.html" class="px-4 sm:px-5 py-2 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap">Book a Consultation</a>
      </nav>
    </div>
  </header>

  <main class="flex-1">
${bodyHtml}
  </main>

  <footer class="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black py-8">
    <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
      <p>&copy; 2026 Master Your Courses Inc. All rights reserved.</p>
      <div class="flex flex-wrap items-center justify-center gap-5 font-semibold">
        <a href="${prefix}privacy.html" class="hover:text-indigo-500 transition-colors">Privacy Policy</a>
        <a href="${prefix}terms.html" class="hover:text-indigo-500 transition-colors">Terms of Service</a>
        <a href="${prefix}refund-policy.html" class="hover:text-indigo-500 transition-colors">Returns &amp; Refunds</a>
        <a href="${prefix}cookies.html" class="hover:text-indigo-500 transition-colors">Cookie Policy</a>
        <a href="${prefix}sitemap.html" class="hover:text-indigo-500 transition-colors">Site Map</a>
      </div>
    </div>
  </footer>
</body>
</html>
`;
}

function renderComingSoonPage(page) {
  const isNested = page.path.includes("/");
  const prefix = isNested ? "../" : "./";

  const crumbs = [
    `<a href="${prefix}index.html" class="hover:text-indigo-500 transition-colors">Home</a>`,
    ...page.breadcrumb.map((item, idx) => {
      if (idx === 0 && item === "Programs" && page.breadcrumb.length > 1) {
        return `<a href="${prefix}programs/index.html" class="hover:text-indigo-500 transition-colors">Programs</a>`;
      }
      if (idx === 1 && item === "AP Prep" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}programs/ap-prep.html" class="hover:text-indigo-500 transition-colors">AP Prep</a>`;
      }
      if (idx === 1 && item === "Digital SAT Prep" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}programs/sat-prep.html" class="hover:text-indigo-500 transition-colors">Digital SAT Prep</a>`;
      }
      if (idx === 1 && item === "Competition Prep" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}programs/competition-prep.html" class="hover:text-indigo-500 transition-colors">Competition Prep</a>`;
      }
      if (idx === 1 && item === "MCAT & DAT Prep" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}programs/mcat-dat-prep.html" class="hover:text-indigo-500 transition-colors">MCAT &amp; DAT Prep</a>`;
      }
      if (idx === 0 && item === "Textbooks & Workbooks" && page.breadcrumb.length > 1) {
        return `<a href="${prefix}books/index.html" class="hover:text-indigo-500 transition-colors">Textbooks &amp; Workbooks</a>`;
      }
      if (idx === 1 && item === "Course Tutoring" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}programs/course-tutoring.html" class="hover:text-indigo-500 transition-colors">Course Tutoring</a>`;
      }
      if (idx === 0 && item === "Free Resources" && page.breadcrumb.length > 1) {
        return `<a href="${prefix}resources/index.html" class="hover:text-indigo-500 transition-colors">Free Resources</a>`;
      }
      if (idx === 1 && item === "Tools & Calculators" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}tools/index.html" class="hover:text-indigo-500 transition-colors">Tools &amp; Calculators</a>`;
      }
      if (idx === 1 && item === "Practice & Quizzes" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}practice/index.html" class="hover:text-indigo-500 transition-colors">Practice &amp; Quizzes</a>`;
      }
      if (idx === 1 && item === "Past Exam Solutions" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}solutions/index.html" class="hover:text-indigo-500 transition-colors">Past Exam Solutions</a>`;
      }
      if (idx === 1 && item === "Diagnostic Mock Exams" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}mock-exams/index.html" class="hover:text-indigo-500 transition-colors">Diagnostic Mock Exams</a>`;
      }
      if (idx === 1 && item === "Study Guides" && page.breadcrumb.length > 2) {
        return `<a href="${prefix}guides/index.html" class="hover:text-indigo-500 transition-colors">Study Guides</a>`;
      }
      if (idx === 0 && item === "Sign In" && page.breadcrumb.length > 1) {
        return `<a href="${prefix}login.html" class="hover:text-indigo-500 transition-colors">Sign In</a>`;
      }
      return `<span class="text-slate-900 dark:text-white font-bold">${escapeHtml(item)}</span>`;
    })
  ].join(` <span aria-hidden="true" class="text-slate-400">/</span> `);

  const formatBadges = page.formats.length
    ? `<div class="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Available learning formats">
        ${page.formats.map(f => `<span class="inline-flex items-center rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">${escapeHtml(f)}</span>`).join("")}
      </div>`
    : "";

  const dynamicBannerScript = page.isBookingDestination
    ? `
      <div id="qualification-summary" hidden class="mt-8 text-left rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:p-6">
        <p class="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 font-display mb-2">Details Received</p>
        <p class="text-sm text-slate-700 dark:text-zinc-200 mb-3">Thank you—online calendar booking is launching shortly. Here is a summary of what you shared:</p>
        <dl id="qualification-fields" class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm"></dl>
      </div>
      <script>
        (function () {
          const params = new URLSearchParams(window.location.search);
          const entries = [
            ["Inquiring As", params.get("role")],
            ["Student Grade", params.get("grade")],
            ["Primary Goal", params.get("goal")],
            ["Preferred Format", params.get("format")],
            ["Target Start", params.get("timeline")],
            ["Contact Email", params.get("email")]
          ].filter(([, val]) => val);
          if (!entries.length) return;
          const list = document.getElementById("qualification-fields");
          const box = document.getElementById("qualification-summary");
          entries.forEach(([label, val]) => {
            const wrap = document.createElement("div");
            wrap.className = "rounded-xl bg-white/70 dark:bg-zinc-900/70 px-3 py-2 border border-emerald-500/20";
            const dt = document.createElement("dt");
            dt.className = "text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-zinc-400";
            dt.textContent = label;
            const dd = document.createElement("dd");
            dd.className = "font-bold text-slate-900 dark:text-white mt-0.5 break-words";
            dd.textContent = val;
            wrap.append(dt, dd);
            list.append(wrap);
          });
          box.hidden = false;
        })();
      </script>`
    : page.isLoginDestination
      ? `
      <div class="mt-8 rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.07] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-display">New to Master Your Courses?</p>
          <p class="text-sm text-slate-700 dark:text-zinc-200 mt-1">Create a free student or parent account to save diagnostic &amp; quiz progress, access courses, or follow your child’s academic progress.</p>
        </div>
        <a href="${prefix}signup.html" class="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-colors text-center">Create Free Account &rarr;</a>
      </div>`
      : page.isSignupDestination
        ? `
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div class="rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.06] p-4">
          <p class="text-sm font-black font-display text-slate-900 dark:text-white">I’m a Student</p>
          <p class="text-xs text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed">Save quiz &amp; flashcard progress, take timed diagnostics, build study schedules, and access courses.</p>
        </div>
        <div class="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
          <p class="text-sm font-black font-display text-slate-900 dark:text-white">I’m a Parent</p>
          <p class="text-xs text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed">Link to your student’s account, track mock scores &amp; weekly mastery, view session notes, and manage plans.</p>
        </div>
      </div>
      <div class="mt-3 rounded-2xl border border-slate-300/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
        <p class="text-xs sm:text-sm text-slate-700 dark:text-zinc-300">Already have a Student or Parent account?</p>
        <a href="${prefix}login.html" class="shrink-0 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Sign In Here &rarr;</a>
      </div>`
        : page.isSchoolsDestination
          ? `
      <div class="mt-8 rounded-2xl border border-slate-300/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
        <p class="text-xs sm:text-sm text-slate-700 dark:text-zinc-300">Looking to teach 1-on-1 or lead cohorts with our faculty?</p>
        <a href="${prefix}careers.html" class="shrink-0 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Apply as a Mentor &rarr;</a>
      </div>`
          : page.isSocialDestination
      ? `<script>
          (function () {
            const channel = new URLSearchParams(window.location.search).get("platform");
            if (!channel) return;
            const label = { facebook: "Facebook", instagram: "Instagram", x: "X (Twitter)", youtube: "YouTube", tiktok: "TikTok" }[channel.toLowerCase()];
            if (label) document.getElementById("page-main-heading").textContent = "Master Your Courses on " + label;
          })();
        </script>`
      : "";

  const secondaryAction = page.path === "programs/index.html"
    ? `<a href="${prefix}book-consultation.html" class="w-full sm:w-auto px-8 py-4 rounded-full border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 font-bold text-sm sm:text-base hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-center">Book a Consultation &rarr;</a>`
    : `<a href="${prefix}programs/index.html" class="w-full sm:w-auto px-8 py-4 rounded-full border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 font-bold text-sm sm:text-base hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-center">Explore All Programs &rarr;</a>`;

  const bodyHtml = `
    <section class="relative overflow-hidden py-16 sm:py-24 px-6">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-[24rem] bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-[110px] pointer-events-none"></div>
      <div class="max-w-3xl mx-auto relative z-10 text-center">
        <nav aria-label="Breadcrumb" class="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400 mb-6 flex flex-wrap items-center justify-center gap-2">
          ${crumbs}
        </nav>

        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-widest font-display mb-6">
          <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" aria-hidden="true"></span>
          Coming Soon
        </div>

        <h1 id="page-main-heading" class="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.08]">
          ${escapeHtml(page.title)}
        </h1>

        <p class="mt-5 text-base sm:text-xl text-slate-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          ${escapeHtml(page.subtitle)}
        </p>

        ${formatBadges}
        ${dynamicBannerScript}

        <div class="mt-10 text-left rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 shadow-xl p-6 sm:p-8">
          <div class="border-b border-slate-200/80 dark:border-white/10 pb-4 mb-5">
            <h2 class="text-sm sm:text-base font-extrabold uppercase tracking-wider font-display text-indigo-600 dark:text-indigo-400">
              What You’ll Find on This Page
            </h2>
          </div>
          <ul class="space-y-3">
            ${page.planned.map(item => `
              <li class="flex items-start gap-3 text-sm sm:text-base text-slate-700 dark:text-zinc-300">
                <svg aria-hidden="true" class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>${escapeHtml(item)}</span>
              </li>`).join("")}
          </ul>
        </div>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="${prefix}index.html" class="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold text-sm sm:text-base hover:scale-[1.02] transition-transform shadow-lg text-center">
            &larr; Back to Homepage
          </a>
          ${secondaryAction}
        </div>
      </div>
    </section>`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://masteryourcourses.com/" },
      ...page.breadcrumb.map((name, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name,
        ...(idx === page.breadcrumb.length - 1 ? { item: `https://masteryourcourses.com/${page.path}` } : {})
      }))
    ]
  };

  return renderSharedShell({
    prefix,
    title: page.title,
    description: page.subtitle,
    jsonLd: breadcrumbSchema,
    bodyHtml
  });
}

function renderSitemapOverviewPage() {
  const groups = new Map();
  for (const page of SITEMAP_PAGES) {
    if (!groups.has(page.group)) groups.set(page.group, []);
    groups.get(page.group).push(page);
  }

  const groupCards = [...groups.entries()].map(([groupName, pages]) => `
    <section class="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-sm">
      <div class="flex items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4 mb-5">
        <h2 class="text-xl sm:text-2xl font-black font-display tracking-tight">${escapeHtml(groupName)}</h2>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">${pages.length} ${pages.length === 1 ? "page" : "pages"}</span>
      </div>
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        ${pages.map(p => `
          <li>
            <a href="./${escapeHtml(p.path)}" class="group flex flex-col justify-between h-full rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-zinc-950/60 p-4 hover:border-indigo-500/50 hover:bg-indigo-500/[0.04] transition-all">
              <div>
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <span class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">${escapeHtml(p.title)}</span>
                  <span class="shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">Soon</span>
                </div>
                <p class="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">${escapeHtml(p.subtitle)}</p>
              </div>
              <span class="mt-3 text-[11px] font-mono text-slate-400 dark:text-zinc-500">/${escapeHtml(p.path)} &rarr;</span>
            </a>
          </li>`).join("")}
      </ul>
    </section>
  `).join("\n");

  const bodyHtml = `
    <section class="py-14 sm:py-20 px-6 max-w-7xl mx-auto">
      <div class="max-w-3xl mb-12">
        <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-widest font-display mb-4">
          Architecture Overview
        </span>
        <h1 class="text-3xl sm:text-5xl font-black font-display tracking-tight mb-4">
          Master Your Courses — Complete Site Map
        </h1>
        <p class="text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed">
          Every page in the Master Your Courses platform (${SITEMAP_PAGES.length + 1} routes total). Click any card below to inspect its Coming Soon route, breadcrumb hierarchy, and planned page structure before we build each page one by one.
        </p>
      </div>

      <div class="space-y-8">
        <section class="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/[0.06] p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2.5 mb-1">
                <span class="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">Live &bull; Completed</span>
                <span class="text-xs font-mono text-slate-500 dark:text-zinc-400">/index.html</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black font-display">Homepage — Master Your Courses</h2>
              <p class="text-sm text-slate-600 dark:text-zinc-300 mt-1">Hero, By The Numbers, University Ribbon, 4-Track Interactive Programs, 6-Step Methodology, Mentors, Video Track Record, Facebook Reviews, FAQ, Qualifying Consultation Modal &amp; Footer.</p>
            </div>
            <a href="./index.html" class="shrink-0 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors text-center">Open Homepage &rarr;</a>
          </div>
        </section>

        ${groupCards}
      </div>
    </section>
  `;

  return renderSharedShell({ prefix: "./", title: "Complete Visual Site Map", bodyHtml });
}

function renderSitemapXml() {
  const baseUrl = "https://masteryourcourses.com";
  const excluded = new Set(["social.html"]);
  const urls = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "weekly" },
    ...SITEMAP_PAGES
      .filter(p => !excluded.has(p.path))
      .map(p => ({
        loc: `${baseUrl}/${p.path.replace(/index\.html$/, "")}`,
        priority: p.path.endsWith("index.html") || p.group === "Goal Track Hubs" ? "0.9" : "0.8",
        changefreq: p.group.startsWith("Free Resources") ? "weekly" : "monthly"
      }))
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

rmSync(join(rootDir, "resources.html"), { force: true });

for (const page of SITEMAP_PAGES) {
  const fullPath = join(rootDir, page.path);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, renderComingSoonPage(page), "utf8");
}

writeFileSync(join(rootDir, "sitemap.html"), renderSitemapOverviewPage(), "utf8");
writeFileSync(join(rootDir, "sitemap.xml"), renderSitemapXml(), "utf8");
console.log(`Generated ${SITEMAP_PAGES.length} Coming Soon pages + sitemap.html + sitemap.xml.`);
