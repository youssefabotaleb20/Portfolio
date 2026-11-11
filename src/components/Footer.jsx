import { ME } from '../data/me.js'

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-night">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-[14px] text-dim md:px-10" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        <p>© {new Date().getFullYear()} {ME.name}. Designed and built by me with React, Tailwind and Framer Motion.</p>
        <a href="#top" className="link-u text-ink-2">Back to top</a>
      </div>
    </footer>
  )
}
