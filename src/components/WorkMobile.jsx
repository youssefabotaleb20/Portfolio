import { useEffect, useRef, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { FiArrowUpRight, FiGithub, FiMaximize2, FiPlus } from 'react-icons/fi'
import { LAYERS, layerColor } from '../data/layers.js'
import { Words, Rise } from './Reveal.jsx'

/* Phones and tablets (below 1024px). Desktop keeps the parallax scenes and the
   pinned sideways gallery in Work.jsx; none of this renders there.

   A sticky bar of three tabs tracks where you are. Every group (client work,
   products, concepts) is an index: one quiet row per project with a number,
   name, one-line summary and thumbnail. Tapping a row opens it in place with
   the screenshot, stack and buttons. One row per group is open at a time, so
   the page stays short and nothing depends on swiping sideways. */

const NAV_H = 64 // fixed site nav (h-16)
const BAR_H = 56 // this section's tab bar
const pad = (n) => String(n).padStart(2, '0')

function Buttons({ p }) {
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
    </div>
  )
}

function Shot({ p, onScreens }) {
  return (
    <button type="button" onClick={onScreens} aria-label={`Open ${p.name} screenshots`} className="frame relative block w-full text-left">
      <span className="frame-bar" aria-hidden="true"><i /><i /><i /></span>
      <img src={p.thumb} alt={`${p.name} screenshot`} width="960" height="600" loading="lazy" decoding="async" draggable={false}
        className="block aspect-[16/10] w-full object-cover object-top" />
      {p.images.length > 1 && (
        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-night/85 px-3 py-1.5 text-[13px] text-ink">
          <FiMaximize2 aria-hidden="true" /> {p.images.length} screens
        </span>
      )}
    </button>
  )
}

/* ── Tab bar ──────────────────────────────────────────── */
function TabBar({ groups, active, progress }) {
  return (
    <div className="sticky z-30 border-b border-rule bg-night" style={{ top: NAV_H, height: BAR_H }}>
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

/* ── One row of an index ──────────────────────────────── */
function Row({ p, n, color, rich, isOpen, toggle, onScreens }) {
  const ref = useRef(null)
  const touched = useRef(false) // only rows the visitor opened may scroll the page
  const panel = `panel-${p.id}`

  // After a row opens, bring its top under the tab bar if the row above
  // closing (or the opening itself) pushed it out of view.
  useEffect(() => {
    if (!isOpen || !touched.current || !ref.current) return
    const t = setTimeout(() => {
      const top = ref.current.getBoundingClientRect().top
      if (top < NAV_H + BAR_H || top > window.innerHeight * 0.45) {
        window.scrollBy({ top: top - NAV_H - BAR_H - 8, behavior: 'smooth' })
      }
    }, 520)
    return () => clearTimeout(t)
  }, [isOpen])

  return (
    <li ref={ref} id={`p-${p.id}`} className="border-b border-rule" style={{ '--c': color, scrollMarginTop: NAV_H + BAR_H + 8 }}>
      <button type="button" onClick={() => { touched.current = true; toggle() }} aria-expanded={isOpen} aria-controls={panel} className="flex w-full items-center gap-4 py-5 text-left">
        <span className="w-6 flex-none self-start pt-3 text-[13px] tabular-nums text-dim">{pad(n)}</span>
        <span className="min-w-0 flex-1">
          {rich && <span className="mb-1 block text-[12.5px] font-medium uppercase tracking-[0.08em]" style={{ color: 'var(--c)' }}>{p.kind}</span>}
          <span className={`display block text-[34px] transition-colors duration-300 ${isOpen ? 'display-i text-[var(--c)]' : ''}`}>{p.name}</span>
          <span className={`mt-1 block truncate text-[13.5px] text-dim transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}>{p.summary}</span>
        </span>
        <span className={`h-[46px] w-[72px] flex-none overflow-hidden rounded-lg border border-rule transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}>
          <img src={p.thumb} alt="" width="960" height="600" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
        </span>
        <span aria-hidden="true" className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${isOpen ? 'rotate-45 border-ink' : 'border-rule'}`}>
          <FiPlus />
        </span>
      </button>
      <div id={panel} role="region" aria-label={p.name}
        className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="min-h-0 overflow-hidden" inert={isOpen ? undefined : ''}>
          <div className={`pb-7 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <Shot p={p} onScreens={onScreens} />
            <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{p.summary}</p>
            {rich && (
              <ul className="mt-4 flex flex-wrap gap-x-3.5 gap-y-1" aria-label="Layers of the stack in this project">
                {LAYERS.filter((l) => p.layers.includes(l.id)).map((l) => (
                  <li key={l.id} className="flex items-center gap-1.5 text-[13.5px] text-ink-2" style={{ '--c': l.color }}>
                    <span className="dot" />{l.name}
                  </li>
                ))}
              </ul>
            )}
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
              {p.tags.map((t) => <li key={t} className="chip">{t}</li>)}
            </ul>
            {p.note && <p className="small mt-4">{p.note}</p>}
            <div className="mt-5"><Buttons p={p} /></div>
          </div>
        </div>
      </div>
    </li>
  )
}

/* ── A titled index (client work, products or concepts) ── */
function Index({ anchor, title, italic, intro, items, start = 1, rich, colorOf, open }) {
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
    <div className="mx-auto max-w-[720px] px-5 pt-12">
      <span id={anchor} className="block" style={{ scrollMarginTop: NAV_H + BAR_H + 8 }} />
      <Words as="h3" text={title} className="display block text-[clamp(38px,10.500vw,60px)]" wordClass={(w, i) => (i === italic ? 'display-i' : '')} />
      <Rise as="p" className="small mt-2.5">{intro}</Rise>
      <ul className="mt-5 border-t border-rule">
        {items.map((p, i) => (
          <Row key={p.id} p={p} n={start + i} rich={rich} color={colorOf(p, i)} isOpen={openId === p.id}
            onScreens={() => open(p)} toggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))} />
        ))}
      </ul>
    </div>
  )
}

export default function WorkMobile({ clients, products, concepts, groups, open }) {
  const ref = useRef(null)
  const [active, setActive] = useState('m-work-client')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // highlight the tab of whichever group is under the bar
  useEffect(() => {
    const ids = ['m-work-client', 'm-work-products', 'm-work-concepts']
    const onScroll = () => {
      const line = NAV_H + BAR_H + 60
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
  const byLayer = (p) => layerColor(p.layers[0])
  return (
    <div ref={ref} className="relative mt-10 pb-6">
      <TabBar groups={tabs} active={active} progress={scrollYProgress} />
      <Index anchor="m-work-client" title="Client work" italic={1} intro="Built for a real client and live today."
        items={clients} rich colorOf={byLayer} open={open} />
      <Index anchor="m-work-products" title="Full-stack products" italic={1} intro="Four products, front to back, each one live. Tap one to open it."
        items={products} start={clients.length + 1} rich colorOf={byLayer} open={open} />
      <Index anchor="m-work-concepts" title="Front-end concepts" italic={1} intro="Five interface studies. Tap one to open it."
        items={concepts} start={clients.length + products.length + 1} colorOf={(p, i) => LAYERS[i % LAYERS.length].color} open={open} />
    </div>
  )
}
