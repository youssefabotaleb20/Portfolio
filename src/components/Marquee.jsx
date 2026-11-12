import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

const A = ['React', 'Next.js', 'React Native', 'TypeScript', 'Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'PHP']
const B = ['MongoDB', 'MySQL', 'Docker', 'Kubernetes', 'GitHub Actions', 'Vercel', 'Claude API', 'OpenAI API', 'Stripe', 'Playwright']
const COLORS = ['#f6c58f', '#f39c8c', '#e283b4', '#a98bf0', '#6fa3f7', '#6fd6cf']

function Row({ items, rev, offset }) {
  const row = items.map((t, i) => (
    <li key={i} className="flex items-center gap-7 pr-7 md:gap-10 md:pr-10">
      <span className={`display text-[clamp(34px,5vw,72px)] ${i % 2 ? 'display-i text-ink' : 'text-ink'}`}>{t}</span>
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[(i + offset) % COLORS.length] }} />
    </li>
  ))
  return <ul className={`marquee ${rev ? 'rev' : ''}`} aria-hidden="true">{row}{row}</ul>
}

// Two bands of the tech stack that also slide against each other with scroll.
export default function Marquee() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['-12%', '0%'])
  return (
    <div ref={ref} className="relative overflow-hidden border-y border-rule bg-night-2 py-7 md:py-10">
      <p className="sr-only">Tech stack: {[...A, ...B].join(', ')}</p>
      <motion.div style={{ x: reduce ? 0 : x1 }}><Row items={A} offset={0} /></motion.div>
      <motion.div style={{ x: reduce ? 0 : x2 }} className="mt-3 opacity-45 md:mt-5"><Row items={B} rev offset={3} /></motion.div>
    </div>
  )
}
