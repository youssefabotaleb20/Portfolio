import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ME } from '../data/me.js'
import { Words, Rise, EASE } from './Reveal.jsx'

export default function About() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-9%', '9%'])
  const plateA = useTransform(scrollYProgress, [0, 1], [70, -70])
  const plateB = useTransform(scrollYProgress, [0, 1], [-50, 50])

  return (
    <section id="about" className="relative overflow-hidden border-t border-rule bg-night-2">
      <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-40">
        <Words as="h2" text="About me" className="display h-section block" wordClass={(w, i) => (i === 1 ? 'display-i text-glow' : '')} />

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          {/* portrait between two drifting plates of light */}
          <div ref={ref} className="relative mx-auto w-full max-w-[400px] px-6 lg:mx-0 lg:px-8">
            <motion.span aria-hidden="true" style={{ y: reduce ? 0 : plateA, '--c': '#a98bf0' }} className="absolute -right-0 top-10 h-[72%] w-[62%] rounded-[28px] border border-[color-mix(in_oklab,var(--c)_60%,transparent)] bg-[color-mix(in_oklab,var(--c)_10%,transparent)]" />
            <motion.span aria-hidden="true" style={{ y: reduce ? 0 : plateB, '--c': '#f6c58f' }} className="absolute bottom-6 left-0 h-[60%] w-[58%] rounded-[28px] border border-[color-mix(in_oklab,var(--c)_60%,transparent)] bg-[color-mix(in_oklab,var(--c)_8%,transparent)]" />
            <motion.div
              className="relative overflow-hidden rounded-[28px] border border-rule"
              initial={reduce ? false : { clipPath: 'inset(100% 0 0 0 round 28px)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0 round 28px)' }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ duration: 1.4, ease: EASE }}
            >
              <motion.img src={ME.photo} alt={`Portrait of ${ME.name}`} width="640" height="854" loading="lazy" style={{ y: reduce ? 0 : imgY, scale: 1.2 }} className="block aspect-[3/4] w-full object-cover object-top" />
            </motion.div>
          </div>

          <div className="min-w-0">
            <div className="grid max-w-[38em] gap-5">
              {ME.summary.map((p, i) => <Rise key={i} as="p" delay={i * 0.08} className={i === 0 ? 'text-[clamp(20px,1.900vw,27px)] leading-snug text-ink' : 'lede'}>{p}</Rise>)}
            </div>

            <Rise className="mt-14">
              <h3 className="text-[15px] font-medium text-glow">Experience</h3>
              {ME.experience.map((e) => (
                <div key={e.title} className="mt-4 border-t border-rule pt-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="display text-[clamp(26px,2.600vw,38px)]">{e.title}</p>
                    <p className="text-[15px] text-ink-2">{e.when}</p>
                  </div>
                  <p className="mt-2 text-[15px] text-dim">{e.scope}. {e.org}</p>
                  <ul className="mt-5 grid max-w-[40em] gap-3">
                    {e.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[16.500px] leading-relaxed text-ink-2"><span className="dot mt-[0.55em]" />{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Rise>

            <Rise className="mt-14">
              <h3 className="text-[15px] font-medium text-glow">Education and certifications</h3>
              <dl className="mt-4 border-t border-rule">
                {ME.education.map((e) => (
                  <div key={e.title} className="grid gap-1 border-b border-rule py-6 sm:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] sm:gap-6">
                    <dt className="display text-[clamp(22px,2.100vw,30px)] leading-tight">{e.title}</dt>
                    <dd className="text-[15px] text-ink-2 sm:text-right">{e.org}</dd>
                    {e.note && <dd className="max-w-[40em] text-[15px] leading-relaxed text-dim sm:col-span-2">{e.note}</dd>}
                  </div>
                ))}
              </dl>
            </Rise>

            <Rise className="mt-10 flex flex-wrap gap-x-12 gap-y-5">
              {ME.languages.map((l) => (
                <p key={l.name}>
                  <span className="display block text-[30px]">{l.name}</span>
                  <span className="text-[15px] text-dim">{l.level}</span>
                </p>
              ))}
              <p>
                <span className="display block text-[30px]">Cairo</span>
                <span className="text-[15px] text-dim">Egypt, working with clients worldwide</span>
              </p>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  )
}
