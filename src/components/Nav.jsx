import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { ME } from '../data/me.js'

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#skills', label: 'Skills' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]
const COLORS = ['#6ee7b7', '#7aa2ff', '#e9d16f', '#f4a261', '#c8d1cc']

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [solid, setSolid] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    LINKS.forEach((l) => { const el = document.querySelector(l.href); if (el) io.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect() }
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
      <div className={`relative z-10 transition-colors duration-500 ${solid && !open ? 'bg-night/95' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-8 px-5 md:px-10">
          <a href="#top" onClick={() => setOpen(false)} className="display text-[24px] text-ink" aria-label={`${ME.name}, back to top`}>
            Youssef <span className="display-i text-glow">A.</span>
          </a>

          <nav aria-label="Main" className="ml-auto hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} aria-current={active === l.href ? 'true' : undefined}
                className={`relative rounded-full px-4 py-2 text-[15px] transition-colors ${active === l.href ? 'text-night' : 'text-ink-2 hover:text-ink'}`}>
                {active === l.href && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative">{l.label}</span>
              </a>
            ))}
          </nav>

          <button type="button" className="relative ml-auto flex h-11 w-11 items-center justify-center md:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            <span className={`absolute h-[2px] w-6 rounded bg-ink transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-[5px]'}`} />
            <span className={`absolute h-[2px] w-6 rounded bg-ink transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-[5px]'}`} />
          </button>
        </div>
        <motion.div style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg,#6ee7b7,#4fd1e8,#7aa2ff,#e9d16f,#f4a261,#c8d1cc)' }} className="h-[2px] origin-left" aria-hidden="true" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ clipPath: 'circle(0% at calc(100% - 42px) 32px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 42px) 32px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 42px) 32px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 flex flex-col justify-center bg-night-2 px-6 pb-10 pt-24 md:hidden"
          >
            <ul className="grid gap-1">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.12 + i * 0.06 }}
                    className="display flex items-center gap-4 py-2 text-[15vw] leading-none"
                  >
                    <span className="h-3 w-3 rounded-full" style={{ background: COLORS[i] }} />
                    <span className={i % 2 ? 'display-i' : ''}>{l.label}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 grid grid-cols-2 gap-3">
              <a href={`mailto:${ME.email}`} onClick={() => setOpen(false)} className="btn btn-solid">Email me</a>
              <a href={ME.cv} download className="btn btn-ghost">Download CV</a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
