import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { ME } from '../data/me.js'

const CALLOUTS = [
  { label: 'Cairo, Egypt', top: '12%' },
  { label: 'GUC · CSE', top: '36%' },
  { label: 'IBM Full Stack certified', top: '60%' },
  { label: 'Arabic · English', top: '84%' },
]

export default function About() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60])
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-8, 8])

  return (
    <section id="about" ref={ref} className="relative overflow-hidden border-t border-rule">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
        <div className="relative mx-auto w-full max-w-[340px] sm:ml-auto sm:mr-6 lg:mr-10" style={{ perspective: 1000 }}>
          <motion.div style={{ y: photoY, rotateY: rotate }} className="brackets relative">
            <span className="b tl" /><span className="b tr" /><span className="b bl" /><span className="b br" />
            <img src={ME.photo} alt={`Portrait of ${ME.name}`} loading="lazy" className="panel block aspect-[3/4] w-full object-cover object-top" />
          </motion.div>
          {CALLOUTS.map((c) => (
            <div
              key={c.label}
              className="mono pointer-events-none absolute right-[92%] hidden flex-row-reverse items-center gap-2 text-right text-ink sm:flex"
              style={{ top: c.top }}
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-cut" />
              <span className="h-px w-10 flex-none bg-cut" />
              <span className="whitespace-nowrap bg-ground px-1">{c.label}</span>
            </div>
          ))}
        </div>

        <div className="min-w-0">
          <h2 className="font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-[-0.03em]">
            About me
          </h2>
          <div className="mt-8 grid max-w-[36em] gap-5 text-[18px] leading-relaxed text-ink-2">
            {ME.bio.map((p) => <p key={p}>{p}</p>)}
          </div>

          <dl className="mt-12 grid gap-0 border-t border-ink">
            {ME.education.map((e) => (
              <div key={e.title} className="grid gap-1 border-b border-rule py-5 sm:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] sm:gap-6">
                <dt className="font-display text-[20px] font-bold leading-snug">{e.title}</dt>
                <dd className="mono leading-relaxed text-dim sm:text-right">{e.org}</dd>
                {e.note && <dd className="text-[15px] leading-relaxed text-ink-2 sm:col-span-2">{e.note}</dd>}
              </div>
            ))}
          </dl>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="How I work">
            {ME.traits.map((t) => (
              <li key={t} className="mono border border-rule px-3 py-2 text-ink-2">{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
