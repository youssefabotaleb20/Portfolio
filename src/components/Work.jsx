import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight, FiGithub, FiMaximize2, FiArrowRight } from 'react-icons/fi'
import { PROJECTS } from '../data/projects.js'
import { LAYERS, layerColor } from '../data/layers.js'
import Lightbox from './Lightbox.jsx'
import { Words, Rise, EASE } from './Reveal.jsx'
import useMedia from '../hooks/useMedia.js'

const GROUPS = [
  { id: 'client', label: 'Client work', anchor: 'work-client' },
  { id: 'product', label: 'Full-stack products', anchor: 'work-products' },
  { id: 'concept', label: 'Front-end concepts', anchor: 'work-concepts' },
]
const list = (group) => PROJECTS.filter((p) => p.group === group)

function Actions({ p, onScreens, small }) {
  const size = small ? 'btn-sm' : ''
  return (
    <div className="flex flex-wrap gap-2.5">
      {p.liveUrl && (
        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-solid ${size}`}>
          {p.liveLabel || 'Live demo'} <FiArrowUpRight />
        </a>
      )}
      {p.githubUrl && (
        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-ghost ${size}`}>
          Code <FiGithub />
        </a>
      )}
      {p.extra && (
        <a href={p.extra.url} target="_blank" rel="noopener noreferrer" className={`btn btn-ghost ${size}`}>
          {p.extra.label} <FiArrowUpRight />
        </a>
      )}
      <button type="button" onClick={onScreens} className={`btn btn-ghost ${size}`}>
        Screens <FiMaximize2 />
      </button>
    </div>
  )
}

function LayerDots({ ids }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Layers of the stack in this project">
      {LAYERS.filter((l) => ids.includes(l.id)).map((l) => (
        <li key={l.id} className="flex items-center gap-2 text-[14px] text-ink-2" style={{ '--c': l.color }}>
          <span className="dot" />{l.name}
        </li>
      ))}
    </ul>
  )
}

/* One project as a scene with three depths: the outlined name drifts sideways
   far behind, the framed screenshot swings flat as it reaches the middle of
   the screen while the image slides inside its frame, and the text rises. */
function Scene({ p, flip, onScreens }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const wide = useMedia('(min-width: 1024px)')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const dir = flip ? -1 : 1

  const ghostX = useTransform(scrollYProgress, [0, 1], flip ? ['-38%', '4%'] : ['4%', '-38%'])
  const imgY = useTransform(scrollYProgress, [0.15, 0.85], ['0%', '-10.5%']) // the shot is taller than its window
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], wide ? [dir * 20, 0, dir * -14] : [0, 0, 0])
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], wide ? [8, 0, -6] : [20, 0, -12])
  const frameY = useTransform(scrollYProgress, [0, 1], wide ? [90, -90] : [34, -34])
  const textY = useTransform(scrollYProgress, [0, 1], wide ? [40, -40] : [0, 0])

  return (
    <article ref={ref} id={`p-${p.id}`} className="relative py-12 md:py-24" style={{ '--c': layerColor(p.layers[0]) }}>
      <motion.div aria-hidden="true" style={{ x: reduce ? 0 : ghostX }} className="ghost absolute left-0 top-0 md:top-6">
        {p.name}
      </motion.div>

      <div className={`relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12`}>
        <div className={`lg:col-span-7 ${flip ? 'lg:order-last' : ''}`} style={{ perspective: 1400 }}>
          <motion.button
            type="button"
            onClick={onScreens}
            aria-label={`Open ${p.name} screenshots`}
            style={reduce ? {} : { rotateY, rotateX, y: frameY }}
            className="frame block w-full cursor-zoom-in text-left will-change-transform"
          >
            <span className="frame-bar" aria-hidden="true"><i /><i /><i /></span>
            <motion.span
              className="block overflow-hidden"
              initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '0px 0px -18% 0px' }}
              transition={{ duration: 1.3, ease: EASE }}
            >
              <span className="relative block aspect-[16/9] overflow-hidden">
                <motion.img
                  src={p.images[0]}
                  alt={`${p.name} screenshot`}
                  width="1280"
                  height="800"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{ y: reduce ? 0 : imgY }}
                  className="absolute left-0 top-0 h-[112%] w-full object-cover object-top"
                />
              </span>
            </motion.span>
          </motion.button>
        </div>

        <motion.div style={{ y: reduce ? 0 : textY }} className="min-w-0 lg:col-span-5">
          <Rise as="p" className="text-[15px] font-medium" style={{ color: 'var(--c)' }}>{p.kind}</Rise>
          <Words as="h3" text={p.name} className="display mt-2 block text-[clamp(46px,6vw,92px)]" />
          <Rise delay={0.1} as="p" className="lede mt-5 max-w-[30em]">{p.summary}</Rise>
          <Rise delay={0.16} className="mt-6"><LayerDots ids={p.layers} /></Rise>
          <Rise delay={0.22} as="ul" className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
            {p.tags.map((t) => <li key={t} className="chip">{t}</li>)}
          </Rise>
          {p.note && <Rise delay={0.26} as="p" className="small mt-5">{p.note}</Rise>}
          <Rise delay={0.3} className="mt-7"><Actions p={p} onScreens={onScreens} /></Rise>
        </motion.div>
      </div>
    </article>
  )
}

