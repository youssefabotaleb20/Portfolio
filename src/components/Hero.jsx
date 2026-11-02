import Floor from './Floor.jsx'
import { useEffect, useRef, useState } from 'react'
import { FiArrowDownRight, FiDownload } from 'react-icons/fi'
import { ME } from '../data/me.js'
import { PROJECTS, projectName } from '../data/projects.js'
import useDecode from '../hooks/useDecode.js'
import useMedia from '../hooks/useMedia.js'
import Magnetic from './Magnetic.jsx'

const ROLES = ['web apps', 'mobile apps', 'REST APIs', 'dashboards', 'AI features']

// Scene slots in px inside an 860 x 620 stage. k = how fast the panel drifts on scroll.
const SLOTS = [
  { x: 30, y: 90, z: 80, w: 560, k: -0.32 },
  { x: 480, y: 0, z: -200, w: 300, k: -0.14 },
  { x: 520, y: 320, z: -60, w: 300, k: -0.24 },
  { x: -30, y: 440, z: -280, w: 270, k: -0.1 },
]
const LABEL = { client: 'Client · Live', web: 'Web', fullstack: 'Full-stack' }

function RoleLine() {
  const [i, setI] = useState(0)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => { setI((n) => (n + 1) % ROLES.length); setTick((t) => t + 1) }, 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <p className="mt-7 font-display text-[clamp(22px,2.4vw,32px)] font-medium leading-tight text-ink-2">
      I design and build <RoleWord key={tick} word={ROLES[i]} />
    </p>
  )
}

function RoleWord({ word }) {
  const shown = useDecode(word, true, { duration: 500 })
  return <span className="caret text-cut" aria-live="polite">{shown}</span>
}

