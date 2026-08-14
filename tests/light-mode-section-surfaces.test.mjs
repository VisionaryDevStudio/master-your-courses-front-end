import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("uses an accessible three-group university marquee with silent duplicates", () => {
  const start = html.indexOf('class="surface-universities');
  const end = html.indexOf('<!-- ----------------- Methodology', start);
  const section = html.slice(start, end);
  const groups = [...section.matchAll(/<div class="university-logo-group"([^>]*)>([\s\S]*?)<\/div>/g)];

  assert.match(section, /class="university-ribbon-viewport university-ribbon-reveal"[^>]*tabindex="0"[^>]*role="region"[^>]*aria-label="Universities our students have gained admission to"/);
  assert.doesNotMatch(section, /class="university-marquee university-ribbon-reveal"/);
  assert.equal(groups.length, 3);
  assert.equal((groups[0][2].match(/class="university-logo(?:\s|")/g) ?? []).length, 10);
  assert.doesNotMatch(groups[0][1], /aria-hidden="true"/);
  for (const duplicate of groups.slice(1)) {
    assert.match(duplicate[1], /aria-hidden="true"/);
    assert.equal((duplicate[2].match(/alt="" aria-hidden="true"/g) ?? []).length, 10);
  }
});

test("reveals the university ribbon once with reduced-motion protection", () => {
  assert.match(html, /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*\.university-ribbon-reveal\s*\{[\s\S]*transform:\s*translateY\(0\.75rem\);[\s\S]*transition:\s*transform 450ms/);
  assert.doesNotMatch(html, /\.university-ribbon-reveal\s*\{[^}]*opacity:\s*0/);
  assert.match(html, /\.university-ribbon-reveal\.is-visible\s*\{\s*transform:\s*translateY\(0\);\s*\}/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.university-ribbon-reveal\s*\{[\s\S]*transform:\s*none;[\s\S]*transition:\s*none/);
  assert.match(html, /document\.querySelectorAll\('\.scroll-reveal, \.university-ribbon-reveal'\)/);
  assert.match(html, /entry\.target\.classList\.add\('is-visible'\);[\s\S]*observer\.unobserve\(entry\.target\)/);
  assert.doesNotMatch(html, /universityRibbonObserver/);
});

test("defines the approved university marquee density and reduced-motion layout", () => {
  assert.match(html, /@keyframes university-marquee\s*\{[\s\S]*to\s*\{\s*transform:\s*translateX\(calc\(-100% \/ 3\)\)/);
  assert.match(html, /\.university-marquee\s*\{[\s\S]*animation:\s*university-marquee 40s linear infinite;[\s\S]*opacity:\s*0\.7/);
  assert.match(html, /\.dark \.university-marquee\s*\{\s*opacity:\s*0\.55/);
  assert.match(html, /\.university-logo-group\s*\{[\s\S]*gap:\s*3\.25rem/);
  assert.match(html, /\.university-logo\s*\{[\s\S]*height:\s*2rem;[\s\S]*max-width:\s*9\.5rem/);
  assert.match(html, /@media \(min-width:\s*768px\)[\s\S]*\.university-logo-group\s*\{[\s\S]*gap:\s*6rem[\s\S]*\.university-logo\s*\{[\s\S]*height:\s*2\.5rem;[\s\S]*max-width:\s*11rem/);
  assert.match(html, /@media \(hover:\s*hover\) and \(pointer:\s*fine\)[\s\S]*\.university-ribbon-viewport:hover \.university-marquee[\s\S]*animation-play-state:\s*paused[\s\S]*filter:\s*grayscale\(0\)/);
  assert.match(html, /\.university-ribbon-viewport:focus \.university-marquee\s*\{[\s\S]*animation-play-state:\s*paused/);
  assert.doesNotMatch(html, /\.university-ribbon-focus-surface:focus \.university-marquee/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.university-marquee\s*\{[\s\S]*animation:\s*none;[\s\S]*transform:\s*none[\s\S]*\.university-logo-group\[aria-hidden="true"\]\s*\{\s*display:\s*none/);
});

test("uses an inset focus-within ribbon treatment around the tabbable scroller", () => {
  assert.match(html, /class="university-ribbon-viewport[^\"]*"[^>]*tabindex="0"[^>]*role="region"/);
  assert.match(html, /\.university-ribbon-focus-surface:focus-within::after\s*\{[\s\S]*inset:\s*0;[\s\S]*box-shadow:\s*inset 0 0 0 3px rgb\(99 102 241 \/ 0\.65\);[\s\S]*pointer-events:\s*none/);
  assert.match(html, /\.university-ribbon-viewport\s*\{[\s\S]*overflow:\s*hidden[\s\S]*border-radius:\s*inherit/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.university-ribbon-viewport\s*\{\s*overflow-x:\s*auto/);
});

test("preserves masked reduced-motion endpoints with inline clearance", () => {
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.university-logo-group:first-child\s*\{\s*padding-left:\s*calc\(10vw \+ 0\.5rem\);\s*padding-right:\s*calc\(10vw \+ 0\.5rem\)/);
  assert.match(html, /style="mask-image: linear-gradient\(to right, transparent, black 10%, black 90%, transparent\); -webkit-mask-image: linear-gradient\(to right, transparent, black 10%, black 90%, transparent\);"/);
});

test("keeps every marquee group identical so one-third travel lands on the next group", () => {
  const start = html.indexOf('class="surface-universities');
  const end = html.indexOf('<!-- ----------------- Methodology', start);
  const section = html.slice(start, end);
  const groups = [...section.matchAll(/<div class="university-logo-group"([^>]*)>([\s\S]*?)<\/div>/g)];
  const sources = groups.map(([, , contents]) => [...contents.matchAll(/src="([^"]+)"/g)].map(([, source]) => source));
  const expectedSources = [
    "universities/harvard.svg", "universities/mit.svg", "universities/duke.svg", "universities/florida.svg", "universities/alabama.svg",
    "universities/northwestern.svg", "universities/notre-dame.svg", "universities/nyu.svg", "universities/ohio-state.svg", "universities/penn.svg",
  ];

  assert.deepEqual(sources, [expectedSources, expectedSources, expectedSources]);
  assert.match(html, /\.university-logo-group\s*\{[\s\S]*padding-right:\s*3\.25rem/);
  assert.match(html, /@keyframes university-marquee\s*\{[\s\S]*to\s*\{\s*transform:\s*translateX\(calc\(-100% \/ 3\)\)/);
});

function extractCssBlock(source, marker) {
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, `Missing CSS marker: ${marker}`);

  const openingBrace = source.indexOf("{", markerIndex);
  assert.notEqual(openingBrace, -1, `Missing opening brace for: ${marker}`);

  let depth = 1;
  for (let index = openingBrace + 1; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }

  assert.fail(`Missing closing brace for: ${marker}`);
}

const heroMotionStart = html.indexOf("// Spotlight Effect (Hero Section)");
const heroMotionEnd = html.indexOf("// Results Count-Up", heroMotionStart);
const heroMotionSource = html.slice(heroMotionStart, heroMotionEnd);

function createHeroMotionHarness({
  reducedMotion = false,
  finePointer = true,
  innerWidth = 1440,
  scrollY = 0,
} = {}) {
  const mutations = [];
  const animationFrames = new Map();
  const windowListeners = new Map();
  const mediaQueries = new Map();
  let nextAnimationFrame = 1;

  function createStyle(elementName) {
    return new Proxy({}, {
      set(target, property, value) {
        mutations.push({ element: elementName, property: String(property), value });
        target[property] = value;
        return true;
      },
    });
  }

  function createEventTarget(extra = {}) {
    const listeners = new Map();
    return {
      ...extra,
      addEventListener(type, listener) {
        const current = listeners.get(type) ?? [];
        current.push(listener);
        listeners.set(type, current);
      },
      dispatch(type, event = {}) {
        for (const listener of listeners.get(type) ?? []) listener(event);
      },
    };
  }

  const elements = {
    "hero-section": createEventTarget({
      getBoundingClientRect: () => ({ left: 10, top: 20 }),
    }),
    "hero-spotlight": { style: createStyle("hero-spotlight") },
    "hero-copy": { style: createStyle("hero-copy") },
    "hero-copy-mobile": { style: createStyle("hero-copy-mobile") },
    "hero-card-container": { style: createStyle("hero-card-container") },
    "hero-card-container-mobile": { style: createStyle("hero-card-container-mobile") },
  };

  function getMediaQuery(query) {
    if (!mediaQueries.has(query)) {
      const initialMatches = query === "(prefers-reduced-motion: reduce)"
        ? reducedMotion
        : query === "(hover: hover) and (pointer: fine)"
          ? finePointer
          : false;
      const listeners = [];
      mediaQueries.set(query, {
        matches: initialMatches,
        addEventListener(type, listener) {
          if (type === "change") listeners.push(listener);
        },
        setMatches(matches) {
          this.matches = matches;
          for (const listener of listeners) listener({ matches });
        },
      });
    }
    return mediaQueries.get(query);
  }

  const window = {
    innerWidth,
    scrollY,
    matchMedia: getMediaQuery,
    addEventListener(type, listener) {
      const current = windowListeners.get(type) ?? [];
      current.push(listener);
      windowListeners.set(type, current);
    },
  };

  function requestAnimationFrame(callback) {
    const frame = nextAnimationFrame++;
    animationFrames.set(frame, callback);
    return frame;
  }

  window.requestAnimationFrame = requestAnimationFrame;
  runInNewContext(heroMotionSource, {
    document: { getElementById: id => elements[id] ?? null },
    requestAnimationFrame,
    window,
  });

  return {
    elements,
    flushAnimationFrames() {
      const callbacks = [...animationFrames.values()];
      animationFrames.clear();
      for (const callback of callbacks) callback();
    },
    dispatchScroll(nextScrollY) {
      window.scrollY = nextScrollY;
      for (const listener of windowListeners.get("scroll") ?? []) listener();
    },
    dispatchHeroMousemove(event) {
      elements["hero-section"].dispatch("mousemove", event);
    },
    setReducedMotion(matches) {
      getMediaQuery("(prefers-reduced-motion: reduce)").setMatches(matches);
    },
    setFinePointer(matches) {
      getMediaQuery("(hover: hover) and (pointer: fine)").setMatches(matches);
    },
    takeMutations() {
      return mutations.splice(0);
    },
  };
}

const expectedMentors = [
  {
    name: "Dr. Hossein Piri",
    role: "Healthcare Operations & AI Expert",
    avatar: "mentors/Dr.piri.jpg",
    bio: "Dr. Piri works at the intersection of healthcare operations research, machine learning, and behavioral operations. He focuses on practical systems that improve care delivery, including patient-centered warning systems and AI-driven approaches for addressing healthcare disparities.",
    accolades: [
      "40 Under 40 (2026)",
      "Dean's Research Scholar, UCalgary",
      "Killam Teaching Award, UBC",
    ],
  },
  {
    name: "Elena Z.",
    role: "Honors Biology, UWaterloo",
    avatar: "mentors/elena zhou.jpg",
    bio: "Elena is an Honors Biology powerhouse who has successfully cracked the code to top-percentile academic performance with a 4.0 GPA. As a Research Assistant at Sunnybrook Hospital, she loves breaking down complex sciences into highly digestible, university-level concepts.",
    accolades: [
      "Bruce Weyler Kelley Memorial Prize",
      "President's Scholarship of Distinction (>95%)",
    ],
  },
  {
    name: "Dr. Sherri Sadr",
    role: "Dental Graduate, UBC",
    avatar: "mentors/sadr.jpeg",
    bio: "Sherri is a dental graduate from UBC with a strong science and research foundation. Her combination of academic rigor, undergraduate mentorship through UBC's REX program, and real-world health service helps her coach students with clarity, structure, and high standards.",
    accolades: [
      "Biological Safety Certificate",
      "Laser & Chemical Safety",
      "Animal Care Training",
    ],
  },
];

function extractMentorData() {
  const source = html.match(/const MENTORS_DATA = (\[[\s\S]*?\n\s*\]);/)?.[1];
  assert.ok(source, "MENTORS_DATA declaration is missing");
  return JSON.parse(JSON.stringify(runInNewContext(`(${source})`)));
}

test("defines the premium light-mode surface tokens", () => {
  for (const token of [
    "--surface-paper:",
    "--surface-mist:",
    "--surface-indigo:",
    "--surface-warm:",
    "--surface-track:",
  ]) {
    assert.ok(html.includes(token), `missing ${token}`);
  }
});

test("light section canvases have a visible luminance step down from white", () => {
  const maximumLightness = {
    "--surface-mist": 94,
    "--surface-indigo": 94,
    "--surface-warm": 94,
    "--surface-track": 92,
  };

  for (const [token, maximum] of Object.entries(maximumLightness)) {
    const match = html.match(new RegExp(`${token}:\\s*[\\d.]+\\s+[\\d.]+%\\s+([\\d.]+)%`));
    assert.ok(match, `missing parseable ${token} HSL value`);
    assert.ok(
      Number(match[1]) <= maximum,
      `${token} is too close to white to separate adjacent sections`,
    );
  }
});

test("scopes custom section surfaces to light mode", () => {
  for (const surface of [
    "surface-hero",
    "surface-results",
    "surface-universities",
    "surface-methodology",
    "surface-programs",
    "surface-mentors",
    "surface-track-record",
  ]) {
    assert.ok(
      html.includes(`html:not(.dark) .${surface}`),
      `${surface} is not explicitly light-mode scoped`,
    );
  }
});

test("keeps the mobile hero atmosphere continuous without changing adjacent surfaces", () => {
  const mobile = extractCssBlock(html, "@media (max-width: 767px)");

  assert.match(
    mobile,
    /html:not\(\.dark\) \.surface-hero\s*\{[^}]*background-size:\s*125vw 48rem,\s*120vw 42rem,\s*auto;[^}]*background-position:\s*50% -6rem,\s*50% 20rem,\s*0 0;[^}]*background-repeat:\s*no-repeat;/
  );
  assert.match(
    mobile,
    /html:not\(\.dark\) \.surface-methodology,\s*html:not\(\.dark\) \.surface-mentors\s*\{[^}]*background-size:\s*38rem 38rem,\s*auto;/
  );
  assert.doesNotMatch(
    mobile,
    /html:not\(\.dark\) \.surface-hero,\s*html:not\(\.dark\) \.surface-methodology/
  );
});

test("provides a full-bleed canvas for constrained sections", () => {
  assert.match(html, /\.surface-full-bleed\s*\{/);
  assert.match(html, /\.surface-full-bleed::before\s*\{/);
  assert.match(html, /inset:\s*0 calc\(50% - 50vw\)/);
  assert.match(html, /pointer-events:\s*none/);
});

const sectionMappings = [
  ["Cinematic Hero Section", "surface-hero"],
  ["By The Numbers (Success Rate)", "surface-results"],
  ["University Ribbon", "surface-universities"],
  ["Methodology", "surface-methodology"],
  ["Elite Programs", "surface-programs surface-full-bleed"],
  ["Meet The Mentors", "surface-mentors"],
  ["Verified Impact & Video Testimonials", "surface-track-record surface-full-bleed"],
];

test("maps every light section to the approved editorial sequence", () => {
  for (const [comment, classes] of sectionMappings) {
    const start = html.indexOf(comment);
    assert.notEqual(start, -1, `missing section comment: ${comment}`);
    const openingSection = html.slice(start, start + 320);
    for (const className of classes.split(" ")) {
      assert.ok(
        openingSection.includes(className),
        `${comment} is missing ${className}`,
      );
    }
  }
});

test("keeps the cinematic and closing sections dark", () => {
  for (const comment of ["Results & Quotes Ticker", "Final CTA"]) {
    const start = html.indexOf(comment);
    assert.notEqual(start, -1, `missing dark anchor: ${comment}`);
    const openingSection = html.slice(start, start + 320);
    assert.match(openingSection, /bg-(?:slate|zinc)-950/);
  }
});

test("keeps square grid textures out of methodology and the closing CTA", () => {
  const methodologyStart = html.indexOf("Methodology");
  const programsStart = html.indexOf("Elite Programs", methodologyStart);
  const methodology = html.slice(methodologyStart, programsStart);
  assert.doesNotMatch(methodology, /background-image:\s*linear-gradient/);

  const finalCtaStart = html.indexOf("Final CTA");
  const footerStart = html.indexOf("Footer", finalCtaStart);
  const finalCta = html.slice(finalCtaStart, footerStart);
  assert.doesNotMatch(finalCta, /background-image:\s*linear-gradient/);
});

test("defines the Balanced Premium responsive spacing utilities", () => {
  const style = html.slice(html.indexOf("<!-- Custom CSS classes -->"), html.indexOf("</style>", html.indexOf("<!-- Custom CSS classes -->")));

  for (const rule of [
    /\.section-space-major\s*\{[^}]*padding-block:\s*4rem;/s,
    /\.section-space-dense\s*\{[^}]*padding-block:\s*3\.5rem;/s,
    /\.section-space-band\s*\{[^}]*padding-block:\s*2\.5rem;/s,
    /\.section-intro-gap\s*\{[^}]*margin-bottom:\s*2rem;/s,
    /@media\s*\(min-width:\s*768px\)[\s\S]*?\.section-space-major\s*\{[^}]*padding-block:\s*5\.5rem;/,
    /@media\s*\(min-width:\s*1024px\)[\s\S]*?\.section-space-major\s*\{[^}]*padding-block:\s*8rem;/,
  ]) {
    assert.match(style, rule);
  }
});

test("maps sections to the Balanced Premium rhythm", () => {
  for (const surface of ["surface-methodology", "surface-programs", "surface-mentors", "surface-track-record"]) {
    assert.match(html, new RegExp(`<section[^>]*${surface}[^>]*section-space-major`));
  }
  assert.match(html, /<section[^>]*surface-results[^>]*section-space-dense/);
  assert.match(html, /<section[^>]*surface-universities[^>]*section-space-band/);
  assert.match(html, /<section[^>]*section-space-band[^>]*>[\s\S]*?Scrolling Track/);
  assert.match(html, /<section[^>]*section-space-major[^>]*scroll-reveal[^>]*>/);
  assert.match(html.match(/<footer[^>]*>/)?.[0] ?? "", /section-space-dense/);

  const body = html.slice(html.indexOf("</style>"));
  assert.equal((body.match(/section-intro-gap/g) ?? []).length, 4);
  assert.match(html, /class="lg:hidden"/);
  assert.doesNotMatch(html, /program-selector-clearance/);
  assert.doesNotMatch(html, /class="lg:hidden pb-24"/);
});

test("keeps the page from becoming a non-scrolling overflow ancestor of the sticky program stage", () => {
  const body = html.match(/<body[^>]*>/)?.[0] ?? "";

  assert.match(body, /overflow-x-clip/);
  assert.doesNotMatch(body, /overflow-x-hidden/);
});

test("uses a compact accessible Elite Programs mobile selector", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);

  assert.match(programs, /role="tablist"[^>]*aria-label="Choose a program"/);
  assert.equal((programs.match(/class="program-mobile-tab\b/g) ?? []).length, 4);
  assert.equal((programs.match(/role="tab"/g) ?? []).length, 4);
  assert.equal((programs.match(/aria-controls="program-mobile-panel"/g) ?? []).length, 4);
  assert.match(programs, /id="program-mobile-panel"[^>]*role="tabpanel"/);
  assert.doesNotMatch(programs, /Abstract geometric grid background/);
  assert.doesNotMatch(programs, /bg-\[size:24px_24px\]/);
});

test("uses the approved four Elite Programs categories across mobile and desktop", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);
  const approvedTitles = ["AP Prep", "1-on-1 Tutoring", "SAT Prep", "Competition Prep"];

  assert.equal((programs.match(/class="program-mobile-tab\b/g) ?? []).length, 4);
  assert.equal((programs.match(/class="program-list-item\b/g) ?? []).length, 4);
  assert.equal((programs.match(/role="tab"/g) ?? []).length, 4);
  assert.equal((programs.match(/aria-controls="program-mobile-panel"/g) ?? []).length, 4);

  for (const title of approvedTitles) {
    assert.ok(programs.includes(`>${title}<`), `missing selector title ${title}`);
  }

  assert.match(programs, /id="mobile-program-coverage"/);
  assert.match(programs, /id="stage-coverage"/);
  assert.doesNotMatch(programs, /class="program-acc-item\b/);
  assert.doesNotMatch(programs, />AP STEM<|>SAT Math<|>Mastery Engines<|>1-on-1 AP<|>University<|>Olympiad</);
});

test("drives Elite Programs from one guarded four-category data model", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);

  const dataSource = programs.match(/const PROGRAMS_DATA = (\[[\s\S]*?\n\s*\]);/)?.[1];
  assert.ok(dataSource, "PROGRAMS_DATA declaration is missing");
  assert.deepEqual(JSON.parse(dataSource), [
    { title: "AP Prep", coverage: "All AP STEM courses", desc: "Self-paced Mastery Engines, live programs, and private AP tutoring.", iconColor: "text-emerald-600 dark:text-emerald-400", glowColor: "rgba(16, 185, 129, 0.12)", cta: "Explore AP Prep", proof: "Complete AP STEM Pathway" },
    { title: "1-on-1 Tutoring", coverage: "High-school and university courses", desc: "Personalized tutoring matched to the student's exact course and goals.", iconColor: "text-violet-600 dark:text-violet-400", glowColor: "rgba(139, 92, 246, 0.12)", cta: "Find Your Tutor", proof: "Matched to Course and Goals" },
    { title: "SAT Prep", coverage: "SAT Math now, broader SAT later", desc: "Targeted instruction, practice, and score-improvement programs.", iconColor: "text-blue-600 dark:text-blue-400", glowColor: "rgba(59, 130, 246, 0.12)", cta: "Explore SAT Prep", proof: "Focused SAT Math Improvement" },
    { title: "Competition Prep", coverage: "AMC, AIME, F=ma, Physics Olympiad, and more", desc: "Advanced preparation for competitive STEM exams.", iconColor: "text-rose-600 dark:text-rose-400", glowColor: "rgba(244, 63, 94, 0.12)", cta: "Explore Competition Prep", proof: "Advanced STEM Competition Training" },
  ]);
  assert.match(programs, /if \(!Number\.isInteger\(idx\) \|\| idx < 0 \|\| idx >= PROGRAMS_DATA\.length\) return;/);
  assert.match(programs, /mobile-program-coverage['"]\)\.innerText = activeData\.coverage/);
  assert.match(programs, /stage-coverage['"]\)\.innerText = prog\.coverage/);
  assert.doesNotMatch(programs, /querySelectorAll\(['"]\.program-acc-item/);

});

test("renders desktop Elite Program choices as named pressed buttons", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);
  const desktopSelector = programs.match(/<div class="hidden lg:grid[\s\S]*?<div class="lg:col-span-7/)?.[0] ?? "";
  const approvedTitles = ["AP Prep", "1-on-1 Tutoring", "SAT Prep", "Competition Prep"];

  assert.match(desktopSelector, /id="programs-list"[^>]*role="group"[^>]*aria-label="Choose a program"/);
  assert.equal((desktopSelector.match(/<button\b[^>]*class="program-list-item\b/g) ?? []).length, 4);
  assert.doesNotMatch(desktopSelector, /<div\b[^>]*class="program-list-item\b/);

  for (const [index, title] of approvedTitles.entries()) {
    const control = desktopSelector.match(new RegExp(`<button[^>]*class="program-list-item[^>]*data-index="${index}"[^>]*>[\\s\\S]*?<h3[^>]*>${title}</h3>`))?.[0] ?? "";
    assert.match(control, /type="button"/);
    assert.match(control, new RegExp(`aria-label="Select ${title}"`));
    assert.match(control, /aria-pressed="(?:true|false)"/);
    assert.match(control, /tabindex="(?:0|-1)"/);
    assert.match(control, new RegExp(`onkeydown="handleProgramListKeydown\\(event, ${index}, this\\)"`));
  }

  assert.match(programs, /item\.setAttribute\('aria-pressed', String\(isActive\)\);/);
  assert.match(programs, /item\.tabIndex = isActive \? 0 : -1;/);
});

test("moves desktop Elite Program selection and focus with arrow keys", () => {
  const handlerSource = html.match(/function handleProgramListKeydown\(event, idx, source\) \{[\s\S]*?\n      \}/)?.[0];
  assert.ok(handlerSource, "desktop keyboard handler is missing");

  const focused = [];
  const selected = [];
  const controls = Array.from({ length: 4 }, (_, index) => ({
    focus() { focused.push(index); },
  }));
  const handler = new Function("document", "setActiveProgram", "PROGRAMS_DATA", `${handlerSource}; return handleProgramListKeydown;`)(
    { querySelectorAll(selector) { return selector === ".program-list-item" ? controls : []; } },
    (index, source) => selected.push([index, source]),
    Array.from({ length: 4 }),
  );

  const rightEvent = { key: "ArrowRight", prevented: false, preventDefault() { this.prevented = true; } };
  handler(rightEvent, 3, controls[3]);
  assert.equal(rightEvent.prevented, true);
  assert.deepEqual(focused, [0]);
  assert.deepEqual(selected, [[0, controls[0]]]);

  const endEvent = { key: "End", prevented: false, preventDefault() { this.prevented = true; } };
  handler(endEvent, 1, controls[1]);
  assert.equal(endEvent.prevented, true);
  assert.deepEqual(focused, [0, 3]);
  assert.deepEqual(selected, [[0, controls[0]], [3, controls[3]]]);
});

test("keeps the floating advisor from blocking content outside its visible controls", () => {
  const floatingStart = html.indexOf('id="floating-cta-container"');
  const floatingEnd = html.indexOf("// Scroll reveal observer", floatingStart);
  const floating = html.slice(floatingStart, floatingEnd);

  assert.match(floating, /id="floating-cta-container"[^>]*pointer-events-none/);
  assert.match(floating, /id="floating-cta-menu"[^>]*pointer-events-auto/);
  assert.match(floating, /aria-label="Speak with an Academic Advisor"[^>]*pointer-events-auto/);
  assert.doesNotMatch(floating, /classList\.remove\([^)]*['"]pointer-events-none['"]/);
});

test("hides the mobile advisor while Elite Programs is in view so it cannot cover the selector CTA", () => {
  const floatingStart = html.indexOf('// Floating CTA Logic');
  const floatingEnd = html.indexOf('// Scroll reveal observer', floatingStart);
  const floating = html.slice(floatingStart, floatingEnd);

  assert.match(floating, /let programsAdvisorIntersecting = false;/);
  assert.match(floating, /const shouldHideResults = resultsAdvisorMedia\.matches && resultsSectionIntersecting;/);
  assert.match(floating, /floatingCtaContainer\.classList\.toggle\('programs-advisor-hidden', programsAdvisorIntersecting\);/);
  assert.match(floating, /const programsAdvisorSection = document\.getElementById\('programs-container'\);/);
  assert.match(floating, /programsAdvisorIntersecting = entries\[0\]\.isIntersecting;/);
  assert.match(floating, /syncResultsAdvisorState\(\);/);
});

test("hides the desktop advisor while the Elite Programs stage is in view so it cannot cover its CTA", () => {
  const floatingStart = html.indexOf('// Floating CTA Logic');
  const floatingEnd = html.indexOf('// Scroll reveal observer', floatingStart);
  const floating = html.slice(floatingStart, floatingEnd);
  const sharedStyles = html.slice(0, html.indexOf('@media (max-width: 767px)'));

  assert.match(sharedStyles, /#floating-cta-container\.programs-advisor-hidden\s*\{[\s\S]*opacity:\s*0;[\s\S]*visibility:\s*hidden;[\s\S]*pointer-events:\s*none;/);
  assert.match(floating, /floatingCtaContainer\.classList\.toggle\('programs-advisor-hidden', programsAdvisorIntersecting\);/);
  assert.match(floating, /if \(programsAdvisorIntersecting && isCtaOpen\) \{/);
});

test("retains dark-mode backgrounds and accessible canonical mentor profiles", () => {
  for (const className of ["surface-results", "surface-methodology"]) {
    const section = html.match(new RegExp(`<section[^>]*${className}[^>]*>`))?.[0] ?? "";
    assert.match(section, /dark:bg-zinc-950/);
  }

  assert.deepEqual(extractMentorData(), expectedMentors);

  const mentorsSectionStart = html.indexOf("Meet The Mentors");
  const mentorsSectionEnd = html.indexOf("Results & Quotes Ticker", mentorsSectionStart);
  const mentorsSection = html.slice(mentorsSectionStart, mentorsSectionEnd);
  for (const [index, mentor] of expectedMentors.entries()) {
    const cardStart = mentorsSection.indexOf(`data-mentor-index="${index}"`);
    const nextCardStart = mentorsSection.indexOf(`data-mentor-index="${index + 1}"`);
    assert.notEqual(cardStart, -1, `mentor card ${index} is missing its scoped mapping`);
    const card = mentorsSection.slice(cardStart, nextCardStart === -1 ? undefined : nextCardStart);

    assert.ok(card.includes('role="button"'), `${mentor.name} card is missing button semantics`);
    assert.ok(card.includes('tabindex="0"'), `${mentor.name} card is not keyboard focusable`);
    assert.ok(
      card.includes(`onclick="openMentorModal(${index}, this)"`),
      `${mentor.name} card is wired to the wrong modal record`,
    );
    assert.ok(
      card.includes(`onkeydown="handleMentorCardKeydown(event, ${index}, this)"`),
      `${mentor.name} card is missing Enter/Space activation`,
    );
    for (const value of [mentor.name, mentor.role, mentor.bio, ...mentor.accolades]) {
      assert.ok(card.includes(value), `${mentor.name} card is missing canonical content: ${value}`);
    }
  }

  const modal = html.slice(html.indexOf('id="mentor-modal"'), html.indexOf("Floating Contact CTA"));
  for (const attribute of [
    'role="dialog"',
    'aria-modal="true"',
    'aria-labelledby="mentor-modal-name"',
    'aria-describedby="mentor-modal-bio"',
    'aria-hidden="true"',
    'id="mentor-modal-close"',
    'aria-label="Close mentor profile"',
  ]) {
    assert.ok(modal.includes(attribute), `mentor dialog is missing ${attribute}`);
  }

  assert.match(html, /mentorModalTrigger\?\.focus\(\)/);
  assert.match(html, /mentor-modal-close['"]\)\?\.focus\(\)/);
  assert.match(html, /event\.key === ['"]Enter['"] \|\| event\.key === ['"] ['"]/);
});

test("keeps the Olympiad preview free of graph-paper squares", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);

  assert.equal((programs.match(/USAPhO Simulator/g) ?? []).length, 1);
  assert.doesNotMatch(programs, /background-size:\s*12px 12px/);
  assert.doesNotMatch(programs, /linear-gradient\(white 1px, transparent 1px\)/);
  assert.equal((programs.match(/bg-gradient-to-br from-slate-700 via-slate-700 to-slate-800/g) ?? []).length, 1);
});

test("retains the approved Elite Program previews and AP pathway chips", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);

  for (const course of ["Biology", "Chemistry", "Physics", "Calculus", "Statistics", "Computer Science"]) {
    assert.match(programs, new RegExp(`<span[^>]*rounded-full[^>]*>${course}</span>`));
  }
  for (const delivery of ["Mastery Engine", "Live Programs", "Private Tutoring"]) {
    assert.match(programs, new RegExp(`>${delivery}<`));
  }

  for (const retainedMarker of [
    'object-[center_10%]',
    'Diagnostic to Current',
    'Goal: 800',
    'fR = Iα = (1/2 MR²) (a/R)',
  ]) {
    assert.ok(programs.includes(retainedMarker), `missing retained preview detail: ${retainedMarker}`);
  }
  assert.match(programs, /Find Your Tutor/);
  assert.doesNotMatch(programs, />Book Session</);
});

test("uses the approved calm hero motion classes", () => {
  const heroStart = html.indexOf("Cinematic Hero Section");
  const resultsStart = html.indexOf("By The Numbers", heroStart);
  const hero = html.slice(heroStart, resultsStart);

  assert.equal((hero.match(/hero-copy-enter/g) ?? []).length, 2);
  assert.equal((hero.match(/hero-badge-drift-a/g) ?? []).length, 1);
  assert.equal((hero.match(/hero-badge-drift-b/g) ?? []).length, 1);
  assert.match(hero, /hero-badge-drift-a rotate-6/);
  assert.match(hero, /hero-badge-drift-b -rotate-6/);
  assert.doesNotMatch(hero, /animate-float-(?:slow|fast)/);
  assert.doesNotMatch(hero, /hover:scale-105/);
  assert.match(hero, /hover:scale-\[1\.02\]/);

  const styles = html.slice(html.indexOf("<!-- Custom CSS classes -->"), html.indexOf("</head>"));
  assert.match(styles, /@keyframes hero-badge-drift/);
  assert.match(styles, /transform:\s*translateY\(-5px\)/);
  assert.match(styles, /animation:\s*hero-badge-drift 12s/);
  assert.match(styles, /animation:\s*hero-badge-drift 14s/);
  assert.match(styles, /\.hero-badge-drift-a\s*\{\s*--hero-badge-rotation:\s*6deg;/);
  assert.match(styles, /\.hero-badge-drift-b\s*\{\s*--hero-badge-rotation:\s*-6deg;/);
  assert.match(styles, /transform:\s*translateY\(-5px\) rotate\(var\(--hero-badge-rotation\)\)/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.hero-copy-enter/);
  assert.match(styles, /\.hero-badge-drift-a,\s*\.hero-badge-drift-b\s*\{\s*animation:\s*none;\s*transform:\s*none;/s);
});

test("releases hero entrance opacity to the scroll controller after entry", () => {
  const styles = html.slice(html.indexOf("<!-- Custom CSS classes -->"), html.indexOf("</head>"));
  const heroCopyRule = styles.match(/\.hero-copy-enter\s*\{[^}]+\}/)?.[0] ?? "";

  assert.match(heroCopyRule, /animation:\s*hero-copy-enter[^;]*\bbackwards\s*;/);
  assert.doesNotMatch(heroCopyRule, /\bboth\b/);
});

test("schedules bounded and reduced-motion-aware hero scroll growth", () => {
  const heroMotion = heroMotionSource;

  assert.match(heroMotion, /const HERO_MOTION_RANGE = 320/);
  assert.match(heroMotion, /const desktopMaxScale = 1\.06/);
  assert.match(heroMotion, /const mobileMaxScale = 1\.03/);
  assert.match(heroMotion, /const copyOpacity = 1 - progress \* 0\.65/);
  assert.match(heroMotion, /requestAnimationFrame\(updateHeroMotion\)/);
  assert.match(heroMotion, /prefers-reduced-motion:\s*reduce/);
  assert.match(heroMotion, /scale\(\$\{scale\}\)/);
  assert.doesNotMatch(heroMotion, /translateY\(/);
  assert.doesNotMatch(heroMotion, /addEventListener\('scroll',\s*\(\)\s*=>/);
});

test("does not repeat reduced-motion style writes across scheduled scroll frames", () => {
  const harness = createHeroMotionHarness({ reducedMotion: true });

  harness.flushAnimationFrames();
  assert.equal(harness.takeMutations().length, 4);

  for (const scrollY of [160, 480, 960]) {
    harness.dispatchScroll(scrollY);
    harness.flushAnimationFrames();
  }

  assert.deepEqual(harness.takeMutations(), []);
});

test("reapplies the current hero state when reduced-motion preference changes", () => {
  const harness = createHeroMotionHarness({ reducedMotion: true, scrollY: 160 });

  harness.flushAnimationFrames();
  harness.takeMutations();
  harness.setReducedMotion(false);
  harness.flushAnimationFrames();

  assert.equal(harness.elements["hero-copy"].style.opacity, "0.675");
  assert.equal(harness.elements["hero-card-container"].style.transform, "scale(1.03)");
  assert.equal(harness.takeMutations().length, 4);

  harness.setReducedMotion(true);
  harness.flushAnimationFrames();

  assert.equal(harness.elements["hero-copy"].style.opacity, "1");
  assert.equal(harness.elements["hero-card-container"].style.transform, "scale(1)");
  assert.equal(harness.takeMutations().length, 4);
});

test("does not update the hero spotlight for a wide coarse-pointer viewport", () => {
  const harness = createHeroMotionHarness({ finePointer: false, innerWidth: 1440 });

  harness.flushAnimationFrames();
  harness.takeMutations();
  harness.dispatchHeroMousemove({ clientX: 400, clientY: 300 });
  harness.flushAnimationFrames();

  assert.equal(harness.elements["hero-spotlight"].style.background, undefined);
  assert.deepEqual(harness.takeMutations(), []);
});

test("drops a queued spotlight update when pointer eligibility changes", () => {
  const harness = createHeroMotionHarness({ finePointer: true, innerWidth: 1440 });

  harness.flushAnimationFrames();
  harness.takeMutations();
  harness.dispatchHeroMousemove({ clientX: 400, clientY: 300 });
  harness.setFinePointer(false);
  harness.flushAnimationFrames();

  assert.equal(harness.elements["hero-spotlight"].style.background, undefined);
  assert.deepEqual(harness.takeMutations(), []);
});

test("uses the approved optical typography only on the hero headlines", () => {
  const desktopHero = html.match(/<div id="hero-copy"[\s\S]*?<\/h1>/)?.[0] ?? "";
  const mobileHero = html.match(/<div id="hero-copy-mobile"[\s\S]*?<\/h1>/)?.[0] ?? "";

  assert.match(desktopHero, /<h1 class="[^"]*lg:text-\[68px\][^"]*xl:text-7xl[^"]*font-extrabold[^"]*leading-\[1\.02\][^"]*tracking-\[-0\.04em\][^"]*">/);
  assert.match(desktopHero, /<h1 class="[^"]*xl:leading-\[1\.02\][^"]*">/);
  assert.match(desktopHero, /<span class="[^"]*font-black[^"]*">\s*Secure your/);
  assert.match(mobileHero, /<h1 class="[^"]*text-4xl[^"]*sm:text-5xl[^"]*font-extrabold[^"]*leading-\[1\.08\][^"]*tracking-\[-0\.035em\][^"]*">/);
  assert.match(mobileHero, /<h1 class="[^"]*sm:leading-\[1\.08\][^"]*">/);
  assert.match(mobileHero, /<span class="[^"]*font-black[^"]*">\s*Secure your/);
  assert.equal((html.match(/lg:text-\[68px\]/g) ?? []).length, 1);
  assert.equal((html.match(/tracking-\[-0\.035em\]/g) ?? []).length, 1);
});

test("keeps final results values and the approved qualifier in HTML", () => {
  const results = html.match(/<section id="results-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(results, /class="count-up" data-target="1200">1,200<\/span>/);
  assert.match(results, /class="count-up" data-target="77">77<\/span>/);
  assert.match(results, /class="count-up" data-target="21">21<\/span>/);
  assert.match(results, /Based on AP exam outcomes reported by participating students\./);
});

test("uses one synchronized reduced-motion-aware results counter", () => {
  const controller = html.slice(html.indexOf("// Results Count-Up"), html.indexOf("// Floating CTA Logic"));
  assert.match(controller, /const RESULTS_COUNT_DURATION = 1400/);
  assert.match(controller, /const easedProgress = 1 - Math\.pow\(1 - progress, 3\)/);
  assert.match(controller, /new IntersectionObserver\([\s\S]*threshold:\s*0\.35/);
  assert.match(controller, /observe\(resultsSection\)/);
  assert.match(controller, /prefers-reduced-motion:\s*reduce/);
  assert.match(controller, /cancelAnimationFrame\(resultsCountFrame\)/);
  assert.doesNotMatch(controller, /forEach\([^)]*=>\s*resultsObserver\.observe/);
});

const resultsCountStart = html.indexOf("// Results Count-Up");
const resultsCountEnd = html.indexOf("// Floating CTA Logic", resultsCountStart);
const resultsCountSource = html.slice(resultsCountStart, resultsCountEnd);

function createResultsCountHarness({ reducedMotion = false } = {}) {
  const animationFrames = new Map();
  const observers = [];
  let nextAnimationFrame = 1;
  let cancelledAnimationFrame = null;
  const mediaListeners = [];
  const countElements = [1200, 77, 21].map(target => ({
    dataset: { target: String(target) },
    textContent: target.toLocaleString("en-US"),
  }));
  const resultsSection = {
    id: "results-section",
    querySelectorAll: selector => selector === ".count-up" ? countElements : [],
  };

  const mediaQuery = {
    matches: reducedMotion,
    addEventListener(type, listener) {
      if (type === "change") mediaListeners.push(listener);
    },
    setMatches(matches) {
      this.matches = matches;
      for (const listener of mediaListeners) listener({ matches });
    },
  };

  class HarnessIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observed = [];
      this.unobserved = [];
      observers.push(this);
    }

    observe(element) {
      this.observed.push(element);
    }

    unobserve(element) {
      this.unobserved.push(element);
    }

    intersect(element = resultsSection) {
      this.callback([{ isIntersecting: true, target: element }]);
    }
  }

  function requestAnimationFrame(callback) {
    const frame = nextAnimationFrame++;
    animationFrames.set(frame, callback);
    return frame;
  }

  function cancelAnimationFrame(frame) {
    cancelledAnimationFrame = frame;
    animationFrames.delete(frame);
  }

  const window = {
    matchMedia: () => mediaQuery,
    requestAnimationFrame,
    cancelAnimationFrame,
  };

  runInNewContext(resultsCountSource, {
    IntersectionObserver: HarnessIntersectionObserver,
    document: {
      getElementById: id => id === "results-section" ? resultsSection : null,
    },
    window,
  });

  return {
    countElements,
    observer: observers[0],
    get scheduledFrameCount() {
      return animationFrames.size;
    },
    get cancelledAnimationFrame() {
      return cancelledAnimationFrame;
    },
    runNextFrame(timestamp) {
      const [frame, callback] = animationFrames.entries().next().value ?? [];
      if (frame === undefined) return;
      animationFrames.delete(frame);
      callback(timestamp);
    },
    intersect() {
      observers[0]?.intersect();
    },
    setReducedMotion(matches) {
      mediaQuery.setMatches(matches);
    },
  };
}

test("keeps final results values until the results section intersects", () => {
  const harness = createResultsCountHarness();
  assert.deepEqual(harness.countElements.map(element => element.textContent), ["1,200", "77", "21"]);
});

test("observes only the results section at the approved threshold", () => {
  const harness = createResultsCountHarness();
  assert.equal(harness.observer.options.threshold, 0.35);
  assert.equal(harness.observer.observed.length, 1);
  assert.equal(harness.observer.observed[0].id, "results-section");
});

test("counts all result metrics in one shared animation frame", () => {
  const harness = createResultsCountHarness();
  harness.intersect();
  assert.deepEqual(harness.countElements.map(element => element.textContent), ["0", "0", "0"]);
  assert.equal(harness.scheduledFrameCount, 1);

  harness.runNextFrame(0);
  harness.runNextFrame(700);
  assert.deepEqual(harness.countElements.map(element => element.textContent), ["1,050", "67", "18"]);

  harness.runNextFrame(1400);
  assert.deepEqual(harness.countElements.map(element => element.textContent), ["1,200", "77", "21"]);
  assert.equal(harness.observer.unobserved.length, 1);
  assert.equal(harness.observer.unobserved[0].id, "results-section");
});

test("does not replay the results count after its first intersection", () => {
  const harness = createResultsCountHarness();
  harness.intersect();
  harness.runNextFrame(0);
  harness.runNextFrame(1400);
  harness.intersect();
  assert.equal(harness.scheduledFrameCount, 0);
  assert.deepEqual(harness.countElements.map(element => element.textContent), ["1,200", "77", "21"]);
});

test("shows final results without observing or animating when reduced motion is initial", () => {
  const harness = createResultsCountHarness({ reducedMotion: true });
  assert.deepEqual(harness.countElements.map(element => element.textContent), ["1,200", "77", "21"]);
  assert.equal(harness.observer, undefined);
  assert.equal(harness.scheduledFrameCount, 0);
});

test("finishes the results count when reduced motion becomes active", () => {
  const harness = createResultsCountHarness();
  harness.intersect();
  harness.runNextFrame(0);
  const scheduledFrameCount = harness.scheduledFrameCount;
  harness.setReducedMotion(true);
  assert.equal(scheduledFrameCount, 1);
  assert.equal(harness.cancelledAnimationFrame, 2);
  assert.equal(harness.scheduledFrameCount, 0);
  assert.deepEqual(harness.countElements.map(element => element.textContent), ["1,200", "77", "21"]);
  assert.equal(harness.observer.unobserved.length, 2);
  assert.equal(harness.observer.unobserved.at(-1).id, "results-section");
});

test("hides the advisor over mobile results and uses a single accessible bottom sheet elsewhere", () => {
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.results-advisor-hidden/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open[\s\S]*#floating-cta-menu/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open[\s\S]*#floating-cta-toggle[\s\S]*display:\s*none/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open #floating-cta-backdrop\s*\{[\s\S]*z-index:\s*0/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open #floating-cta-backdrop\s*\{[\s\S]*pointer-events:\s*auto/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open #floating-cta-menu\s*\{[\s\S]*z-index:\s*1/);
  assert.match(html, /id="floating-cta-menu"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="floating-cta-title"/);
  assert.match(html, /id="floating-cta-title"/);
  assert.doesNotMatch(html, /results-advisor-compact/);
});

test("uses a booking-first advisor conversion panel in the open mobile sheet", () => {
  const advisorMenuStart = html.indexOf('id="floating-cta-menu"');
  const advisorMenuEnd = html.indexOf('id="floating-cta-toggle"', advisorMenuStart);
  const advisorMenu = html.slice(advisorMenuStart, advisorMenuEnd);
  const sharedAdvisorStyles = html.slice(0, html.indexOf("@media (max-width: 767px)"));
  const bookingLinkStart = advisorMenu.indexOf('id="advisor-booking-link"');
  const bookingLink = advisorMenu.slice(bookingLinkStart, advisorMenu.indexOf("</a>", bookingLinkStart));
  const whatsappLinkStart = advisorMenu.indexOf('id="advisor-whatsapp-link"');
  const whatsappLink = advisorMenu.slice(whatsappLinkStart, advisorMenu.indexOf("</a>", whatsappLinkStart));

  assert.match(html, /id="floating-cta-handle"[^>]*aria-hidden="true"/);
  assert.match(html, /id="floating-cta-title"[^>]*>[\s\S]*class="md:hidden"[^>]*>How can we help\?<\/span>/);
  assert.match(html, /class="advisor-sheet-subtitle[^>]*>Connect with our academic team\.<\/p>/);
  assert.equal((advisorMenu.match(/id="advisor-booking-link"/g) ?? []).length, 1);
  assert.match(advisorMenu, /id="advisor-booking-link"[^>]*href="https:\/\/cal\.com\/your-booking-link"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
  assert.match(bookingLink, /<span>Book a Consultation<\/span>/);
  assert.match(
    bookingLink,
    /<svg[^>]*class="[^"]*advisor-booking-calendar[^"]*"[^>]*aria-hidden="true"[^>]*>[\s\S]*<rect x="3" y="4" width="18" height="18" rx="2" ry="2"\/>[\s\S]*<line x1="16" y1="2" x2="16" y2="6"\/>[\s\S]*<line x1="8" y1="2" x2="8" y2="6"\/>[\s\S]*<line x1="3" y1="10" x2="21" y2="10"\/>[\s\S]*<\/svg>[\s\S]*<span>Book a Consultation<\/span>/
  );
  assert.doesNotMatch(bookingLink, /<path d="m9 18 6-6-6-6"\/>/);
  assert.match(advisorMenu, /class="advisor-booking-copy[^>]*>Choose a convenient time to discuss your student’s goals\.<\/p>/);
  assert.match(
    sharedAdvisorStyles,
    /\.advisor-booking-copy\s*\{[\s\S]*margin:\s*0\.125rem 0\.25rem;[\s\S]*font-size:\s*0\.75rem;[\s\S]*line-height:\s*1rem;[\s\S]*text-align:\s*center;/
  );
  assert.match(
    advisorMenu,
    /<p class="advisor-booking-copy text-muted-foreground">Choose a convenient time to discuss your student’s goals\.<\/p>/
  );
  assert.match(advisorMenu, /BOOKING_URL_PLACEHOLDER: replace this URL with the production scheduling link\./);
  assert.equal((advisorMenu.match(/id="advisor-whatsapp-link"/g) ?? []).length, 1);
  assert.match(advisorMenu, /id="advisor-whatsapp-link"[^>]*href="https:\/\/wa\.me\/18001234567"[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
  assert.match(whatsappLink, /<span>Prefer to message us\? <strong>Chat on WhatsApp<\/strong><\/span>/);
  assert.doesNotMatch(advisorMenu, /tel:\+18001234567|mailto:admissions@masteryourcourses\.com|Call an Advisor|Email Admissions/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*border-radius:\s*1\.5rem/);
  assert.match(html, /\.advisor-booking-primary,\s*\.advisor-booking-secondary\s*\{[\s\S]*min-height:\s*2\.75rem/);
  assert.match(html, /@media \(max-width:\s*767px\) and \(prefers-reduced-motion:\s*reduce\)[\s\S]*#floating-cta-menu[\s\S]*transition-duration:\s*0\.01ms/);
  assert.match(html, /@media \(max-width:\s*767px\) and \(prefers-reduced-motion:\s*reduce\)[\s\S]*#floating-cta-container\.advisor-menu-open #floating-cta-menu,[\s\S]*#floating-cta-container\.advisor-menu-open #floating-cta-backdrop/);
});

test("polishes the mobile concierge focus treatment and inset geometry", () => {
  assert.match(html, /#floating-cta-container\.advisor-menu-open #floating-cta-menu\s*\{[\s\S]*left:\s*0\.5rem;[\s\S]*right:\s*0\.5rem;[\s\S]*bottom:\s*0\.5rem;[\s\S]*width:\s*auto/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open #floating-cta-menu\s*\{[\s\S]*border-radius:\s*1\.5rem/);
  assert.match(html, /\.advisor-booking-primary:focus-visible,[\s\S]*\.advisor-booking-secondary:focus-visible\s*\{[\s\S]*outline:\s*none;[\s\S]*box-shadow:\s*0 0 0 3px/);
  assert.match(html, /\.advisor-booking-panel\s*\{[\s\S]*border:\s*1px solid hsl\(var\(--border\) \/ 0\.6\)/);
  assert.match(html, /#floating-cta-handle\s*\{[\s\S]*top:\s*0\.375rem/);
  assert.match(html, /\.advisor-sheet-header #floating-cta-close\s*\{[\s\S]*top:\s*0/);
  assert.match(html, /class="advisor-booking-panel[^\"]*md:flex[^\"]*md:flex-col/);
});

test("centers the mobile advisor heading independently of its close control", () => {
  const mobileMarker = "@media (max-width: 767px)";
  const mobileCss = extractCssBlock(html, mobileMarker);
  const sharedCss = html.slice(0, html.indexOf(mobileMarker));

  assert.match(mobileCss, /\.advisor-sheet-header\s*\{[^}]*padding:\s*0\.5rem 3rem 0\.25rem\s*;[^}]*\}/);
  assert.doesNotMatch(mobileCss, /\.advisor-sheet-header\s*\{[^}]*padding:\s*0\.5rem 3rem 0\.25rem 0\.25rem\s*;/);
  assert.match(mobileCss, /\.advisor-sheet-header\s*>\s*div\s*\{[^}]*width:\s*100%\s*;[^}]*text-align:\s*center\s*;[^}]*\}/);
  assert.doesNotMatch(sharedCss, /\.advisor-sheet-header\s*>\s*div\s*\{/);
  assert.match(html, /\.advisor-sheet-header #floating-cta-close\s*\{[\s\S]*position:\s*absolute;[\s\S]*right:\s*0/);
  assert.match(html, /id="floating-cta-close"[^>]*class="[^"]*h-11[^"]*w-11/);
  assert.match(html, /id="floating-cta-close"[\s\S]*?<svg class="lucide w-5 h-5"/);
});

test("uses restrained focus treatments for the mobile advisor controls", () => {
  assert.match(html, /#floating-cta-close:focus-visible\s*\{[\s\S]*outline:\s*none;[\s\S]*box-shadow:\s*inset 0 0 0 2px rgb\(99 102 241 \/ 0\.5\)/);
  assert.match(html, /#floating-cta-toggle:focus-visible\s*\{[\s\S]*outline:\s*none;[\s\S]*box-shadow:[^;]*0 0 0 2px hsl\(var\(--background\)\)[^;]*0 0 0 4px rgb\(99 102 241 \/ 0\.42\)/);
  assert.doesNotMatch(html, /id="floating-cta-close"[^>]*focus-visible:ring-2/);
  assert.match(html, /id="floating-cta-close"[^>]*class="[^"]*advisor-close-control/);
  assert.match(html, /id="floating-cta-toggle"[^>]*class="[^"]*advisor-trigger-control/);
});

test("keeps the added concierge hooks constrained at desktop popup widths", () => {
  const sharedAdvisorStyles = html.slice(0, html.indexOf("@media (max-width: 767px)"));

  assert.match(html, /class="advisor-sheet-header[^"]*md:flex[^"]*md:items-center[^"]*md:justify-between/);
  assert.match(html, /class="advisor-booking-panel[^\"]*md:flex[^\"]*md:flex-col/);
  assert.doesNotMatch(html, /class="advisor-booking-panel[^"]*md:gap-3/);
  assert.doesNotMatch(html, /id="advisor-booking-link"[^>]*class="[^"]*md:min-h-\[44px\]/);
  assert.match(html, /class="advisor-booking-secondary[^\"]*md:min-h-\[44px\]/);
  assert.match(sharedAdvisorStyles, /\.advisor-booking-panel\s*\{[\s\S]*display:\s*flex;[\s\S]*border-radius:\s*1rem/);
  assert.match(sharedAdvisorStyles, /\.advisor-booking-primary,\s*\.advisor-booking-secondary\s*\{[\s\S]*display:\s*flex;[\s\S]*min-height:\s*2\.75rem;[\s\S]*border-radius:\s*0\.75rem/);
  assert.match(sharedAdvisorStyles, /\.advisor-booking-panel\s*\{[\s\S]*gap:\s*0\.375rem;[\s\S]*padding:\s*0\.5rem/);
  assert.match(sharedAdvisorStyles, /\.advisor-booking-primary\s*\{[\s\S]*justify-content:\s*center;[\s\S]*gap:\s*0\.5rem;[\s\S]*min-height:\s*3\.375rem/);
  assert.match(sharedAdvisorStyles, /\.advisor-booking-calendar\s*\{[\s\S]*flex:\s*0 0 auto/);
  assert.match(sharedAdvisorStyles, /\.advisor-booking-secondary\s*\{[\s\S]*min-height:\s*2\.75rem;[\s\S]*padding:\s*0\.25rem 0\.5rem/);
  assert.match(sharedAdvisorStyles, /\.advisor-booking-primary\s*\{[\s\S]*background:\s*rgb\(67 56 202\);[\s\S]*color:\s*white/);
  assert.match(sharedAdvisorStyles, /\.advisor-booking-secondary\s*\{[\s\S]*color:\s*hsl\(var\(--muted-foreground\)\)/);
  assert.match(sharedAdvisorStyles, /\.advisor-booking-primary:focus-visible,\s*\.advisor-booking-secondary:focus-visible\s*\{[\s\S]*outline:\s*none;[\s\S]*box-shadow:\s*0 0 0 3px/);
});

test("uses breakpoint-specific visible and accessible advisor headings", () => {
  assert.match(html, /id="floating-cta-menu"[^>]*aria-labelledby="floating-cta-title"/);
  assert.match(html, /id="floating-cta-title"[^>]*>[\s\S]*class="md:hidden"[^>]*>How can we help\?<\/span>[\s\S]*class="hidden md:inline"[^>]*>Speak with an Advisor<\/span>[\s\S]*<\/h3>/);
});

test("closes the normal-motion mobile advisor faster than it opens", () => {
  assert.match(html, /#floating-cta-container\.advisor-menu-open #floating-cta-menu\s*\{[\s\S]*transform 280ms/);
  assert.match(html, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-menu\s*\{[\s\S]*transition:[^;]*transform 200ms/);
  assert.match(html, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-backdrop\s*\{[\s\S]*transition:[^;]*opacity 180ms/);
});

test("keeps the compact concierge below the recorded mobile height target without changing the desktop popup", () => {
  const mobileCss = extractCssBlock(html, "@media (max-width: 767px)");

  assert.match(html, /\.advisor-booking-primary,\s*\.advisor-booking-secondary\s*\{[\s\S]*min-height:\s*2\.75rem/);
  assert.match(mobileCss, /\.advisor-sheet-header\s*\{[^}]*padding:\s*0\.5rem 3rem 0\.25rem\s*;[^}]*\}/);
  assert.match(html, /\.advisor-sheet-header #floating-cta-close\s*\{[\s\S]*position:\s*absolute/);
  assert.match(html, /#floating-cta-title\s*\{[\s\S]*line-height:\s*1\.125rem/);
  assert.match(html, /\.advisor-sheet-subtitle\s*\{[\s\S]*line-height:\s*0\.75rem/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open #floating-cta-menu\s*\{[\s\S]*padding:\s*0 0\.75rem max\(0\.25rem, env\(safe-area-inset-bottom\)\)/);
  assert.match(html, /id="floating-cta-handle"[^>]*class="[^"]*md:hidden/);
  assert.match(html, /class="advisor-sheet-subtitle[^"]*md:hidden/);
  assert.match(html, /id="floating-cta-close"[^>]*class="[^"]*h-11[^"]*w-11/);
  assert.doesNotMatch(html, /id="floating-cta-close"[^>]*class="[^"]*md:h-auto|id="floating-cta-close"[^>]*class="[^"]*md:w-auto|id="floating-cta-close"[^>]*class="[^"]*md:p-1/);
});

test("scopes reduced concierge motion to mobile open and closing states", () => {
  assert.match(html, /@media \(max-width:\s*767px\) and \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open #floating-cta-menu,[\s\S]*#floating-cta-menu\.opacity-0,[\s\S]*#floating-cta-container\.advisor-menu-open #floating-cta-backdrop,[\s\S]*#floating-cta-backdrop\.opacity-0\s*\{[\s\S]*transition-duration:\s*0\.01ms/);
  assert.match(html, /#floating-cta-container\.advisor-menu-open #floating-cta-menu,[\s\S]*#floating-cta-menu\.opacity-0\s*\{[\s\S]*transform:\s*translateY\(0\) scale\(1\)/);
  assert.match(html, /transition-duration:\s*0\.01ms !important/);
});

test("keeps the closed mobile advisor circular while it transitions into the results-hidden state", () => {
  const triggerStart = html.indexOf('id="floating-cta-toggle"');
  const triggerEnd = html.indexOf('</button>', triggerStart);
  const trigger = html.slice(triggerStart, triggerEnd);
  const mobileStart = html.indexOf('@media (max-width: 767px)');
  const nextMedia = html.indexOf('@media ', mobileStart + 1);
  const mobileStyles = html.slice(mobileStart, nextMedia);

  assert.match(trigger, /class="[^"]*advisor-trigger-calendar[^"]*"[^>]*aria-hidden="true"/);
  assert.match(trigger, /class="[^"]*advisor-trigger-phone[^"]*"[^>]*aria-hidden="true"/);
  assert.match(trigger, /id="floating-cta-ping"/);
  assert.match(
    mobileStyles,
    /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle\s*\{[^}]*width:\s*3\.5rem;[^}]*height:\s*3\.5rem;[^}]*border:\s*1px solid rgb\(255 255 255 \/ 0\.76\);[^}]*box-shadow:\s*0 8px 22px rgb\(67 56 202 \/ 0\.2\);/
  );
  assert.match(
    mobileStyles,
    /\.advisor-trigger-calendar\s*\{[^}]*display:\s*block;[^}]*margin:\s*0 auto;[^}]*flex:\s*0 0 auto;/
  );
  assert.doesNotMatch(
    mobileStyles,
    /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle\s*\{[^}]*border:\s*2px/
  );
  assert.match(mobileStyles, /\.advisor-trigger-phone,[\s\S]*#floating-cta-ping\s*\{[\s\S]*display:\s*none/);
  assert.match(
    mobileStyles,
    /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle:focus-visible\s*\{[^}]*box-shadow:\s*0 8px 22px rgb\(67 56 202 \/ 0\.2\),\s*0 0 0 3px rgb\(99 102 241 \/ 0\.5\);/
  );
  assert.match(mobileStyles, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle:active\s*\{[\s\S]*transform:\s*scale\(0\.96\)/);
  const sharedStyles = html.slice(0, mobileStart);
  assert.match(sharedStyles, /\.advisor-trigger-calendar\s*\{\s*display:\s*none;\s*\}/);
  assert.doesNotMatch(sharedStyles, /\.advisor-trigger-phone\s*\{[\s\S]*display:\s*none|#floating-cta-ping\s*\{[\s\S]*display:\s*none/);

  const mobileCss = mobileStyles;
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*#floating-cta-container:not\(\.advisor-menu-open\)\s*\{[\s\S]*left:\s*auto;[\s\S]*width:\s*3\.5rem/);
  assert.match(html, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle\s*\{[\s\S]*width:\s*3\.5rem;[\s\S]*height:\s*3\.5rem/);
  assert.match(html, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-toggle-content\s*\{[\s\S]*width:\s*3\.5rem;[\s\S]*height:\s*3\.5rem;[\s\S]*padding:\s*0/);
  assert.match(html, /#floating-cta-container:not\(\.advisor-menu-open\) #floating-cta-label,[\s\S]*#floating-cta-chevron\s*\{[\s\S]*display:\s*none/);
  assert.doesNotMatch(mobileCss, /#floating-cta-container:not\(\.advisor-menu-open\):not\(\.results-advisor-hidden\)/);
  assert.match(html, /id="floating-cta-toggle"[^>]*aria-label="Speak with an Academic Advisor"/);
  assert.ok(mobileCss.length > 0);
});

test("coordinates results visibility, modal focus, and desktop preservation", () => {
  const controller = html.slice(html.indexOf("// Floating CTA Logic"), html.indexOf("// Scroll reveal observer"));
  assert.match(controller, /function setFloatingCtaOpen\(nextOpen/);
  assert.match(controller, /results-advisor-hidden/);
  assert.match(controller, /event\.key === 'Escape'/);
  assert.match(controller, /event\.key === 'Tab'/);
  assert.match(controller, /floatingCtaToggle\?\.focus/);
  assert.match(controller, /resultsAdvisorMedia\.matches/);
});

const floatingCtaStart = html.indexOf("// Floating CTA Logic");
const floatingCtaEnd = html.indexOf("  </script>", floatingCtaStart);
const floatingCtaSource = html.slice(floatingCtaStart, floatingCtaEnd);

function createResultsAdvisorHarness({ mobile = true } = {}) {
  const observers = [];
  const mediaListeners = [];
  const documentListeners = new Map();
  const documentState = { activeElement: null };
  const toggleAttributes = new Map([["aria-expanded", "false"]]);
  const classList = (initial = []) => {
    const classes = new Set(initial);
    return {
      add: (...tokens) => tokens.forEach(token => classes.add(token)),
      remove: (...tokens) => tokens.forEach(token => classes.delete(token)),
      toggle: (token, force) => {
        const enabled = force ?? !classes.has(token);
        if (enabled) classes.add(token); else classes.delete(token);
        return enabled;
      },
      contains: token => classes.has(token),
    };
  };
  const focusableElements = ["floating-cta-close", "advisor-booking-link", "advisor-whatsapp-link"].map(id => ({
    id,
    disabled: false,
    focused: false,
    hasAttribute(name) { return name === "disabled" && this.disabled; },
    focus() { this.focused = true; },
  }));
  const elements = {
    "results-section": { id: "results-section" },
    "floating-cta-container": { classList: classList(["opacity-0", "translate-y-8"]) },
    "floating-cta-menu": {
      classList: classList(),
      querySelectorAll: () => focusableElements,
    },
    "floating-cta-backdrop": { classList: classList() },
    "floating-cta-ping": { style: {} },
    "floating-cta-chevron": { classList: classList() },
    "floating-cta-toggle": {
      classList: classList(),
      setAttribute: (name, value) => toggleAttributes.set(name, value),
      getAttribute: name => toggleAttributes.get(name) ?? null,
      focus() { this.focused = true; },
      focused: false,
    },
  };
  const mediaQuery = {
    matches: mobile,
    addEventListener(type, listener) {
      if (type === "change") mediaListeners.push(listener);
    },
    setMatches(matches) {
      this.matches = matches;
      mediaListeners.forEach(listener => listener({ matches }));
    },
  };
  class HarnessIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observed = [];
      observers.push(this);
    }
    observe(element) { this.observed.push(element); }
    intersect(isIntersecting, { bottom = isIntersecting ? 100 : -1 } = {}) {
      this.callback([{ isIntersecting, boundingClientRect: { bottom }, target: elements["results-section"] }]);
    }
  }
  const windowListeners = new Map();
  const scheduledTimeouts = [];
  const window = {
    scrollY: 0,
    matchMedia: () => mediaQuery,
    addEventListener(type, listener) { windowListeners.set(type, listener); },
    setTimeout() {},
  };
  runInNewContext(floatingCtaSource, {
    IntersectionObserver: HarnessIntersectionObserver,
    document: {
      getElementById: id => elements[id] ?? null,
      addEventListener(type, listener) { documentListeners.set(type, listener); },
      get activeElement() { return documentState.activeElement; },
    },
    resultsSection: elements["results-section"],
    setTimeout(callback) { scheduledTimeouts.push(callback); },
    window,
  });
  return {
    container: elements["floating-cta-container"],
    ping: elements["floating-cta-ping"],
    toggle: elements["floating-cta-toggle"],
    menu: elements["floating-cta-menu"],
    focusableElements,
    intersect(isIntersecting, geometry) { observers.at(-1)?.intersect(isIntersecting, geometry); },
    scroll(y) {
      window.scrollY = y;
      windowListeners.get("scroll")?.();
    },
    runRevealTimer() { scheduledTimeouts[0]?.(); },
    toggleMenu() { window.toggleFloatingCTA(); },
    mediaChange(matches) { mediaQuery.setMatches(matches); },
    keydown(key, { shiftKey = false, activeElement } = {}) {
      documentState.activeElement = activeElement ?? null;
      const event = { key, shiftKey, target: activeElement, prevented: false, preventDefault() { this.prevented = true; } };
      documentListeners.get("keydown")?.(event);
      return event;
    },
  };
}

test("reveals the mobile advisor only after Results has been entered and exited", () => {
  const mobile = createResultsAdvisorHarness();

  mobile.scroll(301);
  mobile.runRevealTimer();
  assert.equal(mobile.container.classList.contains("opacity-0"), true);

  mobile.intersect(true);
  assert.equal(mobile.container.classList.contains("results-advisor-hidden"), true);
  assert.equal(mobile.container.classList.contains("opacity-0"), true);

  mobile.intersect(false);
  assert.equal(mobile.container.classList.contains("results-advisor-hidden"), false);
  assert.equal(mobile.container.classList.contains("opacity-0"), false);
  assert.equal(mobile.container.classList.contains("translate-y-8"), false);
});

test("hides the mobile advisor throughout results and restores its full trigger after exit", () => {
  const mobile = createResultsAdvisorHarness();
  mobile.toggleMenu();
  assert.equal(mobile.container.classList.contains("advisor-menu-open"), true);

  mobile.intersect(true);
  assert.equal(mobile.container.classList.contains("results-advisor-hidden"), true);
  assert.equal(mobile.container.classList.contains("advisor-menu-open"), false);
  assert.equal(mobile.toggle.getAttribute("aria-expanded"), "false");
  assert.equal(mobile.toggle.focused, false);

  mobile.intersect(false);
  assert.equal(mobile.container.classList.contains("results-advisor-hidden"), false);

  mobile.toggleMenu();
  assert.equal(mobile.container.classList.contains("advisor-menu-open"), true);
  assert.equal(mobile.toggle.getAttribute("aria-expanded"), "true");
  assert.equal(mobile.focusableElements[0].focused, true);

  const tabForward = mobile.keydown("Tab", { activeElement: mobile.focusableElements.at(-1) });
  assert.equal(tabForward.prevented, true);
  assert.equal(mobile.focusableElements[0].focused, true);
  const tabBackward = mobile.keydown("Tab", { shiftKey: true, activeElement: mobile.focusableElements[0] });
  assert.equal(tabBackward.prevented, true);
  assert.equal(mobile.focusableElements.at(-1).focused, true);

  mobile.keydown("Escape");
  assert.equal(mobile.container.classList.contains("advisor-menu-open"), false);
  assert.equal(mobile.toggle.getAttribute("aria-expanded"), "false");
  assert.equal(mobile.toggle.focused, true);
});

test("keeps desktop advisor popup behavior when a media change reaches 768px", () => {
  const mobile = createResultsAdvisorHarness();
  mobile.intersect(true);
  assert.equal(mobile.container.classList.contains("results-advisor-hidden"), true);

  mobile.mediaChange(false);
  assert.equal(mobile.container.classList.contains("results-advisor-hidden"), false);
  mobile.toggleMenu();
  assert.equal(mobile.container.classList.contains("advisor-menu-open"), true);
  assert.equal(mobile.toggle.getAttribute("aria-expanded"), "true");

  const desktop = createResultsAdvisorHarness({ mobile: false });
  desktop.intersect(true);
  assert.equal(desktop.container.classList.contains("results-advisor-hidden"), false);
});

test("keeps the advisor ping hidden after mobile close and restores it at desktop width", () => {
  const mobile = createResultsAdvisorHarness();

  mobile.toggleMenu();
  assert.equal(mobile.ping.style.display, "none");

  mobile.toggleMenu();
  assert.equal(mobile.ping.style.display, "none");

  mobile.mediaChange(false);
  assert.equal(mobile.ping.style.display, "flex");
});

test("uses the premium methodology card system without saturated utility bars", () => {
  const section = html.match(/<section[^>]*id="methodology-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(section, /class="[^"]*methodology-grid/);
  assert.equal((section.match(/class="[^"]*methodology-card\b/g) ?? []).length, 6);
  assert.equal((section.match(/methodology-card-accent/g) ?? []).length, 6);
  assert.equal((section.match(/methodology-icon/g) ?? []).length, 6);
  assert.equal((section.match(/methodology-tier/g) ?? []).length, 0);
  assert.doesNotMatch(section, /h-2 w-full bg-(?:blue|indigo|red|emerald|pink|purple)-500/);
  assert.match(section, />Clear Progress Tracking<\/h3>/);
  assert.doesNotMatch(section, />Clear Progress Tracking Dashboard<\/h3>/);
});

test("restores six restrained methodology identities without repeated card tiers", () => {
  const section = html.match(/<section[^>]*id="methodology-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  const accents = ["blue", "indigo", "rose", "emerald", "fuchsia", "violet"];

  assert.equal((section.match(/methodology-tier/g) ?? []).length, 0);
  for (const accent of accents) {
    assert.equal((section.match(new RegExp(`methodology-card-accent accent-${accent}`, "g")) ?? []).length, 1);
    assert.equal((section.match(new RegExp(`methodology-icon icon-${accent}`, "g")) ?? []).length, 1);
    assert.match(html, new RegExp(`\\.accent-${accent}\\s*\\{`));
    assert.match(html, new RegExp(`\\.icon-${accent}\\s*\\{`));
    assert.match(html, new RegExp(`html\\.dark \\.icon-${accent}\\s*\\{`));
  }
  assert.doesNotMatch(html, /\.methodology-card-accent\s*\{[^}]*background:/);
  assert.doesNotMatch(section, /h-2 w-full bg-(?:blue|indigo|red|emerald|pink|purple)-500/);
});

test("keeps premium card spacing after removing repeated tiers", () => {
  assert.match(html, /\.methodology-card-body\s*>\s*\.flex-1\s*\{\s*margin-top:\s*1\.25rem;/);
  const mobile = extractCssBlock(html, "@media (max-width: 767px)");
  assert.match(mobile, /\.methodology-card-body\s*>\s*\.flex-1\s*\{\s*display:\s*contents;/);
  assert.doesNotMatch(html, /\.methodology-tier\s*\{/);
});

test("keeps methodology cards balanced across responsive layouts", () => {
  assert.match(html, /\.methodology-card\s*\{[\s\S]*border-radius:[\s\S]*box-shadow:/);
  assert.match(html, /\.methodology-card-accent\s*\{[\s\S]*height:\s*(?:3px|0\.25rem)/);
  assert.match(html, /\.methodology-card-accent\s*\{[^}]*flex:\s*0 0 3px/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.methodology-card-body\s*\{[\s\S]*padding:/);
});

test("reveals methodology cards with deterministic fail-open motion", () => {
  assert.match(html, /\.methodology-motion-ready \.methodology-card:not\(\.methodology-visible\)/);
  assert.match(html, /translateY\((?:20px|1\.25rem)\)/);
  assert.doesNotMatch(html, /\.methodology-motion-ready \.methodology-card:not\(\.methodology-visible\)[^{]*\{[^}]*scale\(/);
  assert.match(html, /--methodology-delay/);
  assert.match(html, /dataset\.methodologyIndex/);
  assert.match(html, /methodologyObserver\.unobserve\(entry\.target\)/);
});

test("limits methodology hover and neutralizes all reduced motion", () => {
  assert.match(html, /@media \(hover:\s*hover\) and \(pointer:\s*fine\)[\s\S]*\.methodology-card:hover/);
  assert.match(html, /translateY\(-2px\)/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.methodology-card[\s\S]*transition:\s*none[\s\S]*transform:\s*none/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.methodology-icon[\s\S]*transform:\s*none/);
});

const methodologyMotionStart = html.indexOf("const methodologySection = document.getElementById('methodology-section')");
const methodologyMotionEnd = html.indexOf("  </script>", methodologyMotionStart);
const methodologyMotionSource = html.slice(methodologyMotionStart, methodologyMotionEnd);

function createMethodologyMotionHarness({ width = 768, constructorThrows = false } = {}) {
  const sectionClasses = new Set();
  const cards = Array.from({ length: 6 }, (_, index) => ({
    dataset: { methodologyIndex: String(index) },
    classList: { add() {} },
    style: {
      values: new Map(),
      setProperty(name, value) { this.values.set(name, value); },
    },
  }));
  class HarnessIntersectionObserver {
    constructor() {
      if (constructorThrows) throw new Error("observer unavailable");
    }
    observe() {}
    unobserve() {}
  }
  const window = {
    IntersectionObserver: HarnessIntersectionObserver,
    matchMedia(query) {
      return { matches: query === '(prefers-reduced-motion: no-preference)' || (query === '(max-width: 767px)' ? width <= 767 : query === '(max-width: 1023px)' ? width <= 1023 : false) };
    },
  };
  let error = null;
  try {
    runInNewContext(methodologyMotionSource, {
      document: {
        getElementById: () => ({ classList: { add: token => sectionClasses.add(token), remove: token => sectionClasses.delete(token) } }),
        querySelectorAll: () => cards,
      },
      IntersectionObserver: HarnessIntersectionObserver,
      window,
    });
  } catch (caught) {
    error = caught;
  }
  return { cards, error, sectionClasses };
}

test("stages methodology cards by their visual column at mobile tablet and desktop widths", () => {
  const delays = width => createMethodologyMotionHarness({ width }).cards.map(card => card.style.values.get('--methodology-delay'));
  assert.deepEqual(delays(390), ['0ms', '20ms', '40ms', '40ms', '40ms', '40ms']);
  assert.deepEqual(delays(768), ['0ms', '70ms', '0ms', '70ms', '0ms', '70ms']);
  assert.deepEqual(delays(1440), ['0ms', '70ms', '140ms', '0ms', '70ms', '140ms']);
});

test("keeps methodology cards fail-open when observer construction fails", () => {
  const harness = createMethodologyMotionHarness({ constructorThrows: true });
  assert.equal(harness.error, null);
  assert.equal(harness.sectionClasses.has('methodology-motion-ready'), false);
});

test("constructs the methodology observer before enabling the hidden motion state", () => {
  assert.match(methodologyMotionSource, /const methodologyObserver = new IntersectionObserver[\s\S]*methodologySection\.classList\.add\('methodology-motion-ready'\)/);
});

test("uses two mobile-only methodology group labels without hiding card content", () => {
  const section = html.match(/<section[^>]*id="methodology-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((section.match(/methodology-mobile-group/g) ?? []).length, 2);
  assert.match(section, /methodology-mobile-group[^>]*>Core Method</);
  assert.match(section, /methodology-mobile-group[^>]*>Ongoing Support</);
  assert.equal((section.match(/methodology-description/g) ?? []).length, 6);
  assert.doesNotMatch(html, /methodology-description[^\n{]*(?:line-clamp|display:\s*none|visibility:\s*hidden)/);
});

test("compacts methodology cards only below the tablet breakpoint", () => {
  const mobile = extractCssBlock(html, "@media (max-width: 767px)");
  assert.match(html, /\.methodology-mobile-group\s*\{\s*display:\s*none;/);
  assert.match(mobile, /\.methodology-mobile-group\s*\{[\s\S]*display:\s*block/);
  assert.match(mobile, /\.methodology-card-body\s*\{[\s\S]*display:\s*grid[\s\S]*grid-template-columns:\s*2\.75rem\s+minmax\(0,\s*1fr\)[\s\S]*padding:\s*1\.25rem/);
  assert.match(mobile, /\.methodology-icon\s*\{[\s\S]*width:\s*2\.75rem[\s\S]*height:\s*2\.75rem/);
  assert.match(mobile, /\.methodology-card-body\s*>\s*\.flex-1\s*\{\s*display:\s*contents/);
  assert.match(mobile, /\.methodology-description\s*\{[\s\S]*grid-column:\s*1\s*\/\s*-1/);
});
