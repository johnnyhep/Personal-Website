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

### Clouds

Three clouds sit in the hero (originally sourced from `images/left_cloud.svg`, `middle_cloud.svg`, `right_cloud.svg`), each pinned to a `.cloud-slot` — left flush against the left edge, right flush against the right edge, middle nudged down-and-right of the left cloud so the two form a loose cluster. Their markup is inlined directly into `index.html` rather than loaded via `url()`/`mask-image`: this site is meant to run via a plain `open index.html`, and several browsers (Safari included) silently block external resource loads like `mask-image` under the `file://` protocol, which was tried first and rendered the clouds invisible. Each source SVG ships its own multi-tone near-white fill colors per `<path>`; `.cloud path` in `styles.css` overrides all of them to one flat `rgb(225, 243, 252)` fill (a plain CSS rule beats an SVG presentation attribute regardless of specificity), which is what makes all three read as one uniform color despite differing source art — that color is deliberately its own literal, not one of the `--depth-*` tokens, since it isn't part of the section-gradient palette those drive. `aspect-ratio` on each `.cloud--*` matches its SVG's own `viewBox` so it scales without distortion. The drift animation (`cloud-drift`, `--drift` per cloud, negative `animation-delay`s to desync) lives on the inner `.cloud` `<svg>`, not the positioning `.cloud-slot` div, so repositioning a slot never has to account for the drift transform.

**Gotcha if you re-inline from the source SVGs:** `left_cloud.svg` and `middle_cloud.svg` each include one extra `<path>` that traces the *entire canvas* with the cloud silhouette cut out of it via `fill-rule="evenodd"` (a compound path, multiple `M` subpaths) — an artboard/background layer from the original export, invisible only because its fill happened to match a white canvas. Once every path is forced to the same `--depth-1` fill, that layer stops blending in and paints as a solid rectangle over the whole cloud. Both are already dropped from the markup in `index.html`; if you regenerate the inline SVGs from `images/*.svg`, drop any `<path>` whose bounding box covers roughly the entire `viewBox` in both dimensions and has more than one `M` subpath — that combination is the tell for this background-frame layer. `right_cloud.svg` has no such layer (single path, single subpath), which is why it never showed the problem.

### Sun

`.sun` is a flat 100px `rgb(252, 240, 191)` circle in the hero's top-right quadrant. Its halo is `.sun::before`, a `radial-gradient` whose opacity follows `ln(x)/x` under the substitution x = e^u, cubed: `(u·e^-u)^3`. Cubing sharpens the peak into a distinct bright ring and steepens the asymptotic exponential tail. u runs linearly from 0.5 at the disc edge (`--halo-start`, from `--sun-r`) to 5 at `--halo-end: 30vmax`. Starting at u = 0.5 (~56% of peak) makes the glow begin abruptly at the disc. The ring's peak opacity is 0.35. The stops are hand-computed, so changing the curve means regenerating them. (A stacked `box-shadow` glow was tried first and never visibly rendered, so it was removed.) Shrunk and repositioned under the 720px breakpoint alongside the other hero decoration.

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
