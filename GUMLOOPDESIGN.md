---
name: Gumloop
description: Editorial-restraint enterprise-agent brand system — quiet monochrome canvas, rationed brand-spectrum accents, strict font roles.
colors:
  # Neutrals — the 95% of the UI
  ink: "#18191B"          # primary text, headings, dark buttons, icons
  body-muted: "#5F5F68"   # longer muted body copy
  muted: "#8E8E98"        # secondary text, labels, captions
  hairline: "#E2E2E8"     # borders, dividers
  wash: "#F4F4F5"         # hover fills
  wash-inset: "#F1F1F4"   # inset surfaces
  section-bg: "#F9F9FB"   # page / section background (warm off-white)
  surface: "#FFFFFF"      # cards, UI windows, chips
  ink-hover: "#2C2D30"    # dark-button hover
  # Brand accents — the 5%, warm→cool spectrum, rationed (one per moment)
  accent-yellow: "#FFD400"
  accent-orange: "#FF8D00"
  accent-pink: "#FF59AF"
  accent-purple: "#C181FE"
  accent-indigo: "#7671F9"
typography:
  display:                # hero heading
    fontFamily: "Gellix, sans-serif"
    fontSize: "clamp(2.75rem, 5.1vw, 4.5rem)"   # 44px → 72px
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  heading:                # section / pillar heading
    fontFamily: "Gellix, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.5rem)"    # 30px → 40px
    fontWeight: 500
    lineHeight: 1.03
    letterSpacing: "-0.02em"
  title:                  # feature title / testimonial name
    fontFamily: "Gellix, sans-serif"
    fontSize: "1.25rem"   # 20px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  quote:                  # testimonial quote (regular weight display)
    fontFamily: "Gellix, sans-serif"
    fontSize: "1.25rem"   # 20px desktop / 15px mobile
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Geist Sans, sans-serif"
    fontSize: "1.125rem"  # 18px
    fontWeight: 400
    lineHeight: 1.44
    letterSpacing: "normal"
  body-sm:                # feature body / captions
    fontFamily: "Geist Sans, sans-serif"
    fontSize: "0.9375rem" # 15px (14px in dense contexts)
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:                  # eyebrow / secondary CTA / UI label
    fontFamily: "Geist Sans, sans-serif"
    fontSize: "0.9375rem" # 15px
    fontWeight: 500
    lineHeight: 1.47
    letterSpacing: "0.01em"
  stat:                   # big stat numbers (NUMERALS ONLY)
    fontFamily: "Geist Mono, monospace"
    fontSize: "3.5rem"    # 56px
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-1.1px"
  meta:                   # dates, versions, counts (NUMERALS ONLY)
    fontFamily: "Geist Mono, monospace"
    fontSize: "0.75rem"   # 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.03em"
rounded:
  sm: "6px"     # small inner elements
  md: "8px"     # default card
  lg: "10px"    # standard cards
  xl: "16px"    # large UI windows
  full: "9999px" # pills, chips, buttons
spacing:
  gutter-sm: "24px"    # mobile page inset (px-6)
  gutter-md: "40px"    # tablet page inset (px-10)
  gutter-xl: "130px"   # desktop page inset (signature wide editorial margin)
  section-y-sm: "40px" # mobile section vertical padding (py-10)
  section-y: "64px"    # desktop section vertical padding (py-16)
  content-max: "1440px"
  measure: "360px"     # text-column cap (readability); up to ~440px
  gap-tight: "20px"    # card-grid gap
  gap-lockup: "32px"   # heading/subhead/CTA lockup gap
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "10px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "10px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "20px"
  info-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: "36px"
  agent-icon-solid:
    textColor: "{colors.ink}"
  agent-icon-outline:
    textColor: "{colors.ink}"
  agent-icon-color:
    textColor: "{colors.accent-indigo}"
---

# Gumloop Brand & Design System

## Overview

**The Quiet Enterprise Layer.** Editorial restraint on a warm-neutral canvas — big, calm headings, generous whitespace, hairline structure, a monochrome UI where color is *rationed* to rare, deliberate moments. The register is x.ai / Pirsch / Cohere: confident and understated, never loud. The brand's warm→cool gradient is the one signature flourish, and it appears only in small doses (a 1px section divider, an accent on hover, a soft bloom behind a card) — **never as wallpaper.**

