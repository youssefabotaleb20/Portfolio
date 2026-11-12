# Architecture

How the portfolio is put together, and why.

## Overview

A static single-page React app. There is no backend, database or API: the browser downloads one HTML file, one CSS file, one JavaScript bundle, two font families and the screenshots. GitHub Pages serves everything.

```
src/data/*.js  ──►  React components  ──►  vite build  ──►  dist/  ──►  GitHub Pages
 (content)          (layout, motion)                        (static files)
```

## Components

| Component | Role |
|---|---|
| `App.jsx` | Page order: Nav, Hero, Marquee, Work, Services, Skills, About, Contact, Footer |
| `Nav.jsx` | Fixed header, active-section pill, scroll progress line, full-screen phone menu |
| `Hero.jsx` | Name, intro, calls to action and the parallax layers around the stack |
| `Stack.jsx` | The six 3D plates. Takes a scroll progress value and spreads the plates with it |
| `Marquee.jsx` | Two bands of tech names that also slide with scroll |
| `Work.jsx` | Desktop (1024px and up): project scenes (`Scene`), the sideways concept gallery (`Concepts`) and the lightbox trigger. Below 1024px it renders `WorkMobile` instead |
| `WorkMobile.jsx` | Phones and tablets: sticky tab bar (Client, Products, Concepts), the stacking card deck for client work and products, and the tap-to-open concept index |
| `Lightbox.jsx` | Full-screen screenshots with keyboard, buttons and swipe |
| `Services.jsx` | Services with links to the projects that prove them |
| `Skills.jsx` | CV skill groups with a sticky live index on desktop |
| `About.jsx` | Portrait, summary, experience, education, languages |
| `Contact.jsx` | Email, copy button, client and recruiter links |
| `Reveal.jsx` | Shared entrance animations: `Words` (masked word rise) and `Rise` (fade up) |
| `Magnetic.jsx`, `Cursor.jsx` | Pointer effects, desktop only |

## Data flow

Content is plain JavaScript objects in `src/data/`. Components import them and render; nothing is fetched at runtime. `layers.js` is the colour source: each project lists the layers it touches and each skill group belongs to a layer, so the coloured dots, chips and glows across the page all come from the same six values.

## How the motion works

- **Scroll-linked motion** uses Framer Motion's `useScroll` and `useTransform`. These write straight to the element's `transform` and `opacity` outside React's render cycle, so scrolling causes no React re-renders.
- **The stack** is six absolutely positioned `div`s inside a CSS 3D rig (`perspective`, `preserve-3d`). Scroll progress changes each plate's `translateZ`; pointer position feeds a spring that tilts the rig.
- **Project scenes** have three depths: an outlined name that drifts sideways, a framed screenshot that swings flat as it reaches the middle of the screen while the image pans inside the frame, and text that rises.
- **The concept gallery** is a tall wrapper with a sticky full-height child on desktop; vertical scroll progress maps to a horizontal `translateX`. With reduced motion on desktop it is a native scroll-snap carousel instead. Phones never see it (see below).
- **Entrances** play once, when a block scrolls into view.

## Hosting

GitHub Pages, deployed by `.github/workflows/deploy.yml` on every push to `main` (build with Node 20, upload `dist/`, deploy). The site lives under `/Portfolio/`, so `vite.config.js` sets `base: '/Portfolio/'` and all asset paths go through `import.meta.env.BASE_URL`.

## Key decisions

- **Static site on GitHub Pages.** A portfolio needs no server, and Pages is free with no card on file.
- **Only `transform` and `opacity` are animated.** An earlier version of the site felt laggy on scroll. This one has no blur filters, no backdrop filters, no canvas and no WebGL; glows are plain radial gradients. Compositor-only properties keep scrolling smooth on phones.
- **No scroll hijacking.** The page uses the browser's native scroll, so it feels the same as every other site on the visitor's device. Motion is mapped to scroll position, never the other way round.
- **Phones get their own layout, not a cut-down one.** The stack opens the page and the menu opens as a full-screen reveal. Below 1024px the work section switches to `WorkMobile.jsx`:
  - A sticky tab bar under the nav shows Client, Products and Concepts, highlights the group you are in and carries a progress line.
  - Client work and products are a deck of cards. Each card is `position: sticky` and the next one slides over it, while the cards underneath scale down and dim (transform and opacity, driven by scroll progress). A card taller than the space under the bar sticks by its bottom edge instead, so nothing is covered before it is read. Tapping the screenshot opens the lightbox.
  - Front-end concepts are an index: one row per demo with a number, name and thumbnail; tapping a row opens it in place with the screenshot, stack and buttons. The first row starts open, and `#p-<id>` links open their row.
  - Why: the earlier phone layout put the concepts in a sideways swipe row, which did not scroll on Youssef's phone (2026-11-12). Nothing on a phone now depends on swiping sideways, and the deck shows each project one at a time at full width.
  - The index rows open with a `grid-template-rows` transition, the one layout animation on the site. It only touches a small block, so it stays smooth.
- **Content mirrors the CV.** Skill groups, project summaries, experience and education use the CV's wording and order, so a recruiter reading both sees the same story. The data files are the only place to edit.
- **Colour carries meaning.** Six layer colours, one per part of the stack, instead of a single accent. A visitor can see at a glance which layers a project covers.
- **Self-hosted variable fonts.** Fraunces (display) and Geist (text) come from Fontsource packages, so there is no request to a third-party font server.
- **Reduced motion is respected.** With the system setting on, parallax, tilts, the marquee and the pinned gallery are switched off and content simply appears.