/* Desktop scene: one rAF loop writes the tilt and the scroll offset as CSS vars. */
function Scene({ featured }) {
  const stage = useRef(null)
  const wrap = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, running = true
    const spot = document.getElementById('hero-spot')
    const onMove = (e) => {
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
      if (spot) { spot.style.setProperty('--mx', `${e.clientX}px`); spot.style.setProperty('--my', `${e.clientY + window.scrollY}px`) }
    }
    const loop = () => {
      if (!running) return
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      const sy = Math.min(window.scrollY, 1200)
      const el = stage.current
      if (el) {
        el.style.transform = `rotateY(${-24 + x * 12}deg) rotateX(${6 - y * 8}deg)`
        el.style.setProperty('--sy', sy)
      }
      raf = requestAnimationFrame(loop)
    }
    // pause the loop while the hero is off screen
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
      if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop) }
    })
    if (wrap.current) io.observe(wrap.current)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('pointermove', onMove) }
  }, [])

  return (
    <div ref={wrap} className="relative h-[620px]" style={{ perspective: 1500 }} aria-label="Featured projects">
      <div
        ref={stage}
        className="absolute left-0 top-0 h-[620px] w-[860px] origin-top-left scale-[0.82] xl:scale-[0.92] 2xl:scale-100"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-24deg) rotateX(6deg)', '--sy': 0 }}
      >
        {featured.map((p, i) => {
          const s = SLOTS[i]
          return (
            <a
              key={p.code}
              href="#work"
              className="group absolute block"
              style={{
                left: s.x, top: s.y, width: s.w,
                transformStyle: 'preserve-3d',
                transform: `translate3d(0, calc(var(--sy) * ${s.k} * 1px), ${s.z}px)`,
              }}
            >
              <div
                className="panel transition-transform duration-500 ease-out group-hover:[transform:translateZ(70px)]"
                style={{ animation: `panel-in 1.4s cubic-bezier(.16,1,.3,1) ${0.2 + i * 0.12}s backwards` }}
              >
                <span className="mono absolute -top-6 left-0 whitespace-nowrap text-ink-2">
                  <span className="text-cut">{p.destination}</span> / {LABEL[p.category]}
                </span>
                <img src={p.thumb} alt={`${projectName(p)} screenshot`} width="960" height="600" className="block aspect-[16/10] w-full object-cover object-top" draggable={false} fetchpriority={i === 0 ? 'high' : 'auto'} />
                <span className="mono absolute -bottom-6 right-0 text-dim tabular">z {s.z}</span>
              </div>
            </a>
          )
        })}
      </div>
      <style>{`@keyframes panel-in{from{opacity:0;transform:translateZ(-700px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

/* Phone strip: swipeable cards that snap. */
function Strip({ featured }) {
  return (
    <div className="-mx-5 mt-12 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ scrollSnapType: 'x mandatory', scrollPaddingInline: 20 }}>
      <ul className="flex w-max gap-4">
        {featured.map((p, i) => (
          <li key={p.code} className="w-[78vw] max-w-[340px]" style={{ scrollSnapAlign: 'start' }}>
            <a href="#work" className="block" style={{ animation: `strip-in .9s cubic-bezier(.16,1,.3,1) ${0.3 + i * 0.1}s both` }}>
              <span className="mono mb-2 block text-ink-2"><span className="text-cut">{p.destination}</span> / {LABEL[p.category]}</span>
              <img src={p.thumb} alt={`${projectName(p)} screenshot`} width="960" height="600" className="panel block aspect-[16/10] w-full object-cover object-top" loading={i > 1 ? 'lazy' : 'eager'} />
            </a>
          </li>
        ))}
      </ul>
      <style>{`@keyframes strip-in{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

export default function Hero() {
  const wide = useMedia('(min-width: 1024px)')
  const first = useDecode(ME.firstName, true, { duration: 900, delay: 150 })
  const last = useDecode(ME.lastName, true, { duration: 1000, delay: 350 })
  const featured = ['YA100', 'YA105', 'YA103', 'YA102'].map((c) => PROJECTS.find((p) => p.code === c))

  return (
    <section id="top" className="relative overflow-hidden pt-14">
      <Floor />
      {wide && <div id="hero-spot" aria-hidden="true" className="spot" />}

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-6 px-5 pb-14 pt-10 md:px-8 lg:min-h-[calc(100svh-56px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pb-20">
        <div className="relative z-10 min-w-0">
          <p className="mono mb-6 text-dim tabular">X 0.00 · Y 0.00 · Cairo 30.04°N 31.24°E</p>
          <h1 className="font-display text-[clamp(60px,8vw,128px)] font-extrabold leading-[0.86] tracking-[-0.03em]" aria-label={ME.name}>
            <span aria-hidden="true" className="block">{first}</span>
            <span aria-hidden="true" className="block text-cut">{last}</span>
          </h1>
          <RoleLine />
          <p className="mt-5 max-w-[30em] text-[17px] leading-relaxed text-ink-2">
            Full-stack developer in Cairo. I design the interface, build the frontend and backend, and ship it to the cloud.
          </p>
          <div className="dim-line mt-7 max-w-[30em] pt-2">
            <p className="mono leading-relaxed text-cut">React · Next.js · React Native · Node.js · Python · PHP</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <Magnetic><a href="#contact" className="btn btn-cut w-full">Hire me <FiArrowDownRight /></a></Magnetic>
            <Magnetic><a href={ME.cv} download className="btn btn-line w-full">Download CV <FiDownload /></a></Magnetic>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-dim">
            Clients: hire me on <a className="link-u text-ink-2" href={ME.upwork} target="_blank" rel="noopener noreferrer">Upwork</a> or{' '}
            <a className="link-u text-ink-2" href={ME.fiverr} target="_blank" rel="noopener noreferrer">Fiverr</a>. Recruiters: the CV is one tap away.
          </p>
          {!wide && <Strip featured={featured} />}
        </div>

        {wide && <Scene featured={featured} />}
      </div>
    </section>
  )
}
