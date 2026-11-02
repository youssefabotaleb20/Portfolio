const ITEMS = ['React', 'Next.js', 'React Native', 'Node.js', 'Express', 'Python', 'Django', 'PHP', 'MongoDB', 'MySQL', 'Docker', 'Kubernetes', 'GitHub Actions', 'Claude API']

export default function Marquee() {
  const row = ITEMS.map((t, i) => (
    <li key={i} className="flex items-center gap-8 pr-8">
      <span className={`font-display text-[clamp(28px,4vw,52px)] font-bold leading-none ${i % 2 ? 'text-transparent [-webkit-text-stroke:1px_rgb(238_242_246/0.55)]' : 'text-ink'}`}>{t}</span>
      <span className="font-display text-[clamp(28px,4vw,52px)] font-bold leading-none text-cut">/</span>
    </li>
  ))
  return (
    <div className="overflow-hidden border-y border-rule bg-ground-2 py-6">
      <p className="sr-only">Tech stack: {ITEMS.join(', ')}</p>
      <ul className="marquee" aria-hidden="true">{row}{row}</ul>
    </div>
  )
}
