import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// Full-screen screenshots: arrow keys, Escape, swipe on touch screens.
export default function Lightbox({ images, title, onClose }) {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const closeRef = useRef(null)
  const multi = images.length > 1
  const go = (d) => { setDir(d); setIdx((i) => (i + d + images.length) % images.length) }

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    const prevFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      prevFocus?.focus?.()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[90] flex flex-col bg-night p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
        <p className="display text-[28px] md:text-[36px]">{title}</p>
        <div className="flex items-center gap-4">
          {multi && <span className="text-[15px] tabular-nums text-dim">{idx + 1} of {images.length}</span>}
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:bg-ink hover:text-night">
            <FiX size={20} />
          </button>
        </div>
      </div>

      <div className="relative mt-4 flex min-h-0 flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.img
            key={idx}
            src={images[idx]}
            alt={`${title} screenshot ${idx + 1}`}
            custom={dir}
            variants={{ enter: (d) => ({ opacity: 0, x: d * 60, scale: 0.97 }), show: { opacity: 1, x: 0, scale: 1 }, exit: (d) => ({ opacity: 0, x: d * -60, scale: 0.97 }) }}
            initial="enter"
            animate="show"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            drag={multi ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => { if (info.offset.x < -70) go(1); else if (info.offset.x > 70) go(-1) }}
            draggable={false}
            className="max-h-full max-w-full touch-pan-y rounded-xl border border-rule object-contain"
          />
        </AnimatePresence>
        {multi && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous screenshot" className="absolute left-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-night transition-transform hover:scale-110 md:left-2">
              <FiChevronLeft size={22} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next screenshot" className="absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-night transition-transform hover:scale-110 md:right-2">
              <FiChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {multi && (
        <div className="mt-4 flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
          {images.map((_, i) => (
            <button key={i} type="button" onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }} aria-label={`Screenshot ${i + 1}`} aria-current={i === idx} className="flex h-6 items-center">
              <span className={`block h-[3px] rounded-full transition-all duration-300 ${i === idx ? 'w-8 bg-glow' : 'w-3 bg-ink/30'}`} />
            </button>
          ))}
        </div>
      )}
    </motion.div>,
    document.body,
  )
}
