# Portfolio

Youssef Abotaleb's personal portfolio: a dark, animated single-page site that presents his projects, services, skills and experience, and mirrors his CV.

**Live:** https://youssefabotaleb20.github.io/Portfolio/

## What is on the page

- **Hero** with the site's signature: the full stack drawn as six floating plates of light (frontend, mobile, backend, AI and data, databases, cloud and DevOps). Scrolling pulls the plates apart; the pointer tilts them.
- **Selected work**: ten live projects. The client project and the four full-stack products are full scenes with parallax screenshots; the five front-end concepts sit in a pinned sideways gallery. On phones and tablets every group becomes a tap-to-open index under a sticky Client / Products / Concepts tab bar. Every project has live, code and screenshot buttons.
- **What I build**: five services, each linked to the projects that prove it.
- **The full stack**: every skill on the CV, in the CV's own groups.
- **About me**: summary, experience, education and languages, as on the CV.
- **Contact**: email (with copy), Upwork and Fiverr for clients, CV, LinkedIn and GitHub for recruiters.

## Stack

- React 18 and Vite 5
- Tailwind CSS 4 (design tokens in `src/index.css`)
- Framer Motion for scroll-linked and entrance animation
- Fraunces and Geist variable fonts, self-hosted through Fontsource
- GitHub Pages, deployed by GitHub Actions

## Local setup

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev      # http://localhost:5173/Portfolio/
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Environment variables

None. The site is fully static and has no backend, keys or secrets.

## Editing content

All content lives in `src/data/`, so text changes never touch the components.

| File | Holds |
|---|---|
| `me.js` | Name, summary, experience, education, languages, email and social links |
| `projects.js` | The projects: summary, stack, links, screenshots and group (`client`, `product` or `concept`) |
| `skills.js` | Skill groups (same as the CV's Core Expertise) and the services list |
| `layers.js` | The six stack layers and their colours |

To add a project: put `name1.webp`, `name2.webp`... in `public/projects/` and a 960x600 `name1.webp` in `public/projects/thumbs/`, then add an entry to `projects.js`.

The CV offered for download is `public/Youssef_Abotaleb_CV.pdf`. When the CV changes, replace that file and update `me.js` and `skills.js` so the site keeps mirroring it.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages. The Vite `base` is `/Portfolio/` to match the Pages URL.

More detail on how it is put together is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