- **Canvas:** warm off-white `section-bg` (`#F9F9FB`) with white `surface` cards. Not cream, not tinted-warm — a true quiet off-white.
- **Color strategy:** *restrained* — neutrals carry ~95% of every surface; the five brand accents carry ~5%, one accent per moment.
- **Anti-references:** SaaS-cream/indigo templates, glassmorphism, drenched gradients, all-caps eyebrows, loud hero-metric blocks. If it reads "AI-generated landing page," it's wrong.
- **Layout feel:** a `1440px` content frame with a signature `130px` desktop inset; product-UI screens bleed toward one frame edge while copy sits on the other.

## Colors

**Neutrals (the 95%).** The interface is built almost entirely from these.

| Token | Hex | Use |
|-------|-----|-----|
| `ink` | `#18191B` | Primary text, headings, dark buttons, icons |
| `body-muted` | `#5F5F68` | Longer muted body copy |
| `muted` | `#8E8E98` | Secondary text, labels, captions |
| `hairline` | `#E2E2E8` | Borders, dividers |
| `wash` / `wash-inset` | `#F4F4F5` / `#F1F1F4` | Hover fills, inset surfaces |
| `section-bg` | `#F9F9FB` | Page / section background |
| `surface` | `#FFFFFF` | Cards, UI windows, chips |
| `ink-hover` | `#2C2D30` | Dark-button hover |

**Brand accents (the 5%).** A warm→cool spectrum. Used sparingly — on hover, in a gradient, or as a single colored agent glyph. Never fill a large area with them.

| Token | Hex |
|-------|-----|
| `accent-yellow` | `#FFD400` |
| `accent-orange` | `#FF8D00` |
| `accent-pink` | `#FF59AF` |
| `accent-purple` | `#C181FE` |
| `accent-indigo` | `#7671F9` |

**Contrast (WCAG AA) — safe pairings:** `ink` on `section-bg`/`surface` ✓ · `body-muted` on `section-bg`/`surface` ✓ · `muted` on `surface` ✓ (labels/secondary only) · white on `ink` ✓. **Avoid:** `muted` text on any brand accent (fails); put `ink` or white on accents, or use the accent only as a thin line / small glyph.

### Gradient layout patterns

The brand gradient is a warm→cool spectrum (yellow/orange → faint neutral center → purple/indigo), fading to transparent at both ends. It appears in a fixed set of **thin / soft** patterns — never as a solid fill or full background:

1. **Section divider (1px line).** The primary use. Rotate through four spectrum variants so consecutive dividers differ:
   ```css
   /* variant 1 (warm→cool) */
   background: linear-gradient(90deg,
     rgba(255,211,0,0) 0%, rgba(255,168,0,0.55) 12%, rgba(255,141,0,0.32) 30%,
     rgba(200,200,214,0.14) 50%,
     rgba(193,129,254,0.32) 70%, rgba(118,113,249,0.55) 88%, rgba(118,113,249,0) 100%);
   ```
   (variant 2 orange→pink→purple; variant 3 reversed cool→warm; variant 4 wider warm→indigo.)
2. **Soft radial bloom behind a card / canvas.** A single-hue glow, heavily blurred, low opacity — depth, not decoration:
   ```css
   background: radial-gradient(circle, rgba(118,113,249,0.16), transparent 70%); /* filter: blur(48px) */
   ```
3. **Hero glow.** A wide, low-opacity spectrum wash behind the hero UI, blurred ~10px:
   ```css
   background: linear-gradient(95deg, rgba(255,196,0,0.14), rgba(255,89,175,0.18) 38%, rgba(193,129,254,0.13) 72%, transparent);
   ```
4. **Thin gradient slice on a card edge** (testimonial/culture cards) — a narrow vertical strip of the brand gradient PNG down one edge.
5. **Bottom fade** — solid → `section-bg` gradient so bleeding UI screens dissolve into the page rather than ending on a hard line: `linear-gradient(to bottom, transparent, #F9F9FB)`.

