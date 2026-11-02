import { SKILL_GROUPS } from '../data/skills.js'
import Decode from './Decode.jsx'
import useInView from '../hooks/useInView.js'

// Laid out as a bill of materials: each part lights up in sequence when the group enters.
function Group({ g, i }) {
  const [ref, inView] = useInView({ margin: '0px 0px -12% 0px' })
  return (
    <div ref={ref} className="group grid gap-4 border-b border-rule py-6 md:grid-cols-[minmax(0,3fr)_minmax(0,8fr)_4rem] md:items-baseline md:gap-8">
      <h3 className="flex items-baseline gap-3 font-display text-[22px] font-bold leading-tight">
        <span className="mono tabular text-dim">{String(i + 1).padStart(2, '0')}</span>
        <span className="transition-colors group-hover:text-cut">{g.group}</span>
      </h3>
      <ul className="flex flex-wrap gap-2">
        {g.skills.map((s, j) => (
          <li
            key={s}
            className={`border px-3 py-1.5 text-[14px] transition-[color,border-color,background-color,opacity,transform] duration-500 hover:border-cut hover:text-cut ${
              inView ? 'translate-y-0 border-rule text-ink opacity-100' : 'translate-y-2 border-transparent text-dim opacity-0'
            }`}
            style={{ transitionDelay: inView ? `${j * 45}ms` : '0ms' }}
          >
            {s}
          </li>
        ))}
      </ul>
      <span className="mono tabular hidden text-right text-cut md:block">×{String(g.skills.length).padStart(2, '0')}</span>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative border-t border-rule bg-ground-2">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Decode as="h2" text="Bill of materials" className="block font-display text-[clamp(44px,6vw,88px)] font-extrabold leading-[0.88] tracking-[-0.03em]" />
          <p className="mono text-dim">Grouped exactly as on my CV</p>
        </div>
        <div className="mt-14 border-t border-cut">
          {SKILL_GROUPS.map((g, i) => <Group key={g.group} g={g} i={i} />)}
        </div>
      </div>
    </section>
  )
}
