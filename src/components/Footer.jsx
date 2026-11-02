import { FiArrowUp } from 'react-icons/fi'
import { ME } from '../data/me.js'

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-ground-2">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-8 md:px-8">
        <span className="font-display text-[17px] font-extrabold">Y<span className="text-cut">.</span>Abotaleb</span>
        <span className="mono text-dim">© {new Date().getFullYear()} {ME.name}</span>
        <span className="mono text-dim">Cairo 30.04°N 31.24°E</span>
        <a href="#top" className="mono ml-auto flex items-center gap-2 text-ink hover:text-cut">
          Back to top <FiArrowUp />
        </a>
      </div>
    </footer>
  )
}
