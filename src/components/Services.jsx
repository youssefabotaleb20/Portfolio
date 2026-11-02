import { SERVICES } from '../data/skills.js'
import { PROJECTS, projectName } from '../data/projects.js'
import Decode from './Decode.jsx'
import useInView from '../hooks/useInView.js'

const name = (code) => {
  const p = PROJECTS.find((x) => x.code === code)
  return p ? projectName(p) : code
}

function Row({ s, i }) {
  const [ref, inView] = useInView({ margin: '0px 0px -10% 0px' })
  return (
    <li
      ref={ref}
      className={`group relative isolate overflow-hidden border-b border-rule transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
        inView ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
      }`}
      style={{ transitionDelay: `${i * 70}ms` }}
    >
      {/* orange sweep on hover */}
      <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-cut transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
      <div className="grid gap-3 px-1 py-7 md:grid-cols-[3rem_minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)] md:items-baseline md:gap-8 md:px-4">
        <span className="mono tabular text-cut transition-colors group-hover:text-ground">{String(i + 1).padStart(2, '0')}</span>
        <h3 className="font-display text-[clamp(28px,3vw,44px)] font-bold leading-none tracking-[-0.02em] transition-colors group-hover:text-ground">
          {s.name}
        </h3>
        <p className="text-[16px] leading-relaxed text-ink-2 transition-colors group-hover:text-ground">{s.line}</p>
        <p className="mono leading-relaxed transition-colors group-hover:text-ground md:text-right">
          {s.projects.length ? (
            <a href="#work" className="text-ink group-hover:text-ground">
              <span className="text-dim group-hover:text-ground/70">Seen in </span>
              {s.projects.map(name).join(', ')}
            </a>
          ) : (
            <span className="text-dim group-hover:text-ground/70">Case study in progress</span>
          )}
        </p>
      </div>
    </li>
  )
}

export default function Services() {
  return (
    <section id="services" className="border-t border-rule bg-ground">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end">
          <Decode as="h2" text="What I build" className="block font-display text-[clamp(44px,6vw,88px)] font-extrabold leading-[0.88] tracking-[-0.03em]" />
          <p className="max-w-[34em] text-[17px] leading-relaxed text-ink-2 md:justify-self-end">
            One developer from the interface to the server. Each service lists the projects that show it, so you can open
            the proof before you get in touch.
          </p>
        </div>

        <ul className="mt-16 border-t border-cut">
          {SERVICES.map((s, i) => <Row key={s.name} s={s} i={i} />)}
        </ul>
      </div>
    </section>
  )
}
