import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SiUpwork, SiFiverr, SiGithub, SiLinktree } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import { ME } from '../data/me.js'

const PLATFORMS = [
  {
    name:        'Upwork',
    icon:        SiUpwork,
    color:       '#14a800',
    bg:          'rgba(20, 168, 0, 0.08)',
    border:      'rgba(20, 168, 0, 0.25)',
    description: 'Hire me on Upwork for secure, milestone-based contracts.',
    cta:         'View Upwork Profile',
    url:         ME.upwork,
  },
  {
    name:        'Fiverr',
    icon:        SiFiverr,
    color:       '#1dbf73',
    bg:          'rgba(29, 191, 115, 0.08)',
    border:      'rgba(29, 191, 115, 0.25)',
    description: 'Browse my Fiverr gigs for quick-turnaround web projects.',
    cta:         'View Fiverr Profile',
    url:         ME.fiverr,
  },
  {
    name:        'Email',
    icon:        HiMail,
    color:       '#00d4ff',
    bg:          'rgba(0, 212, 255, 0.06)',
    border:      'rgba(0, 212, 255, 0.2)',
    description: "Prefer direct contact? Send me an email and I'll reply within 24 hours.",
    cta:         'Send an Email',
    url:         `mailto:${ME.email}`,
  },
]

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section id="contact" className="snap-section flex items-center" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 w-full py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Let&apos;s <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Ready to bring your idea to life? Reach out through any of the platforms below
            or drop me a direct email.
          </p>
        </motion.div>

        {/* Platform cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {PLATFORMS.map((platform, i) => {
            const Icon = platform.icon
            return (
              <motion.a
                key={platform.name}
                href={platform.url}
                target={platform.url.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-5 sm:p-7 flex flex-col gap-4 cursor-pointer group no-underline"
                style={{
                  background: platform.bg,
                  borderColor: platform.border,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${platform.color}20` }}
                >
                  <Icon size={26} style={{ color: platform.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{platform.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{platform.description}</p>
                </div>
                <span
                  className="text-sm font-semibold mt-auto flex items-center gap-1.5"
                  style={{ color: platform.color }}
                >
                  {platform.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.a>
            )
          })}
        </div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-5"
        >
          <span className="text-sm text-gray-500">Find me on</span>
          <a
            href={ME.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors p-2"
            aria-label="GitHub"
          >
            <SiGithub size={22} />
          </a>
          <a
            href={ME.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#0a66c2] transition-colors p-2"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={22} />
          </a>
          <a
            href={ME.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#43e55e] transition-colors p-2"
            aria-label="Linktree"
          >
            <SiLinktree size={22} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
