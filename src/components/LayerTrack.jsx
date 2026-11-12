import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { LAYERS } from '../data/layers.js'
import { MOTIFS } from './Stack.jsx'

/* Phones: the six layers as a horizontal track. The current layer sits in the
   middle, its neighbours lean away on either side, and the row slides along
   on its own, by swipe or by tapping a card. Each card is its own flat 3D
   object (the track has perspective but no preserve-3d), so cards can
   overlap without ever cutting through each other. */
const N = LAYERS.length
const wrap = (d) => ((d % N) + N + Math.floor(N / 2)) % N - Math.floor(N / 2) // -3..2

export default function LayerTrack({ active, setActive, width = 172, height = 136, step = 118 }) {
  const reduce = useReducedMotion()
  const paused = useRef(0)
  const go = (i) => { paused.current = Date.now(); setActive(((i % N) + N) % N) }

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => {
      if (Date.now() - paused.current > 6000) setActive((a) => (a + 1) % N)
    }, 2200)
    return () => clearInterval(t)
  }, [reduce, setActive])

  return (
    <div className="relative">
      <motion.div
        className="relative mx-auto touch-pan-y"
        style={{ height: height + 24, perspective: 900 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15} dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.offset.x < -36) go(active + 1)
          else if (info.offset.x > 36) go(active - 1)
        }}
      >
        {LAYERS.map((l, i) => {
          const d = wrap(i - active)
          const far = Math.abs(d)
          return (
            <motion.button
              key={l.id} type="button" onClick={() => go(i)} tabIndex={far ? -1 : 0}
              aria-label={`${l.name} layer`} aria-hidden={far ? 'true' : undefined}
              className="absolute left-1/2 top-3"
              style={{ width, height, marginLeft: -width / 2, zIndex: 10 - far, '--c': l.color }}
              initial={false}
              animate={{
                x: d * step,
                rotateY: d * -34,
                scale: far === 0 ? 1 : far === 1 ? 0.8 : 0.66,
                opacity: far === 0 ? 1 : far === 1 ? 0.55 : 0,
              }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 24 }}
            >
              <span className="plate block" style={{ boxShadow: far ? undefined : `0 26px 50px -22px ${l.color}aa, 0 0 0 1px rgb(0 0 0 / .5)` }}>
                <svg viewBox="0 0 240 190" preserveAspectRatio="xMidYMid meet">{MOTIFS[l.id]}</svg>
                <span className="plate-name !text-[13px]">{l.name}</span>
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* one pill per layer; the current one stretches */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {LAYERS.map((l, i) => (
          <button key={l.id} type="button" onClick={() => go(i)} aria-label={`Show ${l.name}`} className="flex h-6 items-center">
            <motion.span className="block h-1.5 rounded-full" style={{ background: l.color }}
              animate={{ width: i === active ? 22 : 6, opacity: i === active ? 1 : 0.35 }} transition={{ duration: 0.4 }} />
          </button>
        ))}
      </div>
    </div>
  )
}
