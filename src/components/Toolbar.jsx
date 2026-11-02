import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi'
import { ME } from '../data/me.js'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#skills', label: 'Skills' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Toolbar() {
  const zRef = useRef(null)
  const barRef = useRef(null)
  const [open, setOpen] = useState(false)

  // Scroll readout and progress bar without re-rendering React on every frame.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (zRef.current) zRef.current.textContent = String(Math.round(y)).padStart(5, '0')
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="border-b border-rule bg-ground/95">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-8 px-5 md:px-8">
          <a href="#top" className="font-display text-[17px] font-extrabold tracking-tight text-ink">
            Y<span className="text-cut">.</span>Abotaleb
          </a>

          <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="mono group relative text-ink-2 transition-colors hover:text-ink">
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-cut transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-6">
            <span className="mono tabular hidden text-dim lg:inline" aria-hidden="true">
              Z <span ref={zRef}>00000</span>
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
              className="-mr-2 p-2 text-ink md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        <div ref={barRef} className="h-px origin-left bg-cut" style={{ transform: 'scaleX(0)' }} aria-hidden="true" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[calc(57px+env(safe-area-inset-top,0px))] flex flex-col bg-ground px-5 pb-[max(24px,env(safe-area-inset-bottom))] md:hidden"
          >
            <div className="flex-1 pt-6">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between border-b border-rule py-5 font-display text-[34px] font-bold leading-none text-ink active:text-cut"
                >
                  {l.label}
                  <FiArrowUpRight className="text-cut" size={22} />
                </motion.a>
              ))}
            </div>
            <a href={ME.cv} download className="btn btn-cut w-full">Download CV</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
