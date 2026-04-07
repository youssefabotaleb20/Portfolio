import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
]

export default function Navbar({ scrollContainer }) {
  const [progress, setProgress] = useState(0)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const el = scrollContainer?.current
    if (!el) return
    const onScroll = () => setProgress(Math.min(1, el.scrollTop / 80))
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [scrollContainer])

  const navStyle = {
    background:      `rgba(5, 5, 16, ${0.85 * progress})`,
    backdropFilter:  `blur(${20 * progress}px)`,
    WebkitBackdropFilter: `blur(${20 * progress}px)`,
    borderBottom:    `1px solid rgba(255, 255, 255, ${0.06 * progress})`,
  }

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setOpen(false)
    const target = document.querySelector(href)
    if (target && scrollContainer?.current) {
      scrollContainer.current.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
    }
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={navStyle}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="text-xl font-bold gradient-text-blue select-none"
        >
          YA
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, '#contact')}
          className="hidden md:inline-flex btn-gradient text-white text-sm font-semibold px-5 py-2 rounded-full cursor-pointer"
        >
          Hire Me
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-white mb-1.5 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-5 h-0.5 bg-white mb-1.5 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden navbar-scrolled border-t border-white/5"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-base font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="btn-gradient inline-block text-white text-sm font-semibold px-5 py-2 rounded-full"
                >
                  Hire Me
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