**Rule:** default to neutral; a gradient marks a boundary or adds soft depth. Never `background-clip: text` (no gradient text), never a full-color gradient panel.

## Typography

**Three families, strict non-crossing roles** (`--font-brand` = Gellix VF · `--font-sans` = Geist Sans · `--font-mono` = Geist Mono):

| Role | Family / weight | Where |
|------|-----------------|-------|
| **Headings** | Gellix **Medium** (`font-brand`) | All display + section headings. Tight negative tracking. |
| **Body / UI** | Geist **Regular/Medium** (`font-sans`) | Body, labels, buttons, eyebrows. |
| **Numbers** | Geist **Mono** (`font-mono`) | **Numerals only** — stats, dates, versions, counts. Never label text. |

**Hierarchy (the type scale as used):**

| Role (token) | Family · size · line-height · tracking |
|--------------|----------------------------------------|
| `display` (hero) | Gellix Med · 44→72px · 1.02 · −0.025em |
| `heading` (section) | Gellix Med · 30→40px · 1.03 · −0.02em |
| `title` (feature/name) | Gellix Med · 20px · 1.2 |
| `quote` (testimonial) | Gellix Reg · 20px (15px mobile) · 1.5 · −0.005em |
| `body` | Geist Reg · 18px · 1.44 |
| `body-sm` (feature body) | Geist Reg · 14–15px · 1.5 · `body-muted` |
| `label` (eyebrow/CTA) | Geist **Med** · 15px · 1.47 · +0.01em |
| `stat` (big number) | Geist Mono **Light** · 56px · −1.1px |
| `meta` (date/version) | Geist Mono Med · 12px · +0.03em |

**Rules:** headings carry tight negative tracking (bigger = tighter, floor ≈ −0.025em); body is normal tracking with roomy ≥1.44 line-height; cap measure at ~65–75ch (360–440px columns). **Never all-caps, anywhere.** Mono is numerals only.

## Elevation

Depth is **flat and neutral** (x.ai register) — no colored, stacked, or decorative shadows.

- **Signature card shadow** — one soft, downward-biased shadow + a barely-there top hairline:
  ```css
  box-shadow: 0 1px 0 rgba(16,17,26,0.04), 0 22px 48px -30px rgba(16,17,26,0.16);
  ```
- **Borders:** `1px` `hairline` (`#E2E2E8`) at ~60% opacity on cards/windows.
- **Tonal layering** does more work than shadow: recessed grey `#F0F0F3` canvas holds white `surface` panels (figure/ground), rather than lifting everything with shadow.
- **Soft radial blooms** (see Gradient patterns) sit *behind* surfaces for gentle depth.
- **Film grain:** photos get a faint tiled SVG-turbulence overlay at ~10% opacity, `mix-blend-overlay`.
- **Bans:** glassmorphism as default, multi-layer/colored shadows.

## Components

### Agent icons — the "gummie" glyph family (3 treatments)

A family of rounded organic shapes with two knocked-out ellipse "eyes" (`cloud`, `starburst`, `square`, `blob`, `flame`, `triangle`). Authored on a `0 0 640 640` viewBox; the shape takes `currentColor`, the eyes knock out to `var(--background)`. **There are exactly three treatments — pick one per context, don't invent others:**

| Treatment | How it's drawn | When |
|-----------|----------------|------|
| **1 · Solid black** | `fill: currentColor` = `ink`; eyes knocked out to background | Default informational / brand mark; the agent as a solid ink shape |
| **2 · Black outline** | `fill: none; stroke: currentColor (ink); stroke-width: 48`; eyes filled solid | Lighter/secondary contexts, dense lists, quiet chrome |
| **3 · All color** | `fill: currentColor` = a single **brand accent**; often eyeless for pure decorative blobs | Hero scenes, culture role glyphs, one-per-moment accents |

Rules: one treatment per instance; color treatment uses exactly one brand accent (never multi-color within a glyph); scale freely (vector). The solid + outline treatments stay monochrome (`ink`).

### Buttons

