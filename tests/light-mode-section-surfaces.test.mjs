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
    name: "Zoey",
    role: "Certified Biology & Science Teacher",
    cardImage: "mentors/zoey.png",
    profileImage: "mentors/zoey.png",
    cardObjectPosition: "center center",
    profileObjectPosition: "center 10%",
    bio: "Zoey is one of the most decorated AP Biology teachers in the country. She has a rare gift for making difficult biology concepts feel manageable—breaking them down step-by-step and adapting her instruction to how each individual student learns best. Parents choose her because she doesn't just teach content; she builds the confidence and skills students need to earn top grades and score a 5. Her teacher mentorship has included coaching 39+ educators in mastery-based learning, and she was Teacher of the Year at U.S. Grant High School in 2020–21.",
    credentials: [
      { type: "award", title: "2025–26 National Virtual Teacher of the Year", detail: "", featured: true },
      { type: "education", title: "Master’s Degree, Johns Hopkins University", detail: "4.0 GPA", featured: false },
      { type: "experience", title: "AP Biology Teacher Since 2017", detail: "", featured: false },
      { type: "exam", title: "Scored a 5 on the AP Biology Exam", detail: "", featured: false },
    ],
  },
  {
    name: "Dr. Hossein Piri",
    role: "Healthcare Operations & AI Expert",
    cardImage: "mentors/Dr.piri.jpg",
    profileImage: "mentors/Dr.piri.jpg",
    cardObjectPosition: "center center",
    profileObjectPosition: "center 10%",
    bio: "Dr. Piri works at the intersection of healthcare operations research, machine learning, and behavioral operations. He focuses on practical systems that improve care delivery, including patient-centered warning systems and AI-driven approaches for addressing healthcare disparities.",
    credentials: [
      { type: "award", title: "40 Under 40", detail: "2026", featured: true },
      { type: "research", title: "Dean’s Research Scholar", detail: "University of Calgary", featured: false },
      { type: "award", title: "Killam Teaching Award", detail: "University of British Columbia", featured: false },
      { type: "research", title: "Collaborative Researcher", detail: "Harvard Business School", featured: false },
    ],
  },
  {
    name: "Dr. Sherri Sadr",
    role: "Doctor of Dental Medicine, UBC",
    cardImage: "mentors/sherri.png",
    profileImage: "mentors/sherri.png",
    cardObjectPosition: "center center",
    profileObjectPosition: "center 10%",
    bio: "Sherri is a dental graduate from UBC with a strong science and research foundation. Her combination of academic rigor, undergraduate mentorship through UBC's REX program, and real-world health service helps her coach students with clarity, structure, and high standards.",
    credentials: [
      { type: "education", title: "Doctor of Dental Medicine", detail: "UBC Faculty of Dentistry", featured: true },
      { type: "mentorship", title: "Research Experience (REX) Mentor", detail: "University of British Columbia", featured: false },
      { type: "mentorship", title: "VICE Mentor", detail: "AMS of UBC", featured: false },
      { type: "experience", title: "Healthcare Service", detail: "Vancouver Coastal Health", featured: false },
    ],
  },
];

