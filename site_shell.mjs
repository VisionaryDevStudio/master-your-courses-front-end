import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  toCanonicalUrl
} from "./seo_schemas.mjs";

const rootDir = dirname(fileURLToPath(import.meta.url));
const indexHtml = readFileSync(join(rootDir, "index.html"), "utf8");

function extractBetween(source, startToken, endToken) {
  const start = source.indexOf(startToken);
  if (start === -1) throw new Error(`Missing token in index.html: ${startToken}`);
  const end = source.indexOf(endToken, start);
  if (end === -1) throw new Error(`Missing closing token in index.html: ${endToken}`);
  return source.slice(start, end + endToken.length);
}

const rawHeader = extractBetween(indexHtml, "<header ", "</header>");
const rawFooter = extractBetween(indexHtml, "<footer ", "</footer>");
const rawDialog = extractBetween(indexHtml, '<dialog id="consultation-modal"', "</dialog>");

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}

export function rewriteRelativePaths(markup, prefix) {
  return markup.replace(
    /\b(href|src|action)="(?!https?:|#|mailto:|tel:|data:|javascript:)([^"]+)"/g,
    (_, attr, target) => `${attr}="${prefix}${target}"`
  );
}

export function renderSharedShell({
  prefix,
  title,
  description = "",
  canonicalPath = "",
  noindex = false,
  ogImage = DEFAULT_SOCIAL_IMAGE,
  ogImageAlt = DEFAULT_SOCIAL_IMAGE_ALT,
  jsonLd = null,
  extraHeadCss = "",
  bodyHtml,
  extraBodyScripts = ""
}) {
  const fullTitle = `${title} — Master Your Courses`;
  const robotsDirective = noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const canonicalUrl = canonicalPath ? toCanonicalUrl(canonicalPath) : "";
  const canonicalTag = canonicalUrl
    ? `\n  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
    : "";
  const metaDesc = description
    ? `\n  <meta name="description" content="${escapeHtml(description)}" />`
    : "";
  const socialTags = [
    `<meta property="og:site_name" content="Master Your Courses" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
    ...(description ? [`<meta property="og:description" content="${escapeHtml(description)}" />`] : []),
    ...(canonicalUrl ? [`<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`] : []),
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
    ...(description ? [`<meta name="twitter:description" content="${escapeHtml(description)}" />`] : []),
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`
  ].map(tag => `\n  ${tag}`).join("");
  const schemaTag = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : "";

  const headerHtml = rewriteRelativePaths(rawHeader, prefix);
  const footerHtml = rewriteRelativePaths(rawFooter, prefix);
  const dialogHtml = rewriteRelativePaths(rawDialog, prefix);

  return `<!DOCTYPE html>
<html lang="en" class="dark overflow-x-hidden">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="robots" content="${robotsDirective}" />${metaDesc}${canonicalTag}${socialTags}
  <link rel="icon" href="${prefix}logo/logo.svg" type="image/svg+xml" />${schemaTag}
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    function getInitialTheme() {
      let savedTheme = null;
      try { savedTheme = localStorage.getItem("theme"); } catch (_) {}
      if (savedTheme) return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function setTheme(theme) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      try { localStorage.setItem("theme", theme); } catch (_) {}
    }
    function toggleTheme() {
      setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
    }
    setTheme(getInitialTheme());
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          fontFamily: {
            sans: ["Inter", "sans-serif"],
            display: ["Outfit", "sans-serif"]
          },
          colors: {
            background: "hsl(var(--background) / <alpha-value>)",
            foreground: "hsl(var(--foreground) / <alpha-value>)",
            border: "hsl(var(--border) / <alpha-value>)",
            muted: {
              DEFAULT: "hsl(var(--muted) / <alpha-value>)",
              foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
            }
          }
        }
      }
    };
  </script>
  <style>
    :root {
      --background: 210 20% 98%;
      --foreground: 222.2 84% 4.9%;
      --border: 214.3 31.8% 91.4%;
      --muted: 210 40% 96.1%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --surface-paper: 0 0% 100%;
      --surface-mist: 214 38% 93%;
      --surface-indigo: 235 42% 93%;
      --surface-warm: 32 30% 94%;
    }
    .dark {
      --background: 222.2 84% 4.9%;
      --foreground: 210 40% 98%;
      --border: 217.2 32.6% 17.5%;
      --muted: 217.2 32.6% 17.5%;
      --muted-foreground: 215 20.2% 65.1%;
    }
    body {
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
    }
    @media (prefers-reduced-motion: no-preference) {
      html { scroll-behavior: smooth; }
    }
    .visually-hidden:not(.skip-link),
    .skip-link:where(:not(:focus-within, :active)) {
      position: absolute !important;
      clip-path: inset(50%) !important;
      overflow: hidden !important;
      width: 1px !important;
      height: 1px !important;
      margin: -1px !important;
      padding: 0 !important;
      border: 0 !important;
      white-space: nowrap !important;
    }
    .skip-link:is(:focus-within, :active) {
      position: fixed;
      inset-block-start: 0.75rem;
      inset-inline-start: 0.75rem;
      z-index: 100;
      padding: 0.625rem 1.125rem;
      border-radius: 9999px;
      background: hsl(var(--foreground));
      color: hsl(var(--background));
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: 0 12px 30px rgb(15 23 42 / 0.25);
    }
    .lucide {
      width: 1em;
      height: 1em;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }
    .section-space-major { padding-block: 4rem; }
    .section-space-dense { padding-block: 3.5rem; }
    @media (min-width: 768px) {
      .section-space-major { padding-block: 5.5rem; }
      .section-space-dense { padding-block: 4.5rem; }
    }
    @media (min-width: 1024px) {
      .section-space-major { padding-block: 7rem; }
      .section-space-dense { padding-block: 5.5rem; }
    }
    html:not(.dark) .surface-hero {
      background:
        radial-gradient(circle at 82% 24%, rgb(99 102 241 / 0.11), transparent 32rem),
        radial-gradient(circle at 18% 76%, rgb(16 185 129 / 0.06), transparent 28rem),
        hsl(var(--surface-paper));
    }
    html:not(.dark) .surface-mist {
      background:
        linear-gradient(180deg, rgb(255 255 255 / 0.35), transparent 18rem),
        hsl(var(--surface-mist));
    }
    html:not(.dark) .surface-indigo {
      background:
        radial-gradient(circle at 50% 0%, rgb(99 102 241 / 0.09), transparent 34rem),
        hsl(var(--surface-indigo));
    }

    /* Shared Mega-Menu & Mobile Popover */
    .programs-mega-panel {
      width: min(94dvw, 66rem);
      max-height: calc(100dvh - 5.5rem);
      overflow-y: auto;
      background: #ffffff;
      border: 1px solid rgb(203 213 225 / 0.9);
      box-shadow:
        0 4px 12px -2px rgb(15 23 42 / 0.05),
        0 28px 68px -12px rgb(15 23 42 / 0.19);
    }
    .dark .programs-mega-panel {
      background: #060b17;
      border-color: rgb(148 163 184 / 0.14);
      box-shadow:
        inset 0 1px 0 rgb(255 255 255 / 0.06),
        0 32px 76px -10px rgb(0 0 0 / 0.82);
    }
    .mega-rail-surface {
      background: #f4f7fc;
      border-inline-end: 1px solid rgb(226 232 240 / 0.95);
    }
    .dark .mega-rail-surface {
      background: #0b1222;
      border-inline-end-color: rgb(148 163 184 / 0.11);
    }
    .mega-footer-bar {
      background: #f6f8fc;
      border-block-start: 1px solid rgb(226 232 240 / 0.95);
    }
    .dark .mega-footer-bar {
      background: #09101f;
      border-block-start-color: rgb(148 163 184 / 0.11);
    }
    .programs-mega-track[aria-selected="true"],
    .resources-mega-track[aria-selected="true"] {
      background: #ffffff;
      border-color: rgb(99 102 241 / 0.34);
      color: hsl(var(--foreground));
      box-shadow: -2px 0 0 0 #6366f1, 0 3px 10px -2px rgb(15 23 42 / 0.08);
    }
    .dark .programs-mega-track[aria-selected="true"],
    .dark .resources-mega-track[aria-selected="true"] {
      background: #111a30;
      border-color: rgb(129 140 248 / 0.42);
      box-shadow: -2px 0 0 0 #818cf8, 0 6px 16px -4px rgb(0 0 0 / 0.55);
    }
    .programs-mega-track[aria-selected="true"] .mega-track-chevron,
    .resources-mega-track[aria-selected="true"] .mega-track-chevron {
      color: #6366f1;
      transform: translateX(2px);
    }
    .dark .programs-mega-track[aria-selected="true"] .mega-track-chevron,
    .dark .resources-mega-track[aria-selected="true"] .mega-track-chevron {
      color: #818cf8;
    }
    .mega-item-card {
      border: 1px solid rgb(226 232 240 / 0.9);
      background: rgb(248 250 252 / 0.65);
      transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
    }
    .dark .mega-item-card {
      border-color: rgb(148 163 184 / 0.11);
      background: #0c1426;
    }
    .mega-item-card:hover {
      border-color: rgb(99 102 241 / 0.45);
      background: rgb(99 102 241 / 0.045);
      box-shadow: 0 6px 16px -6px rgb(99 102 241 / 0.14);
    }
    .dark .mega-item-card:hover {
      border-color: rgb(129 140 248 / 0.45);
      background: #121d38;
      box-shadow: 0 8px 20px -6px rgb(0 0 0 / 0.5);
    }
    .mega-list-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.375rem;
      border: 1px solid transparent;
      transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease;
    }
    .mega-list-link::after {
      content: "\\2192";
      content: "\\2192" / "";
      font-size: 0.75rem;
      line-height: 1;
      font-weight: 700;
      color: #6366f1;
      opacity: 0;
      transform: translateX(-3px);
      transition: opacity 140ms ease, transform 140ms ease;
      flex-shrink: 0;
    }
    .dark .mega-list-link::after {
      color: #818cf8;
    }
    .mega-list-link:hover,
    .mega-list-link:focus-visible {
      background: rgb(99 102 241 / 0.075);
      border-color: rgb(99 102 241 / 0.36);
      color: #4f46e5;
    }
    .dark .mega-list-link:hover,
    .dark .mega-list-link:focus-visible {
      background: #121d38;
      border-color: rgb(129 140 248 / 0.45);
      color: #818cf8;
    }
    .mega-list-link:hover .mega-list-title,
    .mega-list-link:focus-visible .mega-list-title {
      color: #4f46e5;
    }
    .dark .mega-list-link:hover .mega-list-title,
    .dark .mega-list-link:focus-visible .mega-list-title {
      color: #818cf8;
    }
    .mega-list-link:hover::after,
    .mega-list-link:focus-visible::after {
      opacity: 1;
      transform: translateX(0);
    }
    [data-mega-panel]:not([hidden]),
    [data-resource-panel]:not([hidden]) {
      display: block;
    }
    /* Stack every tab panel in one grid cell so the stage always takes the
       tallest panel's height: switching tabs never resizes the menu or
       shifts rail items under the cursor. Hidden panels keep layout only. */
    .mega-stage {
      display: grid;
    }
    .mega-stage > [role="tabpanel"] {
      grid-area: 1 / 1;
      min-width: 0;
    }
    .mega-stage > [role="tabpanel"][hidden] {
      display: block;
      visibility: hidden;
      pointer-events: none;
    }
    .mega-dropdown-layer {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translate(-50%, 6px) scale(0.99);
    }
    .mega-dropdown-layer::before {
      content: "";
      position: absolute;
      inset-inline: 0;
      top: -0.875rem;
      height: 1.375rem;
    }
    @media (prefers-reduced-motion: no-preference) {
      .mega-dropdown-layer {
        transition:
          opacity 170ms cubic-bezier(0.16, 1, 0.3, 1),
          transform 170ms cubic-bezier(0.16, 1, 0.3, 1),
          visibility 170ms;
      }
      @keyframes megaStageFade {
        from {
          opacity: 0;
          transform: translateY(3px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      [data-mega-panel]:not([hidden]),
      [data-resource-panel]:not([hidden]) {
        animation: megaStageFade 140ms cubic-bezier(0.16, 1, 0.3, 1);
      }
    }
    .mega-wrapper:not(.mega-force-closed):is(:hover, :focus-within, .is-hovered, .is-pinned) .mega-dropdown-layer {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
    }
    .mega-wrapper:not(.mega-force-closed):is(:hover, :focus-within, .is-hovered, .is-pinned) .mega-trigger-chevron {
      transform: rotate(180deg);
      opacity: 1;
    }
    .mega-wrapper:not(.mega-force-closed):is(:hover, :focus-within, .is-hovered, .is-pinned) .mega-trigger-btn {
      background: hsl(var(--muted));
      color: hsl(var(--foreground));
    }
    .mega-wrapper.mega-force-closed .mega-dropdown-layer {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    .mobile-submenu-trigger[aria-expanded="true"] .mobile-submenu-chevron {
      transform: rotate(180deg);
    }
    .mobile-menu-trigger {
      anchor-name: --mobile-menu-button;
    }
    .mobile-nav-popover {
      position: fixed;
      inset: auto;
      inset-block-start: 4.5rem;
      inset-block-start: anchor(--mobile-menu-button bottom);
      inset-inline-end: 1rem;
      inline-size: min(86dvw, 20rem);
      max-inline-size: calc(100dvw - 2rem);
      block-size: fit-content;
      max-block-size: calc(100dvh - 5.5rem);
      margin: 0.5rem 0 0;
      padding: 0.625rem;
      list-style: none;
      overflow-y: auto;
      border: 1px solid hsl(var(--border));
      border-radius: 1.25rem;
      background: hsl(var(--background) / 0.98);
      color: hsl(var(--foreground));
      backdrop-filter: blur(18px);
      box-shadow: 0 24px 60px rgb(15 23 42 / 0.18);
    }
    .dark .mobile-nav-popover {
      box-shadow: 0 24px 60px rgb(0 0 0 / 0.5);
    }
    .mobile-nav-popover:not(:is(:popover-open, .\\:popover-open)) {
      display: none;
    }
    .mobile-nav-popover:is(:popover-open, .\\:popover-open) {
      display: grid;
      gap: 0.25rem;
    }
    @media (prefers-reduced-motion: no-preference) {
      .mobile-nav-popover {
        opacity: 0;
        translate: 0 -0.375rem;
        transition: opacity 180ms ease, translate 180ms ease, display 180ms ease, overlay 180ms ease;
        transition-behavior: allow-discrete;
      }
      .mobile-nav-popover:is(:popover-open, .\\:popover-open) {
        opacity: 1;
        translate: 0 0;
      }
      @starting-style {
        .mobile-nav-popover:is(:popover-open, .\\:popover-open) {
          opacity: 0;
          translate: 0 -0.375rem;
        }
      }
    }

    /* Native Qualifying Consultation Dialog */
    dialog:modal {
      overscroll-behavior: contain;
    }
    dialog::backdrop {
      overflow: hidden;
      overscroll-behavior: contain;
      background: rgb(2 6 23 / 0.68);
      backdrop-filter: blur(8px);
    }
    #consultation-modal {
      padding: 0;
      border: 1px solid hsl(var(--border));
      border-radius: 1.75rem;
      background: hsl(var(--background));
      color: hsl(var(--foreground));
      width: min(94vw, 38rem);
      max-height: min(90dvh, 48rem);
      box-shadow: 0 32px 90px rgb(15 23 42 / 0.35);
    }
    #consultation-modal[open] {
      display: flex;
      flex-direction: column;
    }
    #consultation-modal input:not([type="radio"]),
    #consultation-modal select {
      font: inherit;
      font-size: max(1rem, 1em);
      min-height: 48px;
      box-sizing: border-box;
    }
    @media (pointer: coarse) {
      #consultation-modal input:not([type="radio"]),
      #consultation-modal select {
        min-height: 52px;
      }
    }
    #consultation-modal input[type="radio"] {
      accent-color: #4f46e5;
    }
    #consultation-modal input:user-invalid,
    #consultation-modal select:user-invalid {
      border-color: #ef4444;
      box-shadow: 0 0 0 2px rgb(239 68 68 / 0.2);
    }