Pill (`rounded-full`), `~10px 24px` padding, `label` type. **Primary:** `ink` bg → `ink-hover` on hover. **Secondary:** `surface`/transparent with `hairline` border → `wash` on hover. Background-shift only — no scale/shadow change on hover.

### Info chip / icon

The one canonical informational-icon treatment: a circular white chip (`~36px`), `hairline` border, centered **monochrome line icon** (Lucide), `ink` by default / `muted` when inactive. No filled or multicolor icons for informational use. **Exception:** real integration/brand **logos** show in their true colors, but rendered small and quiet.

### Card / UI window

White `surface`, `1px hairline` border, radius `md`–`xl` (bigger surfaces round more: 8px default, 10px cards, 14–16px large windows), the signature shadow. Large product-UI screens bleed toward one frame edge and dissolve via the bottom fade.

### Eyebrow / secondary CTA

`label` type (Geist Medium) + a small arrow that nudges right on hover. Not an all-caps kicker.

## Do's and Don'ts

**Do**
- Default to neutral; spend an accent only to reward an interaction or mark a boundary.
- Keep font roles strict: Gellix = headings, Geist Sans = body/UI, Geist Mono = numerals only.
- Use the gradient thin (1px divider), soft (blurred bloom), or small (edge slice) — never as a background.
- Pick one agent-icon treatment (solid / outline / color) per context.
- Lean on tonal layering (grey canvas + white panel) and one soft shadow for depth.
- Give sections room — the `130px` desktop inset and generous vertical rhythm are the brand.

**Don't**
- ❌ All-caps anything (headings, labels, eyebrows).
- ❌ Gradient text (`background-clip: text`), full-color gradient panels, or gradient-as-wallpaper.
- ❌ Mono type for words/labels — numerals only.
- ❌ Multicolor or filled informational icons (logos excepted).
- ❌ Multi-layer, colored, or decorative shadows; glassmorphism by default.
- ❌ `muted` grey text on a brand accent (fails contrast) — use `ink`/white or a thin line instead.
- ❌ Mix agent-icon treatments within one glyph, or use more than one accent in a color glyph.

---

<!-- SIDECAR · Motion — not one of the six canonical DESIGN.md sections; appended so the full brand
     input travels in one file. The complete motion guide (patterns + code) lives in docs/design.md, Part B. -->

## Motion

Editorial calm: short travel, one clean ease-out, no bounce. **Enter once, then rest** (reveals fire a single time). **Pop, never grow from 0** (entrances start at ~0.9 scale). Reduced motion is a first-class state.

**Easing (name once, reuse):**
- `out` — `cubic-bezier(0.22, 1, 0.36, 1)` — arrivals: scroll reveals, page-load, layer builds (the house curve)
- `pop` — `cubic-bezier(0.23, 1, 0.32, 1)` — small pops, hover lifts
- `travel` — `cubic-bezier(0.77, 0, 0.175, 1)` — on-screen A→B movement
- `standard` — `cubic-bezier(0.4, 0, 0.2, 1)` — crossfades / opacity swaps
- Tweens: `easeOutQuint` (scroll-to-section glide), `easeOutCubic` (number count-ups)

**Timing scale:** 150–200ms hover/focus · 260ms small pops · 300ms crossfades · 500ms layered transforms · **700ms scroll reveals (default)** · 800–900ms hero entrance / rail draws.

**Springs (interactive position tracking only, never entrances):** `{stiffness 360, damping 30}` tab slider · `{200, 30}` hover marker · `{110, 30, mass 0.5}` progress fill.

**Signature patterns:**
- **Scroll reveal** (workhorse) — `opacity 0, y 32 → whileInView`, `{ once: true, margin: '-70px' }`, 0.7s `out`.
- **Hero page-load** — rise + blur-clear, staggered 0.10–0.12s across headline → subhead → CTAs.
- **Layer / card build** — rise + scale `0.9 → 1`, staggered.
- **Ambient loops** — blobs, cursors, glows drift on 3–7s eased loops, barely perceptible.

**Reduced motion (required):** every animation checks `prefers-reduced-motion` and renders in its final position with 0 duration. No exceptions.
