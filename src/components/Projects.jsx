import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiExternalLink, FiGithub, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { PROJECTS } from '../data/projects.js'
import Lightbox from './Lightbox.jsx'

/* ─── Description modal ─────────────────────────────────────── */
function DescriptionModal({ project, onClose }) {
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="desc-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9997] flex items-center justify-center px-4"
        style={{ background: 'rgba(5,5,16,0.85)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      >
        <motion.div
          key="desc-panel"
          initial={{ scale: 0.95, opacity: 0, y: 12 }}
          animate={{ scale: 1,    opacity: 1, y: 0  }}
          exit={{ scale: 0.95,    opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="glass-card w-full max-w-lg p-7 flex flex-col gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold text-white leading-snug">{project.title}</h3>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Full description */}
          <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-full"
              >
                <FiExternalLink size={13} />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
              >
                <FiGithub size={13} />
                Code
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}

/* ─── Project card ───────────────────────────────────────────── */
const DESC_LIMIT = 90

function ProjectCard({ project, index, inView, onImageClick, onReadMore }) {
  const [imgIdx, setImgIdx] = useState(0)
  const { images = [] } = project
  const hasImages = images.length > 0
  const multi     = images.length > 1

  const isLong    = project.description.length > DESC_LIMIT
  const shortDesc = isLong
    ? project.description.slice(0, DESC_LIMIT).trimEnd() + '…'
    : project.description

  const prevImg = (e) => {
    e.stopPropagation()
    setImgIdx((i) => (i - 1 + images.length) % images.length)
  }
  const nextImg = (e) => {
    e.stopPropagation()
    setImgIdx((i) => (i + 1) % images.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="glass-card flex-shrink-0 w-[82vw] sm:w-80 md:w-96 overflow-hidden cursor-default"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Image / carousel area */}
      <div className="relative w-full h-52 overflow-hidden bg-white/5 group/img">
        {hasImages ? (
          <>
            <img
              src={images[imgIdx]}
              alt={`${project.title} screenshot ${imgIdx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105 cursor-zoom-in"
              onClick={() => onImageClick(images, imgIdx)}
              draggable={false}
            />

            {multi && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 glass-card w-8 h-8 flex items-center justify-center text-white"
                  aria-label="Previous screenshot"
                >
                  <FiChevronLeft size={16} />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 glass-card w-8 h-8 flex items-center justify-center text-white"
                  aria-label="Next screenshot"
                >
                  <FiChevronRight size={16} />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
                      aria-label={`Screenshot ${i + 1}`}
                      className="rounded-full transition-all duration-200"
                      style={{
                        width:      i === imgIdx ? 16 : 6,
                        height:     6,
                        background: i === imgIdx
                          ? 'linear-gradient(135deg, #7c3aed, #00d4ff)'
                          : 'rgba(255,255,255,0.4)',
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 pointer-events-none">
              <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                Click to expand
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-600">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <span className="text-xs">No screenshot yet</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>

        {/* Truncated description + read more */}
        <p className="text-sm text-gray-400 leading-relaxed mb-1">
          {shortDesc}
          {isLong && (
            <button
              onClick={onReadMore}
              className="ml-1 text-cyan-400 hover:text-cyan-300 transition-colors font-medium whitespace-nowrap"
            >
              Read more
            </button>
          )}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5 mt-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-full"
            >
              <FiExternalLink size={13} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
            >
              <FiGithub size={13} />
              Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Section ────────────────────────────────────────────────── */
export default function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const scrollRef = useRef(null)
  const [lightbox,  setLightbox]  = useState(null) // { images, index, title }
  const [activeDesc, setActiveDesc] = useState(null) // project object

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 380, behavior: 'smooth' })
  }

  return (
    <section id="projects" className="snap-section flex items-center" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 w-full py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-start sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold section-heading inline-block">
              Projects
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl">
              A selection of projects I&apos;ve built for clients and personal development.
            </p>
          </div>

          <div className="hidden md:flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll(-1)}
              className="glass-card w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              aria-label="Previous"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="glass-card w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              aria-label="Next"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* py-3 gives cards clearance for the hover-lift (overflow-x:auto clips overflow-y) */}
        <div
          ref={scrollRef}
          className="projects-scroll flex gap-5 overflow-x-auto py-3"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              inView={inView}
              onImageClick={(imgs, idx) =>
                setLightbox({ images: imgs, index: idx, title: project.title })
              }
              onReadMore={() => setActiveDesc(project)}
            />
          ))}
        </div>
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}

      {activeDesc && (
        <DescriptionModal
          project={activeDesc}
          onClose={() => setActiveDesc(null)}
        />
      )}
    </section>
  )
}