${extraHeadCss}
  </style>
</head>
<body class="antialiased min-h-screen flex flex-col font-sans text-foreground overflow-x-clip">
  <a href="#main-heading" class="skip-link visually-hidden">Skip to main content</a>
  ${headerHtml}

  <main class="flex-1 pt-16 md:pt-20">
${bodyHtml}
  </main>

  ${footerHtml}
  ${dialogHtml}

  <script>
    let megaIntentTimer = 0;
    let resourceIntentTimer = 0;

    function setMegaTrack(index) {
      clearTimeout(megaIntentTimer);
      document.querySelectorAll("[data-mega-track]").forEach((tab, idx) => {
        tab.setAttribute("aria-selected", String(idx === index));
      });
      document.querySelectorAll("[data-mega-panel]").forEach((panel, idx) => {
        panel.hidden = idx !== index;
      });
    }
    function queueMegaTrack(index) {
      clearTimeout(megaIntentTimer);
      megaIntentTimer = window.setTimeout(() => setMegaTrack(index), 95);
    }
    function cancelMegaTrackIntent() {
      clearTimeout(megaIntentTimer);
    }
    function setResourceTrack(index) {
      clearTimeout(resourceIntentTimer);
      document.querySelectorAll("[data-resource-track]").forEach((tab, idx) => {
        tab.setAttribute("aria-selected", String(idx === index));
      });
      document.querySelectorAll("[data-resource-panel]").forEach((panel, idx) => {
        panel.hidden = idx !== index;
      });
    }
    function queueResourceTrack(index) {
      clearTimeout(resourceIntentTimer);
      resourceIntentTimer = window.setTimeout(() => setResourceTrack(index), 95);
    }
    function cancelResourceTrackIntent() {
      clearTimeout(resourceIntentTimer);
    }
    function closeAllMegaMenus({ restoreFocusTo = null } = {}) {
      document.querySelectorAll(".mega-wrapper").forEach(wrapper => {
        clearTimeout(megaLeaveTimers.get(wrapper));
        wrapper.classList.remove("is-pinned", "is-hovered");
        wrapper.classList.add("mega-force-closed");
        wrapper.querySelector("button[aria-expanded]")?.setAttribute("aria-expanded", "false");
      });
      if (restoreFocusTo) {
        restoreFocusTo.focus();
      } else if (document.activeElement?.closest(".mega-wrapper")) {
        document.activeElement.blur();
      }
    }
    function toggleMegaWrapper(wrapperId, triggerId) {
      const wrapper = document.getElementById(wrapperId);
      const trigger = document.getElementById(triggerId);
      if (!wrapper || !trigger) return;
      const willOpen = !wrapper.classList.contains("is-pinned");
      document.querySelectorAll(".mega-wrapper").forEach(other => {
        if (other !== wrapper) {
          clearTimeout(megaLeaveTimers.get(other));
          other.classList.remove("is-pinned", "is-hovered");
          other.querySelector("button[aria-expanded]")?.setAttribute("aria-expanded", "false");
          if (other.contains(document.activeElement)) document.activeElement.blur();
        }
      });
      wrapper.classList.remove("mega-force-closed");
      wrapper.classList.toggle("is-pinned", willOpen);
      trigger.setAttribute("aria-expanded", String(willOpen));
      if (!willOpen) wrapper.classList.add("mega-force-closed");
    }
    function toggleProgramsMegaMenu() {
      toggleMegaWrapper("programs-mega-wrapper", "programs-mega-trigger");
    }
    function toggleResourcesMegaMenu() {
      toggleMegaWrapper("resources-mega-wrapper", "resources-mega-trigger");
    }
    const megaLeaveTimers = new WeakMap();
    document.querySelectorAll(".mega-wrapper").forEach(wrapper => {
      wrapper.addEventListener("pointerenter", event => {
        if (event.pointerType === "touch") return;
        clearTimeout(megaLeaveTimers.get(wrapper));
        wrapper.classList.remove("mega-force-closed");
        wrapper.classList.add("is-hovered");
        document.querySelectorAll(".mega-wrapper").forEach(other => {
          if (other !== wrapper) {
            clearTimeout(megaLeaveTimers.get(other));
            other.classList.remove("is-hovered", "is-pinned");
            other.querySelector("button[aria-expanded]")?.setAttribute("aria-expanded", "false");
            if (other.contains(document.activeElement)) document.activeElement.blur();
          }
        });
      });
      wrapper.addEventListener("pointerleave", event => {
        if (event.pointerType === "touch") return;
        clearTimeout(megaLeaveTimers.get(wrapper));
        const timer = window.setTimeout(() => {
          wrapper.classList.remove("is-hovered", "mega-force-closed");
        }, 220);
        megaLeaveTimers.set(wrapper, timer);
      });
      wrapper.addEventListener("focusout", event => {
        if (event.relatedTarget && !wrapper.contains(event.relatedTarget)) {
          wrapper.classList.remove("is-pinned", "is-hovered");
          wrapper.querySelector("button[aria-expanded]")?.setAttribute("aria-expanded", "false");
        }
      });
    });
    document.querySelectorAll('header nav[aria-label="Primary"] > :not(.mega-wrapper), header > div > a').forEach(sibling => {
      sibling.addEventListener("pointerenter", event => {
        if (event.pointerType === "touch") return;
        document.querySelectorAll(".mega-wrapper").forEach(wrapper => {
          clearTimeout(megaLeaveTimers.get(wrapper));
          wrapper.classList.remove("is-hovered", "is-pinned");
          wrapper.querySelector("button[aria-expanded]")?.setAttribute("aria-expanded", "false");
          if (wrapper.contains(document.activeElement)) document.activeElement.blur();
        });
      });
    });
    document.addEventListener("click", event => {
      if (!event.target.closest(".mega-wrapper")) {
        document.querySelectorAll(".mega-wrapper.is-pinned").forEach(wrapper => {
          wrapper.classList.remove("is-pinned");
          wrapper.querySelector("button[aria-expanded]")?.setAttribute("aria-expanded", "false");
        });
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        const activeWrapper = document.activeElement?.closest(".mega-wrapper") || document.querySelector(".mega-wrapper:hover, .mega-wrapper.is-hovered, .mega-wrapper.is-pinned");
        if (activeWrapper) {
          const trigger = activeWrapper.querySelector("button[aria-expanded]");
          closeAllMegaMenus({ restoreFocusTo: document.activeElement?.closest(".mega-dropdown-layer") ? trigger : null });
        }
        return;
      }
      const triggerBtn = event.target.closest?.(".mega-trigger-btn");
      if (triggerBtn && event.key === "ArrowDown") {
        event.preventDefault();
        const wrapper = triggerBtn.closest(".mega-wrapper");
        if (wrapper && !wrapper.classList.contains("is-pinned")) {
          toggleMegaWrapper(wrapper.id, triggerBtn.id);
        }
        wrapper?.querySelector('[role="tab"][aria-selected="true"]')?.focus();
        return;
      }
      const tabEl = event.target.closest?.("[data-mega-track], [data-resource-track]");
      if (tabEl) {
        const isProgramTab = tabEl.hasAttribute("data-mega-track");
        const tabs = [...document.querySelectorAll(isProgramTab ? "[data-mega-track]" : "[data-resource-track]")];
        const currentIdx = tabs.indexOf(tabEl);
        if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
          event.preventDefault();
          let nextIdx = currentIdx;
          if (event.key === "ArrowDown") nextIdx = (currentIdx + 1) % tabs.length;
          else if (event.key === "ArrowUp") nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
          else if (event.key === "Home") nextIdx = 0;
          else if (event.key === "End") nextIdx = tabs.length - 1;
          if (isProgramTab) setMegaTrack(nextIdx);
          else setResourceTrack(nextIdx);
          tabs[nextIdx]?.focus();
        } else if (event.key === "ArrowRight") {
          const panelId = tabEl.getAttribute("aria-controls");
          const firstLink = panelId ? document.getElementById(panelId)?.querySelector("a[href], button:not([disabled])") : null;
          if (firstLink) {
            event.preventDefault();
            firstLink.focus();
          }
        }
        return;
      }
      const panelEl = event.target.closest?.("[data-mega-panel], [data-resource-panel]");
      if (panelEl && event.key === "ArrowLeft") {
        const labelId = panelEl.getAttribute("aria-labelledby");
        const ownerTab = labelId ? document.getElementById(labelId) : null;
        if (ownerTab) {
          event.preventDefault();
          ownerTab.focus();
        }
      }
    });

    const consultationDialog = document.getElementById("consultation-modal");
    const consultationForm = document.getElementById("consultation-qualifier-form");
    const consultationStatus = document.getElementById("consultation-form-status");

    function openConsultationModal() {
      closeAllMegaMenus();
      if (consultationDialog && !consultationDialog.open) {
        consultationDialog.showModal();
      }
    }

    document.getElementById("consultation-modal-close")?.addEventListener("click", () => consultationDialog?.close());
    document.getElementById("consultation-modal-cancel")?.addEventListener("click", () => consultationDialog?.close());
    consultationDialog?.addEventListener("close", () => {
      consultationDialog.returnValue = "";
    });

    if (typeof HTMLDialogElement !== "undefined" && !("closedBy" in HTMLDialogElement.prototype) && consultationDialog) {
      let pressedOutside = false;
      const isOutsideDialog = (event, dialog) => {
        const rect = dialog.getBoundingClientRect();
        return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      };
      consultationDialog.addEventListener("pointerdown", event => {
        pressedOutside = isOutsideDialog(event, consultationDialog);
      });
      consultationDialog.addEventListener("pointerup", event => {
        if (pressedOutside && isOutsideDialog(event, consultationDialog)) consultationDialog.close();
      });
    }

    if (consultationForm) {
      const validatedControls = [...consultationForm.querySelectorAll('select, input[type="email"]')];
      validatedControls.forEach(control => {
        control.addEventListener("blur", () => {
          if (control.value && !control.checkValidity()) control.setAttribute("aria-invalid", "true");
        });
        control.addEventListener("input", () => {
          if (control.checkValidity()) {
            control.removeAttribute("aria-invalid");
            if (consultationStatus) {
              consultationStatus.hidden = true;
              consultationStatus.textContent = "";
            }
          }
        });
      });
      consultationForm.addEventListener("submit", event => {
        if (!consultationForm.checkValidity()) {
          event.preventDefault();
          const firstInvalid = validatedControls.find(ctrl => !ctrl.checkValidity());
          if (firstInvalid) {
            firstInvalid.setAttribute("aria-invalid", "true");
            firstInvalid.focus();
          }
          if (consultationStatus) {
            consultationStatus.textContent = "Please complete all required fields to continue to scheduling.";
            consultationStatus.hidden = false;
          }
        }
      });
    }
  </script>
  <script type="module">
    if (!Object.hasOwn(HTMLElement.prototype, "popover")) {
      import("https://unpkg.com/@oddbird/popover-polyfill@0.7.3/dist/popover.min.js");
    }
    document.getElementById("mobile-nav-menu")?.addEventListener("click", event => {
      const submenuTrigger = event.target.closest(".mobile-submenu-trigger");
      if (submenuTrigger) {
        const submenuId = submenuTrigger.getAttribute("aria-controls");
        const submenu = submenuId ? document.getElementById(submenuId) : null;
        if (submenu) {
          const willOpen = submenu.hidden;
          submenu.hidden = !willOpen;
          submenuTrigger.setAttribute("aria-expanded", String(willOpen));
        }
        return;
      }
      if (event.target.closest("a")) {
        document.getElementById("mobile-nav-menu")?.hidePopover?.();
      }
    });
  </script>
${extraBodyScripts}
</body>
</html>
`;
}