function ConceptCard({ p, onScreens, i }) {
  return (
    <article className="flex w-[82vw] max-w-[620px] flex-none snap-center flex-col sm:w-[62vw] lg:w-[40vw]" style={{ '--c': LAYERS[i % LAYERS.length].color }}>
      <button type="button" onClick={onScreens} aria-label={`Open ${p.name} screenshots`} className="frame group block w-full cursor-zoom-in">
        <span className="frame-bar" aria-hidden="true"><i /><i /><i /></span>
        <span className="block overflow-hidden">
          <img src={p.thumb} alt={`${p.name} screenshot`} width="960" height="600" loading="lazy" decoding="async" draggable={false}
            className="block aspect-[16/10] w-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
        </span>
      </button>
      <div className="mt-6 flex items-baseline justify-between gap-4">
        <h3 className="display text-[clamp(34px,3.600vw,56px)]">{p.name}</h3>
        <p className="text-right text-[14px] text-dim">{p.tags.join(', ')}</p>
      </div>
      <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{p.summary}</p>
      <div className="mt-5"><Actions p={p} onScreens={onScreens} small /></div>
    </article>
  )
}

/* Desktop: the section pins and vertical scroll drives the row sideways.
   Phones (and reduced motion): the same row as a native swipe carousel. */
function Concepts({ items, open }) {
  const wrap = useRef(null)
  const track = useRef(null)
  const reduce = useReducedMotion()
  const pinned = useMedia('(min-width: 1024px)') && !reduce
  const [dist, setDist] = useState(0)
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const bar = useTransform(scrollYProgress, [0, 1], [0.04, 1])

  useLayoutEffect(() => {
    if (!pinned) return
    const measure = () => setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [pinned])

  const head = (
    <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-4 px-5 md:px-10">
      <Words as="h3" text="Front-end concepts" className="display block text-[clamp(38px,5.400vw,84px)]" wordClass={(w, i) => (i === 1 ? 'display-i' : '')} />
      <p className="small flex items-center gap-2">{pinned ? 'Keep scrolling' : 'Swipe'} <FiArrowRight /></p>
    </div>
  )
  const cards = items.map((p, i) => <ConceptCard key={p.id} p={p} i={i} onScreens={() => open(p)} />)

  if (!pinned) {
    return (
      <div id="work-concepts" className="scroll-mt-20 py-16">
        {head}
        <div className="no-bar mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-10">{cards}</div>
      </div>
    )
  }
  return (
    <div id="work-concepts" ref={wrap} style={{ height: `calc(100vh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16">
        {head}
        <motion.div ref={track} style={{ x }} className="mt-9 flex w-max gap-10 px-10 will-change-transform">{cards}</motion.div>
        <div className="mx-10 mt-10 h-px bg-rule">
          <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-glow" />
        </div>
      </div>
    </div>
  )
}

export default function Work() {
  const [lightbox, setLightbox] = useState(null)
  const featured = [...list('client'), ...list('product')]

  // deep links such as #p-quill from the services list
  useEffect(() => {
    if (window.location.hash.startsWith('#p-')) document.querySelector(window.location.hash)?.scrollIntoView()
  }, [])

  return (
    <section id="work" className="relative">
      <div className="mx-auto max-w-[1500px] px-5 pt-24 md:px-10 md:pt-40">
        <Words as="h2" text="Selected work" className="display h-section block" wordClass={(w, i) => (i === 1 ? 'display-i text-glow' : '')} />
        <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-end">
          <Rise as="p" className="lede max-w-[32em]">
            Ten projects, each one live. The coloured dots show which layers of the stack I built in it.
          </Rise>
          <Rise delay={0.1} as="nav" aria-label="Jump to a kind of work" className="flex flex-wrap gap-2 md:justify-end">
            {GROUPS.map((g) => (
              <a key={g.id} href={`#${g.anchor}`} className="btn btn-ghost btn-sm">
                {g.label} <span className="text-dim">{list(g.id).length}</span>
              </a>
            ))}
          </Rise>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] overflow-x-clip px-5 md:px-10">
        <span id="work-client" className="block scroll-mt-24" />
        {featured.map((p, i) => (
          <div key={p.id}>
            {i === list('client').length && <span id="work-products" className="block scroll-mt-24" />}
            <Scene p={p} flip={i % 2 === 1} onScreens={() => setLightbox(p)} />
          </div>
        ))}
      </div>

      <Concepts items={list('concept')} open={setLightbox} />

      {lightbox && <Lightbox images={lightbox.images} title={lightbox.name} onClose={() => setLightbox(null)} />}
    </section>
  )
}
