import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Lightbox({ images, startIndex, title, onClose }) {
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
        style={{ background: 'rgba(5,5,16,0.92)', backdropFilter: 'blur(12px)' }}
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
            <span className="text-sm font-semibold text-gray-300">
              {title && <span className="text-white">{title}</span>}
              {title && multi && <span className="text-gray-500 mx-2">·</span>}
              {multi && (
                <span className="text-gray-500">{idx + 1} / {images.length}</span>
              )}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close"
            >
              <FiX size={22} />
            </button>
          </div>

          {/* Image + side arrows */}
          <div className="relative w-full flex items-center gap-3">
            {multi && (
              <button
                onClick={prev}
                className="flex-shrink-0 glass-card w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                aria-label="Previous image"
              >
                <FiChevronLeft size={20} />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={idx}
                src={images[idx]}
                alt={`${title ?? 'Screenshot'} ${idx + 1}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex-1 max-h-[75vh] w-full object-contain rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}
                draggable={false}
              />
            </AnimatePresence>

            {multi && (
              <button
                onClick={next}
                className="flex-shrink-0 glass-card w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                aria-label="Next image"
              >
                <FiChevronRight size={20} />
              </button>
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
                  className="transition-all duration-200 rounded-full"
                  style={{
                    width:      i === idx ? 20 : 8,
                    height:     8,
                    background: i === idx
                      ? 'linear-gradient(135deg, #7c3aed, #00d4ff)'
                      : 'rgba(255,255,255,0.2)',
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
