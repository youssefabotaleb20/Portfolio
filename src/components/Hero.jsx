import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { FiArrowDownRight, FiDownload } from 'react-icons/fi'
import { ME } from '../data/me.js'
import { LAYERS } from '../data/layers.js'
import Stack from './Stack.jsx'
import LayerTrack from './LayerTrack.jsx'
import Magnetic from './Magnetic.jsx'
import useMedia from '../hooks/useMedia.js'
import { EASE } from './Reveal.jsx'

function Letters({ text, delay, className = '' }) {
  const reduce = useReducedMotion()
  return (
    <span className={`block whitespace-nowrap ${className}`} aria-hidden="true">
      {[...text].map((ch, i) => (
        <span key={i} className="rv">
          <motion.span
            initial={reduce ? false : { y: '115%', rotate: 8 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: delay + i * 0.045 }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* Phones and tablets: one screen with the six layers as a horizontal track
   that slides along on its own, the name, one line on what I do, and both buttons
   above the fold. Nothing fades out while you are still reading it. */
function MobileHero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])

  const fade = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  })

  return (
    <section id="top" ref={ref} className="relative overflow-hidden">
      <motion.div className="stars" style={{ y: reduce ? 0 : starsY }} />
      <div className="aura right-[-40%] top-[-12%] h-[110vw] w-[110vw]" style={{ '--c': '#a98bf0', opacity: 0.45 }} />
      <div className="aura bottom-[-25%] left-[-45%] h-[110vw] w-[110vw]" style={{ '--c': '#f6c58f', opacity: 0.28 }} />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[720px] flex-col px-5 pb-8 pt-[84px]">
        <motion.p {...fade(0.1)} className="flex w-fit items-center gap-2.5 rounded-full border border-rule bg-night/60 px-3.5 py-1.5 text-[13.5px] text-ink-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glow opacity-60 motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-glow" />
          </span>
          Available for work · {ME.city}
        </motion.p>

        {/* the six layers as a horizontal track; swipe or tap to move along */}
        <motion.div {...fade(0.2)} className="relative -mx-5 mt-5 flex-none overflow-hidden min-[400px]:my-auto min-[400px]:pt-4" aria-live="polite">
          <LayerTrack active={active} setActive={setActive} />
        </motion.div>

        <h1 className="display mt-6 text-[clamp(54px,15.500vw,92px)]" aria-label={ME.name}>
          <Letters text={ME.firstName} delay={0.35} />
          <Letters text={ME.lastName} delay={0.55} className="display-i text-glow" />
        </h1>

        <motion.p {...fade(1)} className="mt-4 text-[17px] leading-relaxed text-ink-2">
          {ME.role}. I build web, mobile and cloud apps, from the first screen to the last deploy.
        </motion.p>

        <motion.div {...fade(1.15)} className="mt-6 grid grid-cols-2 gap-3">
          <a href="#contact" className="btn btn-solid w-full">Hire me <FiArrowDownRight /></a>
          <a href={ME.cv} download className="btn btn-ghost w-full">CV <FiDownload /></a>
        </motion.div>
        <motion.p {...fade(1.3)} className="small mt-4">
          Also on <a className="link-u text-ink-2" href={ME.upwork} target="_blank" rel="noopener noreferrer">Upwork</a> and{' '}
          <a className="link-u text-ink-2" href={ME.fiverr} target="_blank" rel="noopener noreferrer">Fiverr</a>.
        </motion.p>
      </div>
    </section>
  )
}

export default function Hero() {
  const wide = useMedia('(min-width: 1024px)')
  return wide ? <DesktopHero /> : <MobileHero />
}

function DesktopHero() {
  const ref = useRef(null)
  const wide = true
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Depth: far things move least. Stars < glow < stack < text.
  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const auraY = useTransform(scrollYProgress, [0, 1], ['0%', '32%'])
  const stackY = useTransform(scrollYProgress, [0, 1], [0, wide ? 150 : 70])
  const stackScale = useTransform(scrollYProgress, [0, 1], [1, wide ? 1.12 : 1.06])
  const textY = useTransform(scrollYProgress, [0, 1], [0, wide ? -140 : -50])
  const textO = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const fade = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: EASE, delay },
  })

  return (
    <section id="top" ref={ref} className="relative overflow-hidden">
      <motion.div className="stars" style={{ y: reduce ? 0 : starsY }} />
      <motion.div style={{ y: reduce ? 0 : auraY }} className="pointer-events-none absolute inset-0">
        <div className="aura right-[-18%] top-[-10%] h-[90vmax] w-[90vmax] lg:right-[-8%]" style={{ '--c': '#a98bf0', opacity: 0.5 }} />
        <div className="aura bottom-[-30%] left-[-30%] h-[80vmax] w-[80vmax]" style={{ '--c': '#f6c58f', opacity: 0.32 }} />
      </motion.div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1500px] items-center gap-2 px-5 pb-16 pt-16 md:px-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-6 lg:pb-20 lg:pt-28">
        {/* stack first on phones so the page opens on the signature */}
        <motion.div style={{ y: reduce ? 0 : stackY, scale: reduce ? 1 : stackScale }} className="relative order-first lg:order-last">
          <div className="flex h-[36svh] min-h-[290px] items-center justify-center lg:h-[78vh]">
            <Stack progress={scrollYProgress} size={wide ? 360 : 196} gap={wide ? 52 : 36} spread={wide ? 120 : 60} />
          </div>
        </motion.div>

        <motion.div style={{ y: reduce ? 0 : textY, opacity: reduce ? 1 : textO }} className="relative z-10 min-w-0">
          <motion.p {...fade(0.2)} className="flex items-center gap-3 text-[15px] font-medium text-ink-2 md:text-[17px]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glow opacity-60 motion-reduce:hidden" />
              <span className="dot relative" />
            </span>
            {ME.role}, {ME.city}
          </motion.p>

          <h1 className="display mt-5 text-[clamp(58px,17.500vw,84px)] sm:text-[clamp(84px,13vw,120px)] lg:text-[clamp(96px,9.400vw,176px)]" aria-label={ME.name}>
            <Letters text={ME.firstName} delay={0.35} />
            <Letters text={ME.lastName} delay={0.6} className="display-i text-glow lg:pl-[0.5em]" />
          </h1>

          <motion.p {...fade(1.15)} className="lede mt-7 max-w-[31em]">{ME.intro}</motion.p>

          <motion.ul {...fade(1.3)} className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Layers I work in">
            {LAYERS.map((l) => (
              <li key={l.id} className="flex items-center gap-2 text-[14px] text-ink-2" style={{ '--c': l.color }}>
                <span className="dot" />{l.name}
              </li>
            ))}
          </motion.ul>

          <motion.div {...fade(1.45)} className="mt-9 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <Magnetic className="w-full sm:w-auto"><a href="#contact" className="btn btn-solid w-full">Hire me <FiArrowDownRight /></a></Magnetic>
            <Magnetic className="w-full sm:w-auto"><a href={ME.cv} download className="btn btn-ghost w-full">Download CV <FiDownload /></a></Magnetic>
          </motion.div>
          <motion.p {...fade(1.6)} className="small mt-5 max-w-[34em]">
            Clients: hire me on <a className="link-u text-ink-2" href={ME.upwork} target="_blank" rel="noopener noreferrer">Upwork</a> or{' '}
            <a className="link-u text-ink-2" href={ME.fiverr} target="_blank" rel="noopener noreferrer">Fiverr</a>. Recruiters: the CV is one tap away.
          </motion.p>
        </motion.div>
      </div>

      <motion.a
        href="#work"
        {...fade(2)}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[13px] text-dim lg:flex"
      >
        Scroll to pull the stack apart
        <span className="relative block h-9 w-px overflow-hidden bg-rule">
          <motion.span className="absolute inset-x-0 top-0 h-3 bg-glow" animate={reduce ? {} : { y: [-12, 36] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
        </span>
      </motion.a>
    </section>
  )
}
