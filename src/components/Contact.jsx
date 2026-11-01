import { useState } from 'react'
import { SiUpwork, SiFiverr, SiGithub } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { FiArrowUpRight, FiCopy, FiCheck, FiDownload, FiMail } from 'react-icons/fi'
import { ME } from '../data/me.js'

function Row({ href, icon: Icon, label, note, download }) {
  return (
    <a
      href={href}
      {...(download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
      className="group flex items-center gap-4 border-b border-rule py-4 transition-colors hover:text-cut"
    >
      <Icon className="flex-none" size={20} aria-hidden="true" />
      <span className="font-display text-[20px] font-bold">{label}</span>
      <span className="mono ml-auto text-dim"><span className="hidden sm:inline">{note}</span></span>
      {download ? <FiDownload className="flex-none" /> : <FiArrowUpRight className="flex-none transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
    </a>
  )
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
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
    <section id="contact" className="relative overflow-hidden border-t border-rule bg-ground-2">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-32">
        <h2 className="font-display text-[clamp(48px,9vw,140px)] font-extrabold leading-[0.84] tracking-[-0.035em]">
          Let&apos;s build
          <br />
          <span className="text-cut">your next app.</span>
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href={`mailto:${ME.email}`} className="btn btn-cut">
            <FiMail /> Email me
          </a>
          <span id="email-text" className="mono select-all px-2 text-[13px] text-ink normal-case">{ME.email}</span>
          <button type="button" onClick={copy} className="btn btn-line h-11 px-4 text-[14px]" aria-live="polite">
            {copied ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
          </button>
        </div>

        <div className="mt-20 grid gap-14 md:grid-cols-2 md:gap-10">
          <div className="panel p-6 md:p-8">
            <h3 className="font-display text-[28px] font-bold leading-tight">Hiring for a project?</h3>
            <p className="mt-2 text-ink-2">Book me on a platform with milestone payments, or email the brief.</p>
            <div className="mt-6 border-t border-ink">
              <Row href={ME.upwork} icon={SiUpwork} label="Upwork" note="Hire with milestones" />
              <Row href={ME.fiverr} icon={SiFiverr} label="Fiverr" note="Fixed-price gigs" />
            </div>
          </div>
          <div className="panel p-6 md:p-8">
            <h3 className="font-display text-[28px] font-bold leading-tight">Recruiting?</h3>
            <p className="mt-2 text-ink-2">Everything for a hiring decision: the CV, my profile and the code.</p>
            <div className="mt-6 border-t border-ink">
              <Row href={ME.cv} icon={FiDownload} label="Download CV" note="PDF" download />
              <Row href={ME.linkedin} icon={FaLinkedinIn} label="LinkedIn" note="Profile" />
              <Row href={ME.github} icon={SiGithub} label="GitHub" note="Code" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
