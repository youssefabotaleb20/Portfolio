import { useEffect, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#skills', label: 'Skills' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Toolbar() {
  const { scrollY } = useScroll()
  const [z, setZ] = useState(0)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setZ(Math.round(v)))

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-ground"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-8 px-5 md:px-8">
        <a href="#top" className="font-display text-[17px] font-extrabold tracking-tight text-ink">
          Y.Abotaleb
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="mono text-ink-2 transition-colors hover:text-cut">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-6">
          <span className="mono tabular hidden text-dim lg:inline" aria-hidden="true">
            Z {String(z).padStart(5, '0')}
          </span>
          <span className="mono hidden items-center gap-2 text-cut sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cut opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cut" />
            </span>
            Available for work
          </span>
          <button
            type="button"
            className="p-2 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-rule bg-ground px-5 pb-6 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-rule py-4 font-display text-2xl font-bold text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
