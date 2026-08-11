import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

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
