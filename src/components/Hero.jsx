import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion'
import { FiArrowDownRight, FiDownload } from 'react-icons/fi'
import { ME } from '../data/me.js'
import { PROJECTS } from '../data/projects.js'
import useMedia from '../hooks/useMedia.js'

// Panels placed in scene space (px). z is depth; the hero rotates the whole scene.
const LAYOUT = [
  { x: 40, y: 70, z: 60, w: 560 },
  { x: 470, y: -20, z: -180, w: 300 },
  { x: 500, y: 300, z: -60, w: 300 },
  { x: -40, y: 410, z: -260, w: 270 },
]

const KIND_LABEL = { client: 'Client · Live', web: 'Web', fullstack: 'Full-stack' }

function Panel({ project, slot, i, scrollY, reduce }) {
  // deeper panels drift less: parallax by depth
  const depth = 1 - (slot.z + 300) / 700
  const y = useTransform(scrollY, [0, 900], [0, -140 - depth * 220])
  return (
    <motion.a
      href="#work"
      className="panel group absolute block"
      style={{
        left: slot.x,
        top: slot.y,
        width: slot.w,
        y,
        z: slot.z,
        transformStyle: 'preserve-3d',
      }}
      initial={reduce ? false : { z: slot.z - 700, opacity: 0 }}
      animate={{ z: slot.z, opacity: 1 }}
      transition={{ duration: 1.6, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="mono absolute -top-6 left-0 whitespace-nowrap text-ink">
        <span className="text-cut">{project.destination}</span> / {KIND_LABEL[project.category]}
      </span>
      <img
        src={project.images[0]}
        alt={`${project.destination} screenshot`}
        className="block aspect-[16/10] w-full object-cover object-top"
        draggable={false}
        fetchpriority={i === 0 ? 'high' : 'auto'}
      />
      <span className="mono absolute -bottom-6 right-0 text-dim tabular">z {slot.z}</span>
    </motion.a>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  const wide = useMedia('(min-width: 1024px)')
  const { scrollY } = useScroll()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const rotY = useTransform(sx, (v) => -24 + v * 10)
  const rotX = useTransform(sy, (v) => 6 - v * 6)
  const floorY = useTransform(scrollY, [0, 900], [0, 120])

  useEffect(() => {
    if (reduce || !wide) return
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5)
      my.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, wide, mx, my])

  const featured = ['YA100', 'YA105', 'YA103', 'YA102'].map((c) => PROJECTS.find((p) => p.code === c))

  return (
    <section id="top" className="relative overflow-hidden pt-14">
      {/* perspective floor */}
      <motion.div
        aria-hidden="true"
        className="grid-floor pointer-events-none absolute -inset-x-[30%] bottom-[-60%] h-[95%]"
        style={{ y: floorY, transform: 'perspective(700px) rotateX(62deg)', transformOrigin: 'center top' }}
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-56px)] max-w-[1600px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pb-24">
        <div className="relative z-10 min-w-0">
          <p className="mono mb-6 text-dim tabular">X 0.00 · Y 0.00 · Cairo 30.04°N 31.24°E</p>
          <h1 className="font-display text-[clamp(56px,9vw,128px)] font-extrabold leading-[0.86] tracking-[-0.03em]">
            {ME.firstName}
            <br />
            <span className="text-cut">{ME.lastName}</span>
          </h1>
          <p className="mt-8 max-w-[30em] text-[18px] leading-relaxed text-ink-2">
            Full-stack developer for web, mobile and cloud apps. I design the interface, build the frontend and backend,
            and ship it.
          </p>
          <div className="dim-line mt-8 max-w-[30em] pt-2">
            <p className="mono text-cut">React · Next.js · React Native · Node.js · Python · PHP</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn btn-cut">
              Hire me <FiArrowDownRight />
            </a>
            <a href={ME.cv} download className="btn btn-line">
              Download CV <FiDownload />
            </a>
          </div>
          <p className="mt-5 text-sm text-dim">
            Clients: hire me on <a className="link-u" href={ME.upwork} target="_blank" rel="noopener noreferrer">Upwork</a> or{' '}
            <a className="link-u" href={ME.fiverr} target="_blank" rel="noopener noreferrer">Fiverr</a>. Recruiters: the CV is one click.
          </p>
        </div>

        {/* 3D scene */}
        <div className="relative h-[330px] sm:h-[420px] lg:mt-10 lg:h-[600px]" style={{ perspective: 1400 }} aria-label="Selected projects">
          <motion.div
            className="absolute left-0 top-0 h-[640px] w-[860px] origin-top-left scale-[0.42] sm:scale-[0.55] md:scale-[0.7] lg:scale-[0.78] xl:scale-[0.86]"
            style={{ rotateY: rotY, rotateX: rotX, transformStyle: 'preserve-3d' }}
          >
            {featured.map((p, i) => (
              <Panel key={p.code} project={p} slot={LAYOUT[i]} i={i} scrollY={scrollY} reduce={reduce} />
            ))}
          </motion.div>
          <span className="cross right-2 top-2 hidden lg:block" aria-hidden="true" />
        </div>
      </div>

      <div className="mono relative mx-auto flex max-w-[1600px] items-center justify-between px-5 pb-6 text-dim md:px-8">
        <span>Scroll to fly through the work</span>
        <span className="hidden sm:inline">{PROJECTS.length} projects in scene</span>
      </div>
    </section>
  )
}
