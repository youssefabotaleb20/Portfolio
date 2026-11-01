import { motion } from 'framer-motion'
import { SERVICES } from '../data/skills.js'
import { PROJECTS, projectName } from '../data/projects.js'

const name = (code) => {
  const p = PROJECTS.find((x) => x.code === code)
  return p ? projectName(p) : code
}

export default function Services() {
  return (
    <section id="services" className="border-t border-rule">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end">
          <h2 className="font-display text-[clamp(40px,6vw,88px)] font-extrabold leading-[0.88] tracking-[-0.03em]">
            What I build
          </h2>
          <p className="max-w-[34em] text-[17px] leading-relaxed text-ink-2 md:justify-self-end">
            One developer from the interface to the server. Each service lists the projects that show it, so you can open
            the proof before you get in touch.
          </p>
        </div>

        <ul className="mt-16 border-t border-ink">
          {SERVICES.map((s, i) => (
            <motion.li
              key={s.name}
              initial={{ opacity: 0.25, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group grid gap-3 border-b border-rule py-7 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)] md:items-baseline md:gap-8"
            >
              <h3 className="font-display text-[clamp(28px,3vw,44px)] font-bold leading-none tracking-[-0.02em] transition-colors group-hover:text-cut">
                {s.name}
              </h3>
              <p className="text-[16px] leading-relaxed text-ink-2">{s.line}</p>
              <p className="mono leading-relaxed md:text-right">
                {s.projects.length ? (
                  <a href="#work" className="text-ink hover:text-cut">
                    <span className="text-dim">Seen in </span>
                    {s.projects.map(name).join(', ')}
                  </a>
                ) : (
                  <span className="text-dim">Case study in progress</span>
                )}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
