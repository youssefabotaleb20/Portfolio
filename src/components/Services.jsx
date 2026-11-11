import { SERVICES } from '../data/skills.js'
import { byId } from '../data/projects.js'
import { layerColor } from '../data/layers.js'
import { Words, Rise } from './Reveal.jsx'

function Row({ s, i }) {
  return (
    <Rise as="li" delay={i * 0.06} className="sweep border-b border-rule" style={{ '--c': layerColor(s.layer) }}>
      <div className="grid gap-3 px-1 py-7 md:grid-cols-[minmax(0,5fr)_minmax(0,5fr)_minmax(0,4fr)] md:items-baseline md:gap-10 md:px-5 md:py-9">
        <h3 className="display flex items-center gap-4 text-[clamp(32px,4vw,60px)]">
          <span className="dot" />{s.name}
        </h3>
        <p className="text-[17px] leading-relaxed text-ink-2">{s.line}</p>
        <p className="text-[15px] leading-relaxed text-dim md:text-right">
          {s.projects.length ? (
            <>
              Seen in{' '}
              {s.projects.map((id, j) => (
                <span key={id}>
                  <a href={`#p-${id}`} className="link-u text-ink">{byId(id).name}</a>
                  {j < s.projects.length - 1 ? ', ' : ''}
                </span>
              ))}
            </>
          ) : s.pending}
        </p>
      </div>
    </Rise>
  )
}

export default function Services() {
  return (
    <section id="services" className="relative border-t border-rule bg-night-2">
      <div className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-40">
        <div className="grid gap-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-end">
          <Words as="h2" text="What I build" className="display h-section block" wordClass={(w, i) => (i === 2 ? 'display-i text-glow' : '')} />
          <Rise as="p" className="lede max-w-[30em] md:justify-self-end">
            One developer from the interface to the server. Each service links to the projects that prove it.
          </Rise>
        </div>
        <ul className="mt-14 border-t border-rule md:mt-20">
          {SERVICES.map((s, i) => <Row key={s.name} s={s} i={i} />)}
        </ul>
      </div>
    </section>
  )
}
