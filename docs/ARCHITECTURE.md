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
| `Hero.jsx` | Desktop: name, intro, calls to action and the parallax layers around the stack. Below 1024px: `MobileHero` (see below) |
| `Stack.jsx` | The six 3D plates. Takes a scroll progress value and spreads the plates with it |
| `Marquee.jsx` | Two bands of tech names that also slide with scroll |
| `Work.jsx` | Desktop (1024px and up): project scenes (`Scene`), the sideways concept gallery (`Concepts`) and the lightbox trigger. Below 1024px it renders `WorkMobile` instead |
| `WorkMobile.jsx` | Phones and tablets: sticky tab bar (Client, Products, Concepts) and a tap-to-open index for each group |
| `Lightbox.jsx` | Full-screen screenshots with keyboard, buttons and swipe |
| `Services.jsx` | Services with links to the projects that prove them |
| `Skills.jsx` | CV skill groups with a sticky live index on desktop; a tap-to-open list (`MobileSkills`) below 1024px |
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
- **Phones get their own layout, not a cut-down one.** Below 1024px the hero, the work section and the skills section each render a phone version. The menu opens as a full-screen reveal.
  - **Hero (`MobileHero` in `Hero.jsx`)** fits one screen. An availability pill sits on top, then the stack as an emblem that lights one layer at a time (every 1.9 s, or on tap) with the layer's name beneath it, then the name, one line about the work, and the Hire me and CV buttons above the fold. Plate labels show only on the lit plate, because six labels on a 150px stack overlapped. Unlike desktop, the text never fades on scroll, since on a phone you are still reading it.
  - **Work (`WorkMobile.jsx`)** has a sticky Client / Products / Concepts tab bar under the nav that follows the scroll and carries a progress line. Every group is an index: one row per project with a number, the name, a one-line summary and a thumbnail. Tapping a row opens it in place with the screenshot, layers, stack, note and buttons. Each group has its first row open, and `#p-<id>` links from the services list open their row.
  - **Skills (`MobileSkills` in `Skills.jsx`)** shows the nine CV groups as rows with a count and a three-skill preview, and tapping a row opens all its chips. Without this it was a wall of about 90 chips across six screens.
  - Why (2026-11-12): the first phone layout had a sideways swipe row for the concepts, which didn't scroll on Youssef's phone. A stacking card deck for the products came next and felt cluttered, so the projects now use the same index pattern as the concepts. He liked that pattern, and it keeps the page short.
  - Index rows open with a `grid-template-rows` transition, the one layout animation on the site. It only touches a small block, so it stays smooth.
- **Content mirrors the CV.** Skill groups, project summaries, experience and education use the CV's wording and order, so a recruiter reading both sees the same story. The data files are the only place to edit.
- **Colour carries meaning.** Six layer colours, one per part of the stack, instead of a single accent. A visitor can see at a glance which layers a project covers.
- **Self-hosted variable fonts.** Fraunces (display) and Geist (text) come from Fontsource packages, so there is no request to a third-party font server.
- **Reduced motion is respected.** With the system setting on, parallax, tilts, the marquee and the pinned gallery are switched off and content simply appears.
