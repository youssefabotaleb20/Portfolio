import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SKILL_GROUPS } from '../data/skills.js'
import { layerColor } from '../data/layers.js'
import { Words, Rise, EASE } from './Reveal.jsx'

const slug = (g) => `skills-${g.toLowerCase().replace(/[^a-z]+/g, '-')}`

function Group({ g, onActive }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onActive(g.group), { rootMargin: '-40% 0px -50% 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [g.group, onActive])

  return (
    <motion.div
      ref={ref}
      id={slug(g.group)}
      className="relative scroll-mt-28 border-b border-rule py-9 md:py-12"
      style={{ '--c': layerColor(g.layer) }}
      initial={reduce ? 'in' : 'out'}
      whileInView="in"
      viewport={{ once: true, margin: '0px 0px -14% 0px' }}
      transition={{ staggerChildren: 0.03, delayChildren: 0.15 }}
    >
      {/* the group's line of light draws across as it enters */}
      <motion.span aria-hidden="true" className="absolute left-0 top-[-1px] h-px w-full origin-left" style={{ background: 'linear-gradient(90deg, var(--c), transparent 70%)' }}
        variants={{ out: { scaleX: 0 }, in: { scaleX: 1 } }} transition={{ duration: 1.2, ease: EASE }} />
      <h3 className="display flex items-center gap-4 text-[clamp(30px,3.400vw,48px)]">
        <span className="dot" />{g.group}
      </h3>
      <ul className="mt-6 flex flex-wrap gap-2">
        {g.skills.map((s) => (
          <motion.li key={s} className="chip" variants={{ out: { opacity: 0, y: 14, scale: 0.94 }, in: { opacity: 1, y: 0, scale: 1 } }} transition={{ duration: 0.6, ease: EASE }}>
            {s}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Skills() {
  const [active, setActive] = useState(SKILL_GROUPS[0].group)
  return (
    <section id="skills" className="relative border-t border-rule">
      <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-40">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Words as="h2" text="The full stack" className="display h-section block lg:text-[clamp(56px,6.400vw,108px)]" wordClass={(w, i) => (i === 1 ? 'display-i text-glow' : '')} />
            <Rise as="p" className="lede mt-6 max-w-[26em]">Every skill on my CV, grouped the same way it is there.</Rise>

            {/* live index: the group on screen lights up (desktop) */}
            <ol className="mt-10 hidden gap-1 lg:grid">
              {SKILL_GROUPS.map((g) => {
                const on = active === g.group
                return (
                  <li key={g.group} style={{ '--c': layerColor(g.layer) }}>
                    <a href={`#${slug(g.group)}`} className={`flex items-center gap-4 py-1.5 text-[17px] transition-all duration-500 ${on ? 'translate-x-3 text-ink' : 'text-dim hover:text-ink-2'}`}>
                      <span className="h-px transition-all duration-500" style={{ width: on ? 44 : 18, background: on ? 'var(--c)' : 'rgb(243 238 230 / 0.25)' }} />
                      {g.group}
                      <span className="text-[13px] tabular-nums text-dim">{g.skills.length}</span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="min-w-0">
            {SKILL_GROUPS.map((g) => <Group key={g.group} g={g} onActive={setActive} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
