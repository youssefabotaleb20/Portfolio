import { ME } from '../data/me.js'
import Decode from './Decode.jsx'
import useInView from '../hooks/useInView.js'

const CALLOUTS = [
  { label: 'Cairo, Egypt', top: '12%' },
  { label: 'GUC · CSE', top: '36%' },
  { label: 'IBM Full Stack certified', top: '60%' },
  { label: 'Arabic · English', top: '84%' },
]

export default function About() {
  const [ref, inView] = useInView({ margin: '0px 0px -20% 0px' })

  return (
    <section id="about" className="relative overflow-hidden border-t border-rule bg-ground">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
        <div ref={ref} className="relative mx-auto w-full max-w-[340px] sm:ml-auto sm:mr-6 lg:mr-10">
          <div className="brackets relative">
            <span className="b tl" /><span className="b tr" /><span className="b bl" /><span className="b br" />
            <div className={`scan panel overflow-hidden ${inView ? 'is-in' : ''}`} style={{ '--scan-h': '453px' }}>
              <img
                src={ME.photo}
                alt={`Portrait of ${ME.name}`}
                loading="lazy"
                className="block aspect-[3/4] w-full object-cover object-top transition-[clip-path,transform,filter] duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)]"
                style={{
                  clipPath: inView ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                  transform: inView ? 'scale(1)' : 'scale(1.1)',
                  filter: inView ? 'grayscale(0)' : 'grayscale(1)',
                }}
              />
            </div>
          </div>
          {/* callouts draw in from the photo (tablet and up) */}
          {CALLOUTS.map((c, i) => (
            <div
              key={c.label}
              className="mono pointer-events-none absolute right-[92%] hidden flex-row-reverse items-center gap-2 text-right text-ink sm:flex"
              style={{ top: c.top }}
            >
              <span className={`h-1.5 w-1.5 flex-none rounded-full bg-cut transition-opacity duration-300 ${inView ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${500 + i * 120}ms` }} />
              <span className="h-px w-10 flex-none origin-right bg-cut transition-transform duration-500" style={{ transform: inView ? 'scaleX(1)' : 'scaleX(0)', transitionDelay: `${600 + i * 120}ms` }} />
              <span className={`whitespace-nowrap bg-ground px-1 transition-opacity duration-500 ${inView ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${800 + i * 120}ms` }}>{c.label}</span>
            </div>
          ))}
          {/* phones: the same facts as a list */}
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:hidden">
            {CALLOUTS.map((c) => (
              <li key={c.label} className="mono flex items-center gap-2 border border-rule px-3 py-2 text-ink-2">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-cut" />{c.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <Decode as="h2" text="About me" className="block font-display text-[clamp(44px,6vw,88px)] font-extrabold leading-[0.88] tracking-[-0.03em]" />
          <div className="mt-8 grid max-w-[36em] gap-5 text-[18px] leading-relaxed text-ink-2">
            {ME.bio.map((p) => <p key={p}>{p}</p>)}
          </div>

          <dl className="mt-12 grid gap-0 border-t border-cut">
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
              <li key={t} className="mono border border-rule px-3 py-2 text-ink-2 transition-colors hover:border-cut hover:text-cut">{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
