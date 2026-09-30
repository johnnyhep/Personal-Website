# Personal Website

A simple, single‑page personal website built with plain HTML, CSS, and a little JavaScript. It includes a playful sailboat theme with cloud graphics and responsive styling.

## Quick Start
- Option 1: Double‑click `index.html` to open it in your browser.
- Option 2 (with a local server):
  - Python 3: `python3 -m http.server` then visit http://localhost:8000
  - Node (serve): `npx serve .` then visit the shown URL

## Project Structure
- `index.html` — Main page markup
- `styles.css` — Site styles (responsive layout, theme)
- `script.js` — Small interactions/behavior
- `images/` — Cloud SVGs and sailboat images used by the page

## Development Notes
- Since this is a static site, no build step is required.
- When testing locally, using a simple HTTP server avoids CORS issues some browsers enforce when opening files directly.

## Deployment
You can host this site on any static hosting service (e.g., GitHub Pages, Netlify, Vercel, or an S3/CloudFront setup). Just deploy the repository root as the site root.

## License
Add your preferred license here if you plan to share or open‑source the site.
