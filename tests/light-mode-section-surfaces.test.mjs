import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

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

test("retains dark-mode backgrounds and existing mentor modal wiring", () => {
  for (const className of ["surface-results", "surface-methodology"]) {
    const section = html.match(new RegExp(`<section[^>]*${className}[^>]*>`))?.[0] ?? "";
    assert.match(section, /dark:bg-zinc-950/);
  }

  assert.ok(html.includes('id="mentor-modal-name"'), "mentor modal name target is missing");
  for (const index of [0, 1, 2]) {
    assert.ok(
      html.includes(`onclick="openMentorModal(${index})"`),
      `mentor card ${index} is not wired to its modal data`,
    );
  }
});
