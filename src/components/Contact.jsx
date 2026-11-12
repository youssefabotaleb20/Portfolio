import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { SiUpwork, SiFiverr, SiGithub } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { FiArrowUpRight, FiCopy, FiCheck, FiDownload, FiMail } from 'react-icons/fi'
import { ME } from '../data/me.js'
import { LAYERS } from '../data/layers.js'
import { Words, Rise } from './Reveal.jsx'
import Magnetic from './Magnetic.jsx'

function Row({ href, icon: Icon, label, note, download, color }) {
  return (
    <a href={href} {...(download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
      className="sweep group flex items-center gap-4 border-b border-rule px-2 py-5" style={{ '--c': color }}>
      <Icon className="flex-none" size={20} aria-hidden="true" />
      <span className="display text-[26px]">{label}</span>
      <span className="ml-auto text-[14px] text-dim">{note}</span>
      {download ? <FiDownload className="flex-none" /> : <FiArrowUpRight className="flex-none transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
    </a>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  // the stack closes again: six bands of light rise behind the last headline
  const rise = LAYERS.map((_, i) => useTransform(scrollYProgress, [0.1 + i * 0.05, 0.75 + i * 0.05], ['100%', '0%'])) // eslint-disable-line react-hooks/rules-of-hooks

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ME.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.getSelection()?.selectAllChildren(document.getElementById('email-text'))
    }
  }

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden border-t border-rule">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[70%] items-end gap-[2px] opacity-[0.16]">
        {LAYERS.map((l, i) => (
          <motion.span key={l.id} style={{ y: reduce ? 0 : rise[i], height: `${48 + ((i * 37) % 52)}%`, background: `linear-gradient(${l.color}, transparent)` }} className="block flex-1 rounded-t-[28px]" />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-40">
        <h2 className="display text-[clamp(52px,10.500vw,190px)]" aria-label="Let's build your next app.">
          <Words text="Let's build" className="block" />
          <Words text="your next app." className="block" delay={0.15} wordClass={(w, i) => (i > 0 ? 'display-i text-glow' : '')} />
        </h2>

        <Rise className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic><a href={`mailto:${ME.email}`} className="btn btn-solid"><FiMail /> Email me</a></Magnetic>
          <button type="button" onClick={copy} className="btn btn-ghost max-w-full" aria-live="polite">
            <span id="email-text" className="truncate">{copied ? 'Copied to clipboard' : ME.email}</span>
            {copied ? <FiCheck className="flex-none" /> : <FiCopy className="flex-none" />}
          </button>
        </Rise>

        <div className="mt-20 grid gap-6 md:grid-cols-2 md:gap-10">
          <Rise className="rounded-[28px] border border-rule bg-night-2/90 p-6 md:p-10">
            <h3 className="display text-[clamp(30px,3vw,44px)]">Hiring for a project?</h3>
            <p className="mt-3 text-ink-2">Book me on a platform with milestone payments, or email the brief.</p>
            <div className="mt-7 border-t border-rule">
              <Row href={ME.upwork} icon={SiUpwork} label="Upwork" note="Hire with milestones" color="#c8d1cc" />
              <Row href={ME.fiverr} icon={SiFiverr} label="Fiverr" note="Fixed-price gigs" color="#6ee7b7" />
            </div>
          </Rise>
          <Rise delay={0.1} className="rounded-[28px] border border-rule bg-night-2/90 p-6 md:p-10">
            <h3 className="display text-[clamp(30px,3vw,44px)]">Recruiting?</h3>
            <p className="mt-3 text-ink-2">Everything for a hiring decision: the CV, my profile and the code.</p>
            <div className="mt-7 border-t border-rule">
              <Row href={ME.cv} icon={FiDownload} label="Download CV" note="PDF" download color="#7aa2ff" />
              <Row href={ME.linkedin} icon={FaLinkedinIn} label="LinkedIn" note="Profile" color="#f4a261" />
              <Row href={ME.github} icon={SiGithub} label="GitHub" note="Code" color="#e9d16f" />
            </div>
          </Rise>
        </div>
      </div>
    </section>
  )
}
