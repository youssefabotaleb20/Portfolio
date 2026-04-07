import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ME } from '../data/me.js'

function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay]     = useState('')
  const [wordIdx, setWordIdx]     = useState(0)
  const [charIdx, setCharIdx]     = useState(0)
  const [deleting, setDeleting]   = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const delay = deleting ? speed / 2 : speed

    const timeout = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplay(current.slice(0, charIdx + 1))
        setCharIdx(charIdx + 1)
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), pause)
      } else if (deleting && charIdx > 0) {
        setDisplay(current.slice(0, charIdx - 1))
        setCharIdx(charIdx - 1)
      } else {
        setDeleting(false)
        setWordIdx((wordIdx + 1) % words.length)
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return display
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
  }),
}

export default function Hero({ scrollContainer }) {
  const role = useTypewriter(ME.roles)

  const scrollToSection = (href) => {
    const target = document.querySelector(href)
    if (target && scrollContainer?.current) {
      scrollContainer.current.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="snap-section relative flex flex-col items-center justify-center text-center overflow-hidden px-6"
    >
      {/* Glowing orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-sm font-medium tracking-widest uppercase text-cyan-400 mb-4"
        >
          Welcome to my portfolio
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-4"
        >
          Hi, I&apos;m{' '}
          <span className="gradient-text">{ME.name}</span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg sm:text-xl md:text-3xl font-semibold text-gray-300 mb-6 h-8 sm:h-10 flex items-center justify-center"
        >
          <span>{role}</span>
          <span className="typewriter-cursor" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {ME.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => scrollToSection('#projects')}
            className="btn-gradient text-white font-semibold px-8 py-3.5 rounded-full text-base cursor-pointer w-full sm:w-auto"
          >
            View My Work
          </button>
          <button
            onClick={() => scrollToSection('#contact')}
            className="btn-outline font-semibold px-8 py-3.5 rounded-full text-base cursor-pointer w-full sm:w-auto"
          >
            Contact Me
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => scrollToSection('#about')}
      >
        <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
        <div className="bounce-arrow text-gray-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
