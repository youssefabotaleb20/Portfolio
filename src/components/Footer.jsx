import { SiGithub, SiLinktree } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { ME } from '../data/me.js'

export default function Footer({ scrollContainer }) {
  const scrollToTop = () => {
    if (scrollContainer?.current) {
      scrollContainer.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-black/30 border-t border-white/5 py-8" style={{ scrollSnapAlign: 'end' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()}{' '}
          <span className="gradient-text-blue font-semibold">{ME.name}</span>
          {' '}— Built with React &amp; Tailwind
        </p>

        <div className="flex items-center gap-4">
          <a
            href={ME.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
          >
            <SiGithub size={18} />
          </a>
          <a
            href={ME.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#0a66c2] transition-colors"
          >
            <FaLinkedinIn size={18} />
          </a>
          <a
            href={ME.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#43e55e] transition-colors"
          >
            <SiLinktree size={18} />
          </a>

          <button
            onClick={scrollToTop}
            className="ml-2 text-xs text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 19l7-7-7-7" />
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