const expectedVisibleMentorContent = [
  {
    summary: "Zoey makes difficult biology concepts manageable through step-by-step, adaptive instruction that builds confidence and AP-level mastery.",
    credentials: [
      "2025–26 National Virtual Teacher of the Year",
      "Master’s, Johns Hopkins University — 4.0 GPA",
    ],
  },
  {
    summary: "Dr. Piri works at the intersection of healthcare operations research, machine learning, and behavioral operations.",
    credentials: ["40 Under 40 (2026)", "Dean's Research Scholar, UCalgary"],
  },
  {
    summary: "Sherri is a dental graduate from UBC with a strong science and research foundation.",
    credentials: ["Doctor of Dental Medicine — UBC", "Research Experience (REX) Mentor — UBC"],
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

test("uses one semantic testimonial group with silent loop duplicates", () => {
  const tickerStart = html.indexOf("Results & Quotes Ticker");
  const tickerEnd = html.indexOf("Verified Impact & Video Testimonials", tickerStart);
  const ticker = html.slice(tickerStart, tickerEnd);
  const extractDivsByClass = (source, className) => {
    const openingPattern = new RegExp(`<div\\b[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`, "g");
    return [...source.matchAll(openingPattern)].map(openingMatch => {
      const divPattern = /<\/?div\b[^>]*>/g;
      let depth = 0;
      for (const divMatch of source.slice(openingMatch.index).matchAll(divPattern)) {
        depth += divMatch[0].startsWith("</") ? -1 : 1;
        if (depth === 0) {
          return source.slice(openingMatch.index, openingMatch.index + divMatch.index + divMatch[0].length);
        }
      }
      assert.fail(`unterminated ${className} element`);
    });
  };
  const normalizeCardMarkup = card => card
    .replace(/\srole="listitem"/, "")
    .replace(/\s+/g, " ")
    .replace(/> </g, "><")
    .trim();
  const readCardContent = card => {
    const values = [...card.matchAll(/<span(?:\s[^>]*)?>([^<]+)<\/span>/g)].map(([, value]) => value.trim());
    assert.equal(values.length, 5, "testimonial cards must expose name, assessment, before, after, and quote values");
    const [name, assessment, before, after, quote] = values;
    return { name, assessment, before, after, quote };
  };
  const canonicalTestimonials = [
    { name: "Duncan", assessment: "SAT", before: "1280", after: "1500", quote: '"Got into my dream school because of the bootcamp."' },
    { name: "Ari", assessment: "ACT", before: "33", after: "36", quote: '"The strategies they teach are next level."' },
    { name: "Kaitlyn", assessment: "SAT", before: "1400", after: "1510", quote: '"Finally broke the 1500 barrier!"' },
    { name: "Sakina", assessment: "SAT", before: "1370", after: "1540", quote: '"My confidence went through the roof."' },
    { name: "David", assessment: "AP BIO", before: "3", after: "5", quote: '"The mastery engines made studying actually fun."' },
    { name: "Emma", assessment: "SAT", before: "1350", after: "1560", quote: '"Best investment my parents made for college."' },
  ];

  assert.match(ticker, /class="[^"]*testimonial-marquee-section/);
  assert.match(ticker, /class="[^"]*testimonial-marquee-viewport[^"]*"[^>]*tabindex="0"/);
  assert.equal((ticker.match(/testimonial-marquee-group/g) ?? []).length, 4);
  assert.equal((ticker.match(/testimonial-marquee-card/g) ?? []).length, 24);
  assert.equal((ticker.match(/aria-label="Student outcomes"/g) ?? []).length, 1);
  assert.equal((ticker.match(/aria-hidden="true"/g) ?? []).length, 3);
  assert.equal((ticker.match(/role="list"/g) ?? []).length, 1);
  assert.equal((ticker.match(/role="listitem"/g) ?? []).length, 6);

  const groups = extractDivsByClass(ticker, "testimonial-marquee-group");
  const cardsByGroup = groups.map(group => extractDivsByClass(group, "testimonial-marquee-card"));
  assert.match(groups[0].slice(0, groups[0].indexOf(">") + 1), /role="list"/);
  assert.doesNotMatch(groups[0].slice(0, groups[0].indexOf(">") + 1), /aria-hidden/);
  for (const [groupIndex, cards] of cardsByGroup.entries()) {
    assert.equal(cards.length, 6, `testimonial group ${groupIndex + 1} must contain six cards`);
    if (groupIndex === 0) {
      cards.forEach(card => assert.match(card.slice(0, card.indexOf(">") + 1), /role="listitem"/));
    } else {
      const groupOpening = groups[groupIndex].slice(0, groups[groupIndex].indexOf(">") + 1);
      assert.match(groupOpening, /aria-hidden="true"/);
      assert.doesNotMatch(groupOpening, /role="list"/);
      cards.forEach(card => assert.doesNotMatch(card.slice(0, card.indexOf(">") + 1), /role="listitem"/));
    }
    assert.deepEqual(
      cards.map(readCardContent),
      canonicalTestimonials,
      `testimonial group ${groupIndex + 1} changed canonical order or content`,
    );
  }

  const canonicalMarkup = cardsByGroup[0].map(normalizeCardMarkup);
  for (const [groupIndex, cards] of cardsByGroup.entries()) {
    assert.deepEqual(
      cards.map(normalizeCardMarkup),
      canonicalMarkup,
      `testimonial group ${groupIndex + 1} differs from the semantic group`,
    );
  }
});

test("keeps testimonial motion readable and reduced-motion safe", () => {
  assert.match(html, /@keyframes testimonial-marquee[\s\S]*translate3d\(-25%,\s*0,\s*0\)/);
  assert.match(html, /\.testimonial-marquee-track\s*\{[\s\S]*--testimonial-duration:\s*80s[\s\S]*animation:\s*testimonial-marquee var\(--testimonial-duration\) linear infinite/);
  assert.match(html, /\.testimonial-marquee-group\s*\{[\s\S]*gap:\s*48px\s*!important[\s\S]*padding-right:\s*48px/);
  assert.match(html, /\.testimonial-marquee-card\s*\{[\s\S]*height:\s*66px/);
  assert.match(html, /testimonial-marquee-viewport:(?:hover|active)[\s\S]*animation-play-state:\s*paused/);
  assert.match(html, /testimonial-marquee-viewport:focus-within[\s\S]*animation-play-state:\s*paused/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*--testimonial-duration:\s*96s[\s\S]*gap:\s*24px\s*!important[\s\S]*height:\s*156px/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.testimonial-marquee-track\s*\{[\s\S]*animation:\s*none[\s\S]*transform:\s*none/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.testimonial-marquee-group\[aria-hidden="true"\]\s*\{\s*display:\s*none/);
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
    { title: "SAT Prep", coverage: "", desc: "Targeted instruction, practice, and score-improvement programs.", iconColor: "text-blue-600 dark:text-blue-400", glowColor: "rgba(59, 130, 246, 0.12)", cta: "Explore SAT Prep", proof: "Focused SAT Math Improvement" },
    { title: "Competition Prep", coverage: "AMC, AIME, F=ma, Physics Olympiad, and more", desc: "Advanced preparation for competitive STEM exams.", iconColor: "text-rose-600 dark:text-rose-400", glowColor: "rgba(244, 63, 94, 0.12)", cta: "Explore Competition Prep", proof: "Advanced STEM Competition Training" },
  ]);
  assert.match(programs, /if \(!Number\.isInteger\(idx\) \|\| idx < 0 \|\| idx >= PROGRAMS_DATA\.length\) return;/);
  assert.match(programs, /mobile-program-coverage['"]\)\.innerText = activeData\.coverage/);
  assert.match(programs, /stage-coverage['"]\)\.innerText = prog\.coverage/);
  assert.doesNotMatch(programs, /querySelectorAll\(['"]\.program-acc-item/);
  assert.doesNotMatch(programs, /SAT Math now, broader SAT later/);

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

test("pauses desktop Elite Program auto-advance while selector focus is retained", () => {
  const programsStart = html.indexOf("Elite Programs");
  const mentorsStart = html.indexOf("Meet The Mentors", programsStart);
  const programs = html.slice(programsStart, mentorsStart);
  const intervalBody = programs.match(/setInterval\(\(\) => \{([\s\S]*?)\n\s*\}, 50\);/)?.[1];
  assert.ok(intervalBody, "Elite Programs auto-advance interval is missing");

  const list = {
    focusWithin: true,
    matches(selector) {
      return selector === ':focus-within' && this.focusWithin;
    },
  };
  const controls = Array.from({ length: 4 }, () => ({
    querySelector(selector) {
      return selector === '.program-progress' ? { style: {} } : null;
    },
  }));
  let updates = 0;
  const runTick = new Function("document", "window", "PROGRAMS_DATA", "updateUI", `
    let isPaused = false;
    let isProgramsVisible = true;
    let progressVal = 99;
    let activeProgram = 1;
    return () => {
      ${intervalBody}
      return { activeProgram, progressVal };
    };
  `)(
    {
      getElementById(id) { return id === 'programs-list' ? list : null; },
      querySelectorAll(selector) { return selector === '.program-list-item' ? controls : []; },
    },
    { innerWidth: 1440 },
    Array.from({ length: 4 }),
    () => { updates += 1; },
  );

  assert.deepEqual(runTick(), { activeProgram: 1, progressVal: 99 });
  assert.equal(updates, 0);

  list.focusWithin = false;
  assert.deepEqual(runTick(), { activeProgram: 2, progressVal: 0 });
  assert.equal(updates, 1);
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
  assert.doesNotMatch(mentorsSection, /Elena|elena zhou/i);
  assert.doesNotMatch(JSON.stringify(extractMentorData()), /Elena|elena zhou/i);
  assert.equal(expectedMentors[0].name, "Zoey");
  assert.equal(expectedMentors[0].cardImage, "mentors/zoey.png");
  assert.equal(expectedMentors[0].credentials.length, 4);
  for (const [index, mentor] of expectedMentors.entries()) {
    const cardStart = mentorsSection.indexOf(`data-mentor-index="${index}"`);
    const nextCardStart = mentorsSection.indexOf(`data-mentor-index="${index + 1}"`);
    assert.notEqual(cardStart, -1, `mentor card ${index} is missing its scoped mapping`);
    const card = mentorsSection.slice(cardStart, nextCardStart === -1 ? undefined : nextCardStart);
    const cardText = card.replaceAll("&amp;", "&");

    assert.ok(card.includes('role="button"'), `${mentor.name} card is missing button semantics`);
    assert.ok(card.includes('tabindex="0"'), `${mentor.name} card is not keyboard focusable`);
    assert.ok(
      card.includes(`aria-label="View profile for ${mentor.name}"`),
      `${mentor.name} card has an inaccurate accessible name`,
    );
    assert.ok(
      card.includes(`src="${mentor.cardImage}"`),
      `${mentor.name} card is missing its canonical portrait source`,
    );
    assert.ok(
      card.includes(`alt="Portrait of ${mentor.name}"`),
      `${mentor.name} card has an inaccurate portrait alternative text`,
    );
    assert.ok(
      card.includes(`onclick="openMentorModal(${index}, this)"`),
      `${mentor.name} card is wired to the wrong modal record`,
    );
    assert.ok(
      card.includes(`onkeydown="handleMentorCardKeydown(event, ${index}, this)"`),
      `${mentor.name} card is missing Enter/Space activation`,
    );
    for (const value of [
      mentor.name,
      mentor.role,
      expectedVisibleMentorContent[index].summary,
      ...expectedVisibleMentorContent[index].credentials,
    ]) {
      assert.ok(cardText.includes(value), `${mentor.name} card is missing canonical content: ${value}`);
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

test("uses an editorial mentor desktop grid and manual mobile snap carousel", () => {
  const mentorsStart = html.indexOf("Meet The Mentors");
  const mentorsEnd = html.indexOf("Results & Quotes Ticker", mentorsStart);
  const mentors = html.slice(mentorsStart, mentorsEnd);

  assert.match(mentors, /class="mentor-carousel"/);
  assert.match(mentors, /class="mentor-track"/);
  assert.equal((mentors.match(/class="mentor-card(?:\s|")/g) ?? []).length, 3);
  assert.equal((mentors.match(/<button[^>]*data-mentor-dot/g) ?? []).length, 3);
  assert.match(mentors, /data-mentor-prev[^>]*aria-label="Previous mentor"/);
  assert.match(mentors, /data-mentor-next[^>]*aria-label="Next mentor"/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.mentor-track\s*\{[^}]*display:\s*flex;[^}]*overflow-x:\s*auto;[^}]*scroll-snap-type:\s*x mandatory/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.mentor-card\s*\{[^}]*flex:\s*0 0 calc\(100% - 2\.75rem\);[^}]*scroll-snap-align:\s*center/);
  assert.match(html, /@media \(min-width:\s*768px\)[\s\S]*\.mentor-track\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(html, /@media \(min-width:\s*768px\)[\s\S]*\.mentor-carousel-controls\s*\{\s*display:\s*none/);
  assert.doesNotMatch(mentors, /class="mentor-portrait[^\"]*rotate/);
});

test("uses clean native four-by-three mentor portraits without filler layers", () => {
  const mentorsStart = html.indexOf("Meet The Mentors");
  const mentorsEnd = html.indexOf("Results & Quotes Ticker", mentorsStart);
  const mentors = html.slice(mentorsStart, mentorsEnd);
  const expectedPortraits = {
    zoey: { source: "mentors/zoey.png", alt: "Portrait of Zoey" },
    piri: { source: "mentors/Dr.piri.jpg", alt: "Portrait of Dr. Hossein Piri" },
    sherri: { source: "mentors/sherri.png", alt: "Portrait of Dr. Sherri Sadr" },
  };

  for (const [mentor, { source, alt }] of Object.entries(expectedPortraits)) {
    const frameStart = mentors.indexOf(`data-mentor-portrait="${mentor}"`);
    const frameEnd = mentors.indexOf("</div>", frameStart);
    const frame = mentors.slice(frameStart, frameEnd);

    assert.notEqual(frameStart, -1, `${mentor} portrait frame is missing its identity hook`);
    assert.match(frame, new RegExp(`<img src="${source}" alt="${alt}" loading="lazy" decoding="async" class="mentor-portrait">`));
    assert.doesNotMatch(frame, /mentor-portrait-backdrop|mentor-portrait-foreground|aria-hidden="true"/);
  }

  assert.match(html, /\.mentor-portrait-wrap\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*3/s);
  assert.match(html, /\.mentor-portrait\s*\{[^}]*object-fit:\s*cover/s);
  assert.doesNotMatch(html, /\.mentor-portrait-backdrop\s*\{|\.mentor-portrait-foreground\s*\{/);
});

test("keeps mentor identity content in an unambiguous stacked header", () => {
  const mentorsStart = html.indexOf("Meet The Mentors");
  const mentorsEnd = html.indexOf("Results & Quotes Ticker", mentorsStart);
  const mentors = html.slice(mentorsStart, mentorsEnd);
  const headers = [...mentors.matchAll(/<div class="mentor-card-header([^\"]*)">/g)];

  assert.equal(headers.length, 3);
  for (const [, utilities] of headers) {
    assert.doesNotMatch(utilities, /\bflex(?:-row|-col)?\b/);
  }
  assert.match(html, /\.mentor-card-header\s*\{[^}]*display:\s*block;/);
  assert.match(html, /\.mentor-portrait-wrap\s*\{[^}]*width:\s*100%;/);
});

test("provides 44px mentor dot targets around restrained visual indicators", () => {
  assert.match(html, /\.mentor-carousel-dot\s*\{[^}]*width:\s*2\.75rem;[^}]*height:\s*2\.75rem;/);
  assert.match(html, /\.mentor-carousel-dot::before\s*\{[^}]*width:\s*\.5rem;[^}]*height:\s*\.5rem;/);
  assert.match(html, /\.mentor-carousel-dot\[aria-current="true"\]::before\s*\{[^}]*width:\s*1\.5rem;/);
});

test("keeps mentor carousel labels aligned with the visible mentor order", () => {
  const mentorsStart = html.indexOf("Meet The Mentors");
  const mentorsEnd = html.indexOf("Results & Quotes Ticker", mentorsStart);
  const mentors = html.slice(mentorsStart, mentorsEnd);
  const labels = [...mentors.matchAll(/data-mentor-dot aria-label="([^"]+)"/g)].map(match => match[1]);

  assert.deepEqual(labels, ["Show Zoey", "Show Dr. Hossein Piri", "Show Dr. Sherri Sadr"]);
});

test("uses a theme-aware editorial authority profile dialog", () => {
  const modalStart = html.indexOf('id="mentor-modal"');
  const modalEnd = html.indexOf("<!-- Floating Contact CTA -->", modalStart);
  const modal = html.slice(modalStart, modalEnd);

  assert.match(modal, /mentor-modal-backdrop/);
  assert.match(modal, /mentor-modal-surface/);
  assert.match(modal, /mentor-profile-layout/);
  assert.match(modal, /mentor-profile-portrait-frame/);
  assert.match(modal, /mentor-profile-identity/);
  assert.match(modal, /mentor-profile-credentials-panel/);
  assert.match(modal, /mentor-profile-footer/);
  assert.match(modal, /mentor-modal-primary/);
  assert.match(modal, /id="mentor-modal-close"[^>]*w-11 h-11/);
  assert.match(modal, /<a href="#"[^>]*mentor-modal-primary[^>]*>\s*Book a Consultation/);
  assert.match(html, /\.mentor-modal-surface\s*\{[^}]*width:\s*min\(1080px, calc\(100vw - 48px\)\);[^}]*max-height:\s*90vh;[^}]*background:\s*rgb\(255 253 249/s);
  assert.match(html, /\.dark \.mentor-modal-surface\s*\{[^}]*background:\s*rgb\(2 6 23/s);
  assert.match(html, /@media \(min-width:\s*1024px\)[\s\S]*\.mentor-profile-layout\s*\{[^}]*grid-template-columns:\s*42fr 58fr/s);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*\.mentor-profile-portrait-frame\s*\{[^}]*aspect-ratio:\s*3\s*\/\s*2/s);
  assert.match(html, /\.mentor-profile-portrait-frame\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*5/s);
  assert.match(html, /\.mentor-profile-credentials-panel\s*\{[^}]*background:\s*rgb\(15 23 42/s);
  assert.doesNotMatch(modal, /mentor-modal-sidebar|mentor-modal-avatar-frame/);
  assert.doesNotMatch(modal, /mentor-modal-accolade(?:\s|"|')/);
  assert.doesNotMatch(modal, /mentor-profile-portrait-frame[^>]*rounded-full/);
});

test("stages the mentor authority profile with restrained reduced-motion-safe timing", () => {
  assert.match(html, /\.mentor-profile-stage[\s\S]*transition-delay:\s*var\(--mentor-profile-delay, 0ms\)/);
  assert.match(html, /#mentor-modal-content[\s\S]*translateY\(10px\)[\s\S]*scale\(\.985\)/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.mentor-profile-stage[\s\S]*transition:\s*none/);
});

test("compacts tablet mentor cards and removes modal motion when requested", () => {
  assert.match(html, /@media \(min-width:\s*768px\) and \(max-width:\s*1023px\)[\s\S]*\.mentor-card-header > div:last-child\s*\{[^}]*padding:\s*1rem 1rem 0/s);
  assert.match(html, /@media \(min-width:\s*768px\) and \(max-width:\s*1023px\)[\s\S]*\.mentor-card-credentials\s*\{[^}]*margin:\s*1rem 1rem 0;[^}]*padding-top:\s*\.75rem/s);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*#mentor-modal[\s\S]*#mentor-modal-content\s*\{[^}]*transition:\s*none(?:\s*!important)?;/s);
  assert.match(html, /@media \(min-width:\s*1024px\)[\s\S]*#mentor-section \.section-intro-gap\s*\{[^}]*margin-bottom:\s*1\.5rem;/s);
});

test("closes the mentor dialog faster and without delay for reduced motion", () => {
  const modalLogic = html.slice(html.indexOf("// Mentor Modal Logic"), html.indexOf("  </script>", html.indexOf("// Mentor Modal Logic")));
  assert.match(html, /#mentor-modal\.mentor-modal-closing\s*\{[^}]*transition-duration:\s*200ms;/s);
  assert.match(html, /#mentor-modal\.mentor-modal-closing #mentor-modal-content\s*\{[^}]*transition-duration:\s*200ms;/s);
  assert.match(modalLogic, /mentorModalReducedMotion\s*=\s*window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(modalLogic, /mentorModalReducedMotion\.matches\s*\?\s*0\s*:\s*200/);
});

test("removes decorative mentor hover glow layers", () => {
  const mentorsStart = html.indexOf("Meet The Mentors");
  const mentorsEnd = html.indexOf("Results & Quotes Ticker", mentorsStart);
  const mentors = html.slice(mentorsStart, mentorsEnd);

  assert.doesNotMatch(mentors, /Blooming shadow effect/);
  assert.doesNotMatch(mentors, /group-hover:opacity-100/);
});

test("uses reduced-motion-safe editorial mentor reveal and fine-pointer hover only", () => {
  assert.match(html, /@media \(prefers-reduced-motion:\s*no-preference\)[\s\S]*\.mentor-motion-ready \.mentor-card:not\(\.mentor-visible\)[\s\S]*opacity:\s*0[\s\S]*transform:\s*translateY\(16px\)/);
  assert.match(html, /@media \(hover:\s*hover\) and \(pointer:\s*fine\) and \(prefers-reduced-motion:\s*no-preference\)[\s\S]*\.mentor-card:hover\s*\{\s*transform:\s*translateY\(-2px\)/);
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.mentor-card[\s\S]*opacity:\s*1;[\s\S]*transform:\s*none;[\s\S]*transition:\s*none/);
});

test("neutralizes editorial mentor profile arrow motion under reduced motion", () => {
  assert.match(html, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*\.mentor-card-action svg\s*\{[^}]*transform:\s*none(?:\s*!important)?;[^}]*transition:\s*none(?:\s*!important)?/);
});

test("keeps mentor dialog keyboard focus inside the open profile", () => {
  const mentorModalScript = html.slice(html.indexOf("let mentorModalTrigger"), html.indexOf("<!-- Premium Fonts"));

  assert.match(mentorModalScript, /function getMentorModalFocusableElements\(\)/);
  assert.match(mentorModalScript, /function trapMentorModalFocus\(event\)/);
  assert.match(mentorModalScript, /event\.key !== 'Tab'/);
  assert.match(mentorModalScript, /mentorModalFocusableElements\.at\(-1\)/);
  assert.match(mentorModalScript, /first\.focus\(\)/);
});

const mentorModalLogicStart = html.indexOf("// Mentor Modal Logic");
const mentorModalLogicEnd = html.indexOf("  </script>", mentorModalLogicStart);
const mentorModalLogicSource = html.slice(mentorModalLogicStart, mentorModalLogicEnd);

function createMentorModalHarness() {
  const documentListeners = new Map();
  const style = () => {
    const customProperties = new Map();
    return {
      getPropertyValue(name) { return customProperties.get(name) ?? ""; },
      objectPosition: "",
      setProperty(name, value) { customProperties.set(name, value); },
    };
  };
  const classList = (...initial) => {
    const values = new Set(initial);
    return {
      add: (...tokens) => tokens.forEach(token => values.add(token)),
      remove: (...tokens) => tokens.forEach(token => values.delete(token)),
      contains: token => values.has(token),
    };
  };
  const documentState = { activeElement: null };
  const focusable = name => ({
    name,
    disabled: false,
    hasAttribute(attribute) { return attribute === "disabled" && this.disabled; },
    focus() { documentState.activeElement = this; },
  });
  const trigger = focusable("trigger");
  const close = focusable("close");
  const apply = focusable("apply");
  const modal = {
    classList: classList("hidden", "opacity-0"),
    attributes: new Map([["aria-hidden", "true"]]),
    offsetWidth: 0,
    setAttribute(name, value) { this.attributes.set(name, value); },
    getAttribute(name) { return this.attributes.get(name) ?? null; },
    querySelectorAll() { return [close, apply]; },
    contains(node) { return node === close || node === apply; },
  };
  const content = { classList: classList("scale-95") };
  const elements = {
    "mentor-modal": modal,
    "mentor-modal-content": content,
    "mentor-modal-close": close,
    "mentor-modal-avatar": { src: "", alt: "", style: style() },
    "mentor-modal-name": {},
    "mentor-modal-role": {},
    "mentor-modal-bio": {},
    "mentor-modal-accolades": { innerHTML: "" },
  };
  const document = {
    body: { style: {} },
    get activeElement() { return documentState.activeElement; },
    getElementById(id) { return elements[id] ?? null; },
    addEventListener(type, listener) { documentListeners.set(type, listener); },
    querySelectorAll(selector) {
      if (selector !== '.mentor-card[data-mentor-index]') return [];
      return [0, 1, 2].map(index => ({
        dataset: { mentorIndex: String(index) },
        querySelector(candidate) {
          return candidate === '.mentor-portrait' ? elements[`mentor-card-image-${index}`] : null;
        },
      }));
    },
  };
  for (let index = 0; index < 3; index += 1) {
    elements[`mentor-card-image-${index}`] = { src: "", alt: "", style: style() };
  }
  const api = runInNewContext(`${mentorModalLogicSource}; ({ MENTORS_DATA, hydrateMentorCardImages, openMentorModal, closeMentorModal })`, {
    clearTimeout() {},
    document,
    requestAnimationFrame(callback) { callback(); },
    setTimeout() { return 1; },
    window: { matchMedia() { return { matches: false }; } },
  });
  return {
    apply,
    close,
    image(index) { return elements[`mentor-card-image-${index}`]; },
    modalImage: elements["mentor-modal-avatar"],
    mentors: api.MENTORS_DATA,
    modal,
    hydrateCards() { api.hydrateMentorCardImages(); },
    open(index = 0) {
      api.openMentorModal(index, trigger);
      return elements["mentor-modal-accolades"].innerHTML;
    },
    closeModal() { api.closeMentorModal(); },
    trigger,
    keydown(key, { shiftKey = false } = {}) {
      const event = { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
      documentListeners.get("keydown")?.(event);
      return event;
    },
    activeElement() { return documentState.activeElement; },
  };
}

test("uses independent mentor images for cards and profiles", () => {
  assert.match(mentorModalLogicSource, /cardImage:\s*["']/);
  assert.match(mentorModalLogicSource, /profileImage:\s*["']/);
  assert.match(mentorModalLogicSource, /cardObjectPosition:\s*["']/);
  assert.match(mentorModalLogicSource, /profileObjectPosition:\s*["']/);
  assert.match(mentorModalLogicSource, /function hydrateMentorCardImages\(\)/);
  assert.match(mentorModalLogicSource, /modalImage\.src\s*=\s*mentor\.profileImage/);
  assert.match(mentorModalLogicSource, /modalImage\.style\.setProperty\(\s*["']--mentor-profile-object-position["'],\s*mentor\.profileObjectPosition\s*\)/);
  assert.doesNotMatch(mentorModalLogicSource, /modalImage\.style\.objectPosition\s*=/);
  assert.doesNotMatch(mentorModalLogicSource, /mentor\.avatar/);

  assert.match(html, /\.mentor-portrait-wrap\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(html, /\.mentor-profile-portrait-frame\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*5/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.mentor-profile-portrait-frame\s*\{[\s\S]*?aspect-ratio:\s*3\s*\/\s*2/);
  assert.match(html, /\.mentor-profile-portrait-frame img\s*\{[\s\S]*?object-position:\s*var\(--mentor-profile-object-position,\s*center 10%\)/);
  assert.match(html, /@media \(max-width:\s*767px\)[\s\S]*?\.mentor-profile-portrait-frame img\s*\{[\s\S]*?object-position:\s*center 18%/);

  const harness = createMentorModalHarness();
  harness.mentors[0].cardImage = "mentors/zoey-card.webp";
  harness.mentors[0].profileImage = "mentors/zoey-profile.webp";
  harness.hydrateCards();
  harness.open(0);

  assert.equal(harness.image(0).src, "mentors/zoey-card.webp");
  assert.equal(harness.image(0).alt, "Portrait of Zoey");
  assert.equal(harness.image(0).style.objectPosition, "center center");
  assert.equal(harness.modalImage.src, "mentors/zoey-profile.webp");
  assert.equal(harness.modalImage.alt, "Portrait of Zoey");
  assert.equal(harness.modalImage.style.getPropertyValue("--mentor-profile-object-position"), "center 10%");
});

test("renders curated semantic credentials for every mentor", () => {
  assert.match(mentorModalLogicSource, /credentials:\s*\[/);
  assert.match(mentorModalLogicSource, /const MENTOR_CREDENTIAL_ICONS/);
  assert.match(mentorModalLogicSource, /function renderMentorCredentials\(credentials\)/);
  assert.doesNotMatch(mentorModalLogicSource, /mentor\.accolades\.forEach/);
  assert.doesNotMatch(mentorModalLogicSource, /M6 9H4\.5/);

  const supportedTypes = ["award", "education", "exam", "experience", "research", "mentorship"];
  for (const type of supportedTypes) {
    assert.match(mentorModalLogicSource, new RegExp(`${type}:\\s*['\"]<svg`));
  }

  const harness = createMentorModalHarness();
  for (const [index, mentor] of expectedMentors.entries()) {
    const markup = harness.open(index);
    const types = [...markup.matchAll(/data-credential-type="([^"]+)"/g)].map(([, type]) => type);
    const featured = [...markup.matchAll(/data-featured="([^"]+)"/g)].map(([, value]) => value);

    assert.equal((markup.match(/class="mentor-profile-credential(?:\s|")/g) ?? []).length, 4, `${mentor.name} needs four credentials`);
    assert.deepEqual(types, mentor.credentials.map(credential => credential.type), `${mentor.name} credential types are out of order`);
    assert.deepEqual(featured, mentor.credentials.map(credential => String(credential.featured)), `${mentor.name} featured credential is incorrect`);
    assert.equal((markup.match(/mentor-profile-credential-icon" aria-hidden="true"/g) ?? []).length, 4, `${mentor.name} icons must be decorative`);

    for (const credential of mentor.credentials) {
      assert.ok(markup.includes(`<strong>${credential.title}</strong>`), `${mentor.name} is missing ${credential.title}`);
      if (credential.detail) assert.ok(markup.includes(`<small>${credential.detail}</small>`), `${mentor.name} is missing ${credential.detail}`);
    }
  }
});

test("restores mentor trigger focus before the close transition completes", () => {
  const harness = createMentorModalHarness();
  harness.open();
  harness.closeModal();

  assert.equal(harness.modal.getAttribute("aria-hidden"), "true");
  assert.equal(harness.activeElement(), harness.trigger);
});

test("does not trap an immediate Tab after a mentor modal starts closing", () => {
  const harness = createMentorModalHarness();
  harness.open();
  harness.closeModal();

  const tab = harness.keydown("Tab");
  assert.equal(tab.prevented, false);
  assert.equal(harness.activeElement(), harness.trigger);
});

test("uses a flex centering contract whenever the mentor modal becomes visible", () => {
  const modalMarkup = html.match(/<div id="mentor-modal"[^>]*>/)?.[0] ?? "";

  assert.match(modalMarkup, /\bflex\b/);
  assert.match(modalMarkup, /\bitems-center\b/);
  assert.match(modalMarkup, /\bjustify-center\b/);
});

test("hides the advisor trigger while mentor cards are in view to prevent overlap", () => {
  const floatingStart = html.indexOf('// Floating CTA Logic');
  const floatingEnd = html.indexOf('// Scroll reveal observer', floatingStart);
  const floating = html.slice(floatingStart, floatingEnd);

  assert.match(html, /#floating-cta-container\.mentor-advisor-hidden\s*\{[\s\S]*opacity:\s*0;[\s\S]*visibility:\s*hidden;[\s\S]*pointer-events:\s*none;/);
  assert.match(floating, /let mentorAdvisorIntersecting = false;/);
  assert.match(floating, /floatingCtaContainer\.classList\.toggle\('mentor-advisor-hidden', mentorAdvisorIntersecting\);/);
  assert.match(floating, /const mentorAdvisorSection = document\.getElementById\('mentor-section'\);/);
  assert.match(floating, /mentorAdvisorIntersecting = entries\[0\]\.isIntersecting;/);
  assert.match(floating, /mentorAdvisorObserver\.observe\(mentorAdvisorSection\);/);
});

const mentorCarouselStart = html.indexOf("function initMentorCarousel()");
const mentorCarouselEnd = html.indexOf("\n          initMentorCarousel();", mentorCarouselStart);
const mentorCarouselSource = html.slice(mentorCarouselStart, mentorCarouselEnd);

function createMentorCarouselHarness({ reducedMotion = false } = {}) {
  const trackListeners = new Map();
  const observerInstances = [];
  const controls = new Map();
  const advancementTimers = [];
  const cards = Array.from({ length: 3 }, (_, index) => ({
    dataset: { mentorIndex: String(index) },
    offsetLeft: index * 320,
    offsetWidth: 292,
    scrollIntoViewOptions: null,
    classList: { add() {} },
    style: { setProperty() {} },
  }));
  const track = {
    scrollLeft: 0,
    clientWidth: 292,
    addEventListener(type, listener) { trackListeners.set(type, listener); },
  };
  function createControl() {
    const attributes = new Map();
    const listeners = new Map();
    return {
      disabled: false,
      setAttribute(name, value) { attributes.set(name, String(value)); },
      getAttribute(name) { return attributes.get(name) ?? null; },
      addEventListener(type, listener) { listeners.set(type, listener); },
      click() { listeners.get("click")?.({ preventDefault() {} }); },
    };
  }
  const previous = createControl();
  const next = createControl();
  const dots = [createControl(), createControl(), createControl()];
  controls.set("[data-mentor-prev]", previous);
  controls.set("[data-mentor-next]", next);
  cards.forEach(card => {
    card.scrollIntoView = options => { card.scrollIntoViewOptions = options; };
  });
  class HarnessIntersectionObserver {
    constructor(callback) { this.callback = callback; observerInstances.push(this); }
    observe() {}
    unobserve() {}
  }
  const mediaQuery = { matches: reducedMotion };
  const section = { classList: { add() {} } };
  const init = runInNewContext(`${mentorCarouselSource}\ninitMentorCarousel`, {
    IntersectionObserver: HarnessIntersectionObserver,
    document: {
      getElementById: id => id === "mentor-section" ? section : null,
      querySelector: selector => selector === ".mentor-carousel" ? section : selector === ".mentor-track" ? track : controls.get(selector) ?? null,
      querySelectorAll: selector => selector === ".mentor-card" ? cards : selector === "[data-mentor-dot]" ? dots : [],
    },
    setInterval: () => advancementTimers.push("interval"),
    setTimeout: () => advancementTimers.push("timeout"),
    window: { matchMedia: () => mediaQuery },
  });
  init();
  return {
    cards,
    dots,
    previous,
    next,
    activeIndex() { return dots.findIndex(dot => dot.getAttribute("aria-current") === "true"); },
    clickNext() { next.click(); },
    clickPrevious() { previous.click(); },
    scrollTo(index) { track.scrollLeft = cards[index].offsetLeft; trackListeners.get("scroll")?.(); },
    autoAdvanceTimers() { return advancementTimers.length; },
  };
}

test("keeps mentor carousel progression manual, synchronized, and bounded", () => {
  const harness = createMentorCarouselHarness();

  assert.equal(harness.activeIndex(), 0);
  assert.equal(harness.previous.disabled, true);
  harness.clickNext();
  assert.equal(harness.activeIndex(), 1);
  harness.clickPrevious();
  assert.equal(harness.activeIndex(), 0);
  harness.scrollTo(2);
  assert.equal(harness.activeIndex(), 2);
  assert.equal(harness.next.disabled, true);
  assert.equal(harness.autoAdvanceTimers(), 0);
});

test("uses editorial mentor automatic scrolling for reduced-motion preferences", () => {
  const harness = createMentorCarouselHarness({ reducedMotion: true });
  harness.clickNext();

  assert.equal(harness.cards[1].scrollIntoViewOptions.behavior, "auto");
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
