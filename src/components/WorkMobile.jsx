import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight, FiGithub, FiMaximize2, FiPlus } from 'react-icons/fi'
import { LAYERS, layerColor } from '../data/layers.js'
import { Words, Rise } from './Reveal.jsx'

/* Phones and tablets (below 1024px). Desktop keeps the parallax scenes and the
   pinned sideways gallery in Work.jsx; none of this renders there.

   1. A sticky bar of three tabs that tracks where you are in the section.
   2. Client work and products as a deck: each card pins under the bar and the
      next one slides over it, while the cards beneath shrink back and dim.
   3. Front-end concepts as an index you open one row at a time, so nothing
      on a phone depends on swiping sideways. */

const NAV_H = 64 // fixed site nav (h-16)
const BAR_H = 56 // this section's tab bar

const pad = (n) => String(n).padStart(2, '0')

function Buttons({ p, onScreens, screens = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {p.liveUrl && (
        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid btn-sm">
          {p.liveLabel || 'Live demo'} <FiArrowUpRight />
        </a>
      )}
      {p.githubUrl && (
        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
          Code <FiGithub />
        </a>
      )}
      {p.extra && (
        <a href={p.extra.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
          {p.extra.label} <FiArrowUpRight />
        </a>
      )}
      {screens && (
        <button type="button" onClick={onScreens} className="btn btn-ghost btn-sm">
          Screens <FiMaximize2 />
        </button>
      )}
    </div>
  )
}

function Shot({ p, src, onScreens, ratio = 'aspect-[16/10]', label }) {
  return (
    <button type="button" onClick={onScreens} aria-label={`Open ${p.name} screenshots`} className="frame relative block w-full text-left">
      <span className="frame-bar" aria-hidden="true"><i /><i /><i /></span>
      <img src={src} alt={`${p.name} screenshot`} width="960" height="600" loading="lazy" decoding="async" draggable={false}
        className={`block w-full object-cover object-top ${ratio}`} />
      {label && (
        <span className="absolute left-2.5 top-[40px] rounded-full bg-night/85 px-3 py-1 text-[13px] font-medium" style={{ color: 'var(--c)' }}>{label}</span>
      )}
      {p.images.length > 1 && (
        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-night/85 px-3 py-1.5 text-[13px] text-ink">
          <FiMaximize2 aria-hidden="true" /> {p.images.length} screens
        </span>
      )}
    </button>
  )
}

/* ── 1. Tab bar ───────────────────────────────────────── */
function TabBar({ groups, active, progress }) {
  return (
    <div className="sticky z-30 border-b border-rule bg-night/95" style={{ top: NAV_H, height: BAR_H }}>
      <nav aria-label="Jump to a kind of work" className="mx-auto flex h-full max-w-[720px] items-center gap-2 px-5">
        {groups.map((g) => {
          const on = active === g.anchor
          return (
            <a key={g.id} href={`#${g.anchor}`} aria-current={on ? 'true' : undefined}
              className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border text-[14px] transition-colors duration-300 ${on ? 'border-ink bg-ink text-night' : 'border-rule text-ink-2'}`}>
              {g.short} <span className={on ? 'text-night/60' : 'text-dim'}>{g.count}</span>
            </a>
          )
        })}
      </nav>
      <motion.div aria-hidden="true" style={{ scaleX: progress }} className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-glow" />
    </div>
  )
}

/* ── 2. The deck ──────────────────────────────────────── */
function DeckCard({ p, i, n, progress, onScreens }) {
  const reduce = useReducedMotion()
  const card = useRef(null)
  const base = NAV_H + BAR_H + 14 + i * 9
  const [top, setTop] = useState(base)
  // A card taller than the space under the bar sticks once its bottom edge is
  // in view instead, so no part of it is ever covered before it was seen.
  useEffect(() => {
    const fit = () => setTop(Math.min(base, window.innerHeight - card.current.offsetHeight - 12))
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(card.current)
    window.addEventListener('resize', fit)
    return () => { ro.disconnect(); window.removeEventListener('resize', fit) }
  }, [base])
  // Card i starts shrinking once the next card begins to cover it.
  const start = (i + 1) / n
  const end = Math.min(1, start + 1 / n)
  const scale = useTransform(progress, [start - 1 / n, start, 1], [1, 1, 1 - (n - 1 - i) * 0.045])
  const shade = useTransform(progress, [start - 0.5 / n, end], [0, 0.55])
  const last = i === n - 1

  return (
    <div className={`sticky ${i ? 'mt-6' : ''}`} style={{ top, zIndex: i + 1 }}>
      <motion.article
        ref={card}
        id={`p-${p.id}`}
        style={{ scrollMarginTop: NAV_H + BAR_H + 14 }}
        style={{ '--c': layerColor(p.layers[0]), scale: reduce || last ? 1 : scale, transformOrigin: '50% 0%' }}
        className="relative overflow-hidden rounded-[24px] border border-[color-mix(in_oklab,var(--c)_28%,transparent)] bg-plate p-4 shadow-[0_-18px_50px_-20px_rgb(0_0_0/0.9)] will-change-transform"
      >
        <span aria-hidden="true" className="aura -right-24 -top-24 h-64 w-64 opacity-70" />
        <Shot p={p} src={p.thumb} onScreens={onScreens} ratio="aspect-[16/9]" label={p.kind} />
        <div className="relative mt-4 flex items-baseline justify-between gap-3">
          <h3 className="display text-[clamp(36px,10vw,56px)]">{p.name}</h3>
          <span className="flex-none text-[13px] tabular-nums text-dim">{pad(i + 1)} / {pad(n)}</span>
        </div>
        <p className="relative mt-2 text-[16px] leading-relaxed text-ink-2">{p.summary}</p>
        <ul className="relative mt-3 flex flex-wrap gap-x-3.5 gap-y-1" aria-label="Layers of the stack in this project">
          {LAYERS.filter((l) => p.layers.includes(l.id)).map((l) => (
            <li key={l.id} className="flex items-center gap-1.5 text-[13.5px] text-ink-2" style={{ '--c': l.color }}>
              <span className="dot" />{l.name}
            </li>
          ))}
        </ul>
        <p className="relative mt-2 line-clamp-2 text-[13.5px] leading-snug text-dim">{p.tags.join(' · ')}</p>
        {p.note && <p className="relative mt-2 text-[13.5px] leading-snug text-ink-2">{p.note}</p>}
        <div className="relative mt-4"><Buttons p={p} onScreens={onScreens} /></div>
        {!reduce && !last && <motion.span aria-hidden="true" style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-night" />}
      </motion.article>
    </div>
  )
}

function Deck({ items, open, firstProduct }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <div ref={ref} className="relative mx-auto max-w-[720px] px-4 pb-10">
      {items.map((p, i) => [
        i === 0 && <span key="a-client" id="m-work-client" className="block" style={{ scrollMarginTop: NAV_H + BAR_H }} />,
        i === firstProduct && <span key="a-products" id="m-work-products" className="block" style={{ scrollMarginTop: NAV_H + BAR_H }} />,
        <DeckCard key={p.id} p={p} i={i} n={items.length} progress={scrollYProgress} onScreens={() => open(p)} />,
      ])}
    </div>
  )
}

/* ── 3. Concepts index ────────────────────────────────── */
function IndexRow({ p, i, isOpen, toggle, onScreens }) {
  const c = LAYERS[i % LAYERS.length].color
  const panel = `concept-${p.id}`
  return (
    <li id={`p-${p.id}`} className="border-b border-rule" style={{ '--c': c }}>
      <button type="button" onClick={toggle} aria-expanded={isOpen} aria-controls={panel}
        className="flex w-full items-center gap-4 py-5 text-left">
        <span className="w-7 flex-none text-[13px] tabular-nums text-dim">{pad(i + 1)}</span>
        <span className="min-w-0 flex-1">
          <span className={`display block text-[34px] transition-colors duration-300 ${isOpen ? 'display-i text-[var(--c)]' : ''}`}>{p.name}</span>
          <span className="mt-1 block truncate text-[13.5px] text-dim">{p.summary}</span>
        </span>
        <span className={`relative h-[46px] w-[72px] flex-none overflow-hidden rounded-lg border border-rule transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}>
          <img src={p.thumb} alt="" width="960" height="600" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
        </span>
        <span aria-hidden="true" className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border border-rule transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${isOpen ? 'rotate-45 border-ink' : ''}`}>
          <FiPlus />
        </span>
      </button>
      <div id={panel} role="region" aria-label={p.name}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="min-h-0 overflow-hidden" inert={isOpen ? undefined : ''}>
          <div className={`pb-7 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <Shot p={p} src={p.thumb} onScreens={onScreens} />
            <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{p.summary}</p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Built with">
              {p.tags.map((t) => <li key={t} className="chip">{t}</li>)}
            </ul>
            <div className="mt-5"><Buttons p={p} onScreens={onScreens} /></div>
          </div>
        </div>
      </div>
    </li>
  )
}

function ConceptIndex({ items, open }) {
  const [openId, setOpenId] = useState(items[0]?.id)
  // links such as #p-saffron from the services list open that row
  useEffect(() => {
    const onHash = () => {
      const hit = items.find((p) => window.location.hash === `#p-${p.id}`)
      if (hit) setOpenId(hit.id)
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [items])
  return (
    <div className="mx-auto max-w-[720px] px-5 pb-6 pt-14">
      <span id="m-work-concepts" className="block" style={{ scrollMarginTop: NAV_H + BAR_H + 8 }} />
      <Words as="h3" text="Front-end concepts" className="display block text-[clamp(40px,11vw,64px)]" wordClass={(w, i) => (i === 1 ? 'display-i' : '')} />
      <Rise as="p" className="small mt-3">Five interface studies. Tap one to open it.</Rise>
      <ul className="mt-6 border-t border-rule">
        {items.map((p, i) => (
          <IndexRow key={p.id} p={p} i={i} isOpen={openId === p.id} onScreens={() => open(p)}
            toggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))} />
        ))}
      </ul>
    </div>
  )
}

export default function WorkMobile({ featured, concepts, clientCount, groups, open }) {
  const ref = useRef(null)
  const [active, setActive] = useState('m-work-client')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // highlight the tab of whichever group is under the bar
  useEffect(() => {
    const ids = ['m-work-client', 'm-work-products', 'm-work-concepts']
    const onScroll = () => {
      const line = NAV_H + BAR_H + 40
      let cur = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) cur = id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const tabs = groups.map((g) => ({ ...g, anchor: `m-${g.anchor}` }))
  return (
    <div ref={ref} className="relative mt-10">
      <TabBar groups={tabs} active={active} progress={scrollYProgress} />
      <div className="pt-4">
        <Deck items={featured} open={open} firstProduct={clientCount} />
        <ConceptIndex items={concepts} open={open} />
      </div>
    </div>
  )
}
