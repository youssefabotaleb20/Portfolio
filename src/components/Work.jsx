import Floor from './Floor.jsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiExternalLink, FiGithub, FiMaximize2 } from 'react-icons/fi'
import { PROJECTS, projectName } from '../data/projects.js'
import Lightbox from './Lightbox.jsx'
import Decode from './Decode.jsx'
import useMedia from '../hooks/useMedia.js'
import useInView from '../hooks/useInView.js'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'client', label: 'Client work' },
  { id: 'fullstack', label: 'Full-stack' },
  { id: 'web', label: 'Web' },
]
const KIND = { client: 'Client project', web: 'Web · concept demo', fullstack: 'Full-stack · concept demo' }
const GAP = 1000 // distance between panels along z

function Filters({ filter, setFilter, count }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => setFilter(f.id)}
          aria-pressed={filter === f.id}
          className={`mono h-9 border px-3 transition-colors duration-300 ${
            filter === f.id ? 'border-cut bg-cut text-ground' : 'border-rule text-ink-2 hover:border-ink hover:text-ink'
          }`}
        >
          {f.label}
        </button>
      ))}
      <span className="mono ml-1 text-dim tabular">{count} in scene</span>
    </div>
  )
}

function Details({ project, onScreens }) {
  return (
    <div className="min-w-0">
      <p className="mono text-cut">{KIND[project.category]}</p>
      <h3 className="mt-3 font-display text-[clamp(34px,4vw,60px)] font-bold leading-[0.95] tracking-[-0.02em]">{projectName(project)}</h3>
      <p className="mt-4 max-w-[34em] text-[17px] leading-relaxed text-ink-2">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1" aria-label="Stack">
        {project.tags.map((t) => <li key={t} className="mono text-dim">{t}</li>)}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
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

/* Desktop: a sticky scene. One rAF loop maps scroll straight to camera depth,
   with a short rest at each project. No springs, so it never lags the wheel. */
function Flythrough({ list, filter, setFilter, openLightbox }) {
  const ref = useRef(null)
  const camera = useRef(null)
  const bar = useRef(null)
  const panels = useRef([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf = 0
    let last = -1
    const n = list.length
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const v = Math.min(Math.max(-r.top / total, 0), 1)
      const t = v * (n - 1)
      const f = Math.floor(t)
      const frac = t - f
      const k = frac < 0.28 ? 0 : frac > 0.72 ? 1 : (frac - 0.28) / 0.44
      const z = Math.min(f + k * k * (3 - 2 * k), n - 1) * GAP
      if (camera.current) camera.current.style.transform = `translate3d(0,0,${z}px)`
      if (bar.current) bar.current.style.transform = `scaleX(${v})`
      panels.current.forEach((p, i) => {
        if (!p) return
        const rel = -i * GAP + z
        const o = rel > 380 ? 0 : rel > 80 ? 1 - (rel - 80) / 300 : rel < -2600 ? 0 : 1
        p.style.opacity = o
        p.style.visibility = o === 0 ? 'hidden' : 'visible'
      })
      const a = Math.round(t)
      if (a !== last) { last = a; setActive(a) }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [list])

  const project = list[active] ?? list[0]

  return (
    <div ref={ref} style={{ height: `${list.length * 80 + 40}vh` }} className="relative">
      <div className="sticky top-14 h-[calc(100vh-56px)] overflow-hidden">
        <Floor style={{ height: '70%' }} />
        <div className="relative mx-auto grid h-full max-w-[1600px] grid-cols-[minmax(0,4fr)_minmax(0,8fr)] items-center gap-10 px-8">
          <div className="relative z-10 flex h-full min-w-0 flex-col justify-between py-10">
            <div>
              <Decode as="h2" text="Selected work" className="block font-display text-[clamp(40px,4.5vw,72px)] font-extrabold leading-[0.9] tracking-[-0.03em]" />
              <div className="mt-6"><Filters filter={filter} setFilter={setFilter} count={list.length} /></div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={project.code}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Details project={project} onScreens={() => openLightbox(project)} />
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-4">
              <span className="mono text-dim tabular">{String(active + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
              <div className="relative h-[2px] flex-1 bg-rule">
                <div ref={bar} className="absolute inset-0 origin-left bg-cut" style={{ transform: 'scaleX(0)' }} />
              </div>
            </div>
          </div>

          <div className="relative h-full" style={{ perspective: 1100, perspectiveOrigin: '45% 45%' }}>
            <div ref={camera} className="absolute inset-0 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
              {list.map((p, i) => (
                <button
                  key={p.code}
                  ref={(el) => { panels.current[i] = el }}
                  type="button"
                  onClick={() => openLightbox(p)}
                  tabIndex={-1}
                  aria-hidden="true"
                  className={`panel absolute w-[84%] cursor-zoom-in text-left transition-[border-color] duration-300 ${i === active ? 'border-cut' : ''}`}
                  style={{
                    left: i % 2 === 0 ? '2%' : '14%',
                    top: i % 2 === 0 ? '16%' : '22%',
                    transform: `translate3d(0,0,${-i * GAP}px) rotateY(${i % 2 === 0 ? -12 : 12}deg)`,
                  }}
                >
                  <span className="mono absolute -top-6 left-0 whitespace-nowrap text-ink-2">
                    <span className="text-cut">{p.destination}</span> / {p.tags.join(' · ')}
                  </span>
                  <img src={p.thumb} alt="" width="960" height="600" loading={i < 2 ? 'eager' : 'lazy'} decoding="async" className="block aspect-[16/10] w-full object-cover object-top" draggable={false} />
                  <span className="mono absolute -bottom-6 right-0 text-dim tabular">z {-i * GAP}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Phones and reduced motion: cards that wipe in as they enter. */
function Card({ p, openLightbox }) {
  const [ref, inView] = useInView({ margin: '0px 0px -12% 0px' })
  return (
    <article ref={ref} className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
      <button
        type="button"
        onClick={() => openLightbox(p)}
        className={`scan panel relative block cursor-zoom-in overflow-hidden ${inView ? 'is-in' : ''}`}
        style={{ '--scan-h': '100%' }}
        aria-label={`Open ${projectName(p)} screenshots`}
      >
        <img
          src={p.thumb}
          alt=""
          width="960"
          height="600"
          loading="lazy"
          decoding="async"
          className="block aspect-[16/10] w-full object-cover object-top transition-[clip-path,transform] duration-1000 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ clipPath: inView ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', transform: inView ? 'scale(1)' : 'scale(1.08)' }}
        />
      </button>
      <div className={`transition-[opacity,transform] duration-700 ease-out ${inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <Details project={p} onScreens={() => openLightbox(p)} />
      </div>
    </article>
  )
}

function List({ list, filter, setFilter, openLightbox }) {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 md:py-28">
      <Decode as="h2" text="Selected work" className="block font-display text-[clamp(44px,11vw,72px)] font-extrabold leading-[0.9] tracking-[-0.03em]" />
      <div className="mt-6"><Filters filter={filter} setFilter={setFilter} count={list.length} /></div>
      <div className="mt-12 grid gap-16">
        {list.map((p) => <Card key={p.code} p={p} openLightbox={openLightbox} />)}
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
    if (el && window.scrollY > el.offsetTop) window.scrollTo({ top: el.offsetTop, behavior: 'auto' })
  }

  return (
    <section id="work" className="relative border-t border-rule bg-ground">
      {wide && !reduce && list.length > 1 ? (
        <Flythrough key={filter} list={list} filter={filter} setFilter={changeFilter} openLightbox={setLightbox} />
      ) : (
        <List list={list} filter={filter} setFilter={changeFilter} openLightbox={setLightbox} />
      )}
      {lightbox && <Lightbox images={lightbox.images} title={projectName(lightbox)} onClose={() => setLightbox(null)} />}
    </section>
  )
}
