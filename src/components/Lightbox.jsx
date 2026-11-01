import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Lightbox({ images, startIndex, title, onClose }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [])
  const [idx, setIdx] = useState(startIndex ?? 0)

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length)
  const next = () => setIdx((i) => (i + 1) % images.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const multi = images.length > 1

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center"
        style={{ background: 'rgba(15,23,32,0.88)' }}
        role="dialog" aria-modal="true" aria-label={title ? `${title} screenshots` : 'Screenshots'}
        onClick={onClose}
      >
        {/* Panel — stops click propagation so clicking image doesn't close */}
        <motion.div
          key="lightbox-panel"
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1,    opacity: 1 }}
          exit={{ scale: 0.93,    opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative flex flex-col items-center max-w-5xl w-[92vw]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header row */}
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="mono text-[#c9d0d8]">
              {title && <span className="text-white">{title}</span>}
              {title && multi && <span className="mx-2 text-[#9aa5b1]">·</span>}
              {multi && (
                <span className="tabular text-[#9aa5b1]">{idx + 1} / {images.length}</span>
              )}
            </span>
            <button
              onClick={onClose}
              className="p-1 text-[#c9d0d8] transition-colors hover:text-cut"
              aria-label="Close"
            >
              <FiX size={22} />
            </button>
          </div>

          {/* Image + side arrows */}
          <div className="relative w-full flex items-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={idx}
                src={images[idx]}
                alt={`${title ?? 'Screenshot'} ${idx + 1}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="w-full max-h-[75vh] object-contain bg-white"
                draggable={false}
              />
            </AnimatePresence>

            {multi && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-ink text-white transition-colors hover:bg-cut"
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-ink text-white transition-colors hover:bg-cut"
                  aria-label="Next image"
                >
                  <FiChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Dot indicators */}
          {multi && (
            <div className="flex gap-2 mt-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className="h-[3px] transition-all duration-200"
                  style={{
                    width:      i === idx ? 28 : 12,
                    background: i === idx ? '#ff4d00' : 'rgba(255,255,255,0.35)',
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
