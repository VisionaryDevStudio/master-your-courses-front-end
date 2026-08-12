import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

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
  assert.equal((programs.match(/class="program-mobile-tab\b/g) ?? []).length, 6);
  assert.equal((programs.match(/role="tab"/g) ?? []).length, 6);
  assert.equal((programs.match(/aria-controls="program-mobile-panel"/g) ?? []).length, 6);
  assert.match(programs, /id="program-mobile-panel"[^>]*role="tabpanel"/);
  assert.doesNotMatch(programs, /Abstract geometric grid background/);
  assert.doesNotMatch(programs, /bg-\[size:24px_24px\]/);
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

  assert.equal((programs.match(/USAPhO Simulator/g) ?? []).length, 2);
  assert.doesNotMatch(programs, /background-size:\s*12px 12px/);
  assert.doesNotMatch(programs, /linear-gradient\(white 1px, transparent 1px\)/);
  assert.equal((programs.match(/bg-gradient-to-br from-slate-700 via-slate-700 to-slate-800/g) ?? []).length, 2);
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
  const classList = () => {
    const classes = new Set();
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
  const focusableElements = ["floating-cta-close", "advisor-phone", "advisor-whatsapp", "advisor-email"].map(id => ({
    id,
    disabled: false,
    focused: false,
    hasAttribute(name) { return name === "disabled" && this.disabled; },
    focus() { this.focused = true; },
  }));
  const elements = {
    "results-section": { id: "results-section" },
    "floating-cta-container": { classList: classList() },
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
    intersect(isIntersecting) {
      this.callback([{ isIntersecting, target: elements["results-section"] }]);
    }
  }
  const window = {
    matchMedia: () => mediaQuery,
    addEventListener() {},
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
    setTimeout() {},
    window,
  });
  return {
    container: elements["floating-cta-container"],
    toggle: elements["floating-cta-toggle"],
    menu: elements["floating-cta-menu"],
    focusableElements,
    intersect(isIntersecting) { observers.at(-1)?.intersect(isIntersecting); },
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
