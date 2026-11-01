import { useMemo, useRef, useState } from 'react'
import {
  motion, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion, AnimatePresence,
} from 'framer-motion'
import { FiExternalLink, FiGithub, FiMaximize2 } from 'react-icons/fi'
import { PROJECTS, projectName } from '../data/projects.js'
import Lightbox from './Lightbox.jsx'
import useMedia from '../hooks/useMedia.js'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'client', label: 'Client work' },
  { id: 'fullstack', label: 'Full-stack' },
  { id: 'web', label: 'Web' },
]

const KIND = { client: 'Client project', web: 'Web · concept demo', fullstack: 'Full-stack · concept demo' }

const GAP = 1100 // distance between panels along z

function Filters({ filter, setFilter, count }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => setFilter(f.id)}
          aria-pressed={filter === f.id}
          className={`mono h-9 border px-3 transition-colors ${
            filter === f.id ? 'border-ink bg-ink text-ground' : 'border-rule text-ink-2 hover:border-ink'
          }`}
        >
          {f.label}
        </button>
      ))}
      <span className="mono ml-2 text-dim tabular">{count} in scene</span>
    </div>
  )
}

function Details({ project, onScreens }) {
  return (
    <div className="min-w-0">
      <p className="mono text-cut">{KIND[project.category]}</p>
      <h3 className="mt-3 font-display text-[clamp(36px,4vw,60px)] font-bold leading-[0.95] tracking-[-0.02em]">
        {projectName(project)}
      </h3>
      <p className="mt-4 max-w-[34em] text-[17px] leading-relaxed text-ink-2">{project.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1" aria-label="Stack">
        {project.tags.map((t) => (
          <li key={t} className="mono text-dim">{t}</li>
        ))}
      </ul>
      <div className="mt-7 flex flex-wrap gap-3">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cut h-11 px-5 text-[15px]">
            {project.liveLabel || 'Live demo'} <FiExternalLink />
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line h-11 px-5 text-[15px]">
            Code <FiGithub />
          </a>
        )}
        <button type="button" onClick={onScreens} className="btn btn-line h-11 px-5 text-[15px]">
          Screens <FiMaximize2 />
        </button>
      </div>
    </div>
  )
}

