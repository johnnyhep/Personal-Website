# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A personal portfolio site for John Hepworth, split into three files: `index.html` (markup), `styles.css` (all styling), and `script.js` (the copyright-year fill-in — its only behavior). There is no build step, no package manager, no tests, and no git repo. The only external dependency is Google Fonts (Space Grotesk for headings, Inter for body).

## Running it

```bash
open index.html                 # open directly in the default browser
python3 -m http.server 8000     # or serve the directory if a server is needed
```

Edits are live on reload; there is nothing to compile.

## Architecture

The page is built around one metaphor: scrolling down is **descending through water**, from bright surface to dark abyss. Nearly every structural decision follows from that, and changes that ignore it will look broken.

### Depth palette and section gradients

`:root` defines `--depth-0` (near-white surface) through `--depth-7` (near-black abyss). Each section paints `linear-gradient(180deg, var(--depth-N), var(--depth-N+1))`, and sections are chained so **one section's gradient end color must equal the next section's gradient start color** — otherwise a visible seam appears. Current chain:

| Section | Gradient |
|---|---|
| `.hero` | flat `--depth-0` |
| `.about` | 1 → 2 |
| `.skills` | 2 → 3 |
| `.projects` | 3 → 4 |
| `.making` | 4 → 5 |
| `.contact-section` | 5 → 6 |

Inserting or reordering a section means re-chaining every gradient after it.

### Theming by variable re-scoping

There is no light/dark class system. Dark sections locally redefine `--fg`, `--fg-muted`, `--border`, and `--bg-solid` on their own rule, and all shared components (`.btn-primary`, `.btn-text`, `.card`, links) read only those variables. `--bg-solid` exists specifically so `.btn-primary` can use the section's background as its *text* color while `--fg` is its fill. A new dark section must set all four or buttons and borders will be invisible.

### Wave animation

`.wave-region` is a 200px-tall clipped strip pinned to the bottom of the hero holding four `.wave-track` layers. Each track is `width: 200%` and contains **the same SVG twice**; `wave-scroll` / `wave-scroll-rev` translate it ±50% for a seamless loop. If you change a wave path, change it in both SVGs of that track or the loop will visibly jump. Parallax comes from differing durations (34s / 24s / 19s / 16s), opacities, and alternating directions.

### Ambient particles

`.bubble` and `.spark` are hand-authored `<span>`s whose `top`, `left`, `width`, `height`, `animation-duration`, and `animation-delay` are all inline styles; the classes supply only the shared shape and keyframes. They live in absolutely-positioned `.bubbles` / `.sparks` overlays. The `.underwater` and `.deep-water` wrapper `<div>`s exist for no reason other than to be the `position: relative` containers those overlays span.

### Layering convention

Decorative layers sit at `z-index: 1`; content (`.nav`, `.hero-content`, `.section-inner`) sits at `z-index: 2`. Keep new decoration at 1 and new content at 2.

### Motion and responsive rules

- The `@media (prefers-reduced-motion: reduce)` block kills animations by naming each animated selector explicitly. **Any new animated element must be added to that selector list**, or it will keep moving for users who opted out.
- Single breakpoint at `max-width: 720px`: nav links hide entirely (there is no mobile menu), the projects grid collapses 3 columns → 1, and wave/section heights shrink.
- Navigation is anchor links (`#home`, `#about`, `#projects`, `#contact`) plus `scroll-behavior: smooth`, disabled under reduced motion.

## Content notes

Copy is first-person and specific to John (Hamilton County / Noblesville, Indiana; Hepworth Bros Car Detailing; Hepworth Homes; Pensacola Christian College). Contact is `mailto:hello@johnhepworth.com`. Project cards under `.projects-grid` are plain `.card` divs — the grid is `repeat(3, 1fr)`, so adding a fourth card wraps it to a new row alone.