/* Desktop: a sticky 3D scene; scrolling moves the camera through the panels. */
function Flythrough({ list, filter, setFilter, openLightbox }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  // dwell on each project: the camera rests at a panel, then glides to the next
  const camZ = useTransform(progress, (v) => {
    const t = Math.min(Math.max(v, 0), 1) * (list.length - 1)
    const f = Math.floor(t)
    const frac = t - f
    const k = frac < 0.3 ? 0 : frac > 0.7 ? 1 : (frac - 0.3) / 0.4
    const eased = k * k * (3 - 2 * k)
    return Math.min(f + eased, list.length - 1) * GAP
  })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(list.length - 1, Math.max(0, Math.round(v * (list.length - 1)))))
  })

  const project = list[active] ?? list[0]

  return (
    <div ref={ref} style={{ height: `${list.length * 85 + 40}vh` }} className="relative">
      <div className="sticky top-14 h-[calc(100vh-56px)] overflow-hidden">
        <div aria-hidden="true" className="grid-floor pointer-events-none absolute -inset-x-[40%] bottom-[-50%] h-full" style={{ transform: 'perspective(600px) rotateX(64deg)', transformOrigin: 'center top' }} />
        <div className="relative mx-auto grid h-full max-w-[1600px] grid-cols-[minmax(0,4fr)_minmax(0,8fr)] items-center gap-10 px-8">
          <div className="relative z-10 flex h-full min-w-0 flex-col justify-between py-10">
            <div>
              <h2 className="font-display text-[clamp(40px,4.5vw,72px)] font-extrabold leading-[0.9] tracking-[-0.03em]">
                Selected work
              </h2>
              <div className="mt-6"><Filters filter={filter} setFilter={setFilter} count={list.length} /></div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={project.code}
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Details project={project} onScreens={() => openLightbox(project)} />
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-4">
              <span className="mono text-dim tabular">
                {String(active + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
              </span>
              <div className="relative h-px flex-1 bg-rule">
                <motion.div className="absolute inset-y-0 left-0 bg-cut" style={{ width: useTransform(progress, (v) => `${v * 100}%`), height: 2, top: -0.5 }} />
              </div>
            </div>
          </div>

          <div className="relative h-full" style={{ perspective: 1200, perspectiveOrigin: '40% 45%' }}>
            <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', z: camZ }}>
              {list.map((p, i) => (
                <ScenePanel key={p.code} p={p} i={i} camZ={camZ} onOpen={() => openLightbox(p)} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScenePanel({ p, i, camZ, onOpen }) {
  const z = -i * GAP
  const x = i % 2 === 0 ? '0%' : '12%'
  const top = i % 2 === 0 ? '17%' : '23%'
  // fade the panel as the camera passes through it
  const opacity = useTransform(camZ, (c) => {
    const rel = z + c
    if (rel > 420) return 0
    if (rel > 120) return 1 - (rel - 120) / 300
    if (rel < -3300) return 0
    return 1
  })
  const rotateY = i % 2 === 0 ? -14 : 12
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      tabIndex={-1}
      aria-hidden="true"
      className="panel absolute w-[86%] cursor-zoom-in text-left"
      style={{ left: x, top, z, rotateY, opacity, transformStyle: 'preserve-3d' }}
    >
      <span className="mono absolute -top-6 left-0 whitespace-nowrap text-ink">
        <span className="text-cut">{p.destination}</span> / {p.tags.join(' · ')}
      </span>
      <img src={p.images[0]} alt="" loading="lazy" className="block aspect-[16/10] w-full object-cover object-top" draggable={false} />
      <span className="mono absolute -bottom-6 right-0 text-dim tabular">z {z}</span>
    </motion.button>
  )
}

/* Phones and reduced motion: a plain annotated list. */
function List({ list, filter, setFilter, openLightbox }) {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-8">
      <h2 className="font-display text-[clamp(40px,8vw,72px)] font-extrabold leading-[0.9] tracking-[-0.03em]">Selected work</h2>
      <div className="mt-6"><Filters filter={filter} setFilter={setFilter} count={list.length} /></div>
      <div className="mt-14 grid gap-16">
        {list.map((p) => (
          <article key={p.code} className="grid gap-8 md:grid-cols-2 md:items-center">
            <button type="button" onClick={() => openLightbox(p)} className="panel relative block cursor-zoom-in" aria-label={`Open ${p.destination} screenshots`}>
              <img src={p.images[0]} alt="" loading="lazy" className="block aspect-[16/10] w-full object-cover object-top" />
            </button>
            <Details project={p} onScreens={() => openLightbox(p)} />
          </article>
        ))}
      </div>
    </div>
  )
}

export default function Work() {
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState(null)
  const reduce = useReducedMotion()
  const wide = useMedia('(min-width: 1024px)')

  const list = useMemo(() => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)), [filter])
  const changeFilter = (f) => {
    setFilter(f)
    const el = document.getElementById('work')
    if (el && window.scrollY > el.offsetTop) window.scrollTo({ top: el.offsetTop, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="work" className="relative border-t border-rule bg-ground-2">
      {wide && !reduce ? (
        <Flythrough key={filter} list={list} filter={filter} setFilter={changeFilter} openLightbox={setLightbox} />
      ) : (
        <List list={list} filter={filter} setFilter={changeFilter} openLightbox={setLightbox} />
      )}
      {lightbox && (
        <Lightbox images={lightbox.images} title={lightbox.destination} onClose={() => setLightbox(null)} />
      )}
    </section>
  )
}
