import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { LAYERS } from '../data/layers.js'

// One small line drawing per layer, drawn in the layer's colour.
const MOTIFS = {
  frontend: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="44" y="40" width="152" height="104" rx="10" />
      <path d="M44 62h152" />
      <circle cx="56" cy="51" r="2.4" fill="currentColor" /><circle cx="66" cy="51" r="2.4" /><circle cx="76" cy="51" r="2.4" />
      <rect x="58" y="76" width="56" height="54" rx="5" opacity=".7" />
      <path d="M126 80h56M126 94h42M126 108h50M126 122h30" opacity=".7" />
    </g>
  ),
  mobile: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="88" y="26" width="64" height="124" rx="13" />
      <path d="M110 36h20" />
      <rect x="98" y="50" width="44" height="30" rx="5" opacity=".7" />
      <path d="M98 94h44M98 106h30M98 118h38" opacity=".7" />
      <circle cx="170" cy="56" r="7" opacity=".7" /><path d="M177 62l8 8" opacity=".7" />
    </g>
  ),
  backend: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M70 60L44 88l26 28M170 60l26 28-26 28M134 48l-28 80" />
      <path d="M52 146h60M124 146h28" opacity=".6" />
    </g>
  ),
  ai: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M120 34c3 26 12 35 38 38-26 3-35 12-38 38-3-26-12-35-38-38 26-3 35-12 38-38z" />
      <path d="M176 100c1.500 12 6 16.500 18 18-12 1.500-16.500 6-18 18-1.500-12-6-16.500-18-18 12-1.500 16.500-6 18-18z" opacity=".75" />
      <circle cx="62" cy="126" r="5" opacity=".7" /><circle cx="92" cy="146" r="3" opacity=".7" /><path d="M66 129l22 15" opacity=".7" />
    </g>
  ),
  data: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <ellipse cx="120" cy="50" rx="58" ry="17" />
      <path d="M62 50v72c0 9.400 26 17 58 17s58-7.600 58-17V50" />
      <path d="M62 74c0 9.400 26 17 58 17s58-7.600 58-17M62 98c0 9.400 26 17 58 17s58-7.600 58-17" opacity=".7" />
    </g>
  ),
  cloud: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M78 116a26 26 0 0 1 4-51.700A36 36 0 0 1 151 58a29 29 0 0 1 9 58z" />
      <circle cx="60" cy="146" r="6" /><circle cx="120" cy="146" r="6" /><circle cx="180" cy="146" r="6" fill="currentColor" />
      <path d="M66 146h48M126 146h48" opacity=".7" />
    </g>
  ),
}

/* The signature: six plates floating in depth. `progress` (0..1, a motion
   value) pulls them apart; the pointer tilts the whole rig. Only transforms
   and opacity move, so it stays cheap on phones. */
export default function Stack({ progress, size = 320, gap = 46, spread = 86, interactive = true, labels = true, active = -1, still = false, className = '' }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 16 })
  const sy = useSpring(py, { stiffness: 60, damping: 16 })

  useEffect(() => {
    if (!interactive || reduce || !window.matchMedia('(pointer: fine)').matches) return
    const move = (e) => {
      px.set(e.clientX / window.innerWidth - 0.5)
      py.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [interactive, reduce, px, py])

  const rotateX = useTransform([progress, sy], ([p, y]) => 60 - p * 6 - y * 9)
  const rotateZ = useTransform([progress, sx], ([p, x]) => -40 + p * 22 + x * 14)

  return (
    <div className={`stack-scene ${className}`} aria-hidden="true">
      <motion.div className="stack-rig relative mx-auto" style={{ width: size, height: size, rotateX, rotateZ }}>
        {LAYERS.map((l, i) => (
          <Plate key={l.id} layer={l} index={i} progress={progress} gap={gap} spread={spread} reduce={reduce} labels={labels} active={active} still={still} />
        ))}
      </motion.div>
    </div>
  )
}

// `active` (phones): that plate stays lit while the others dim. `still` turns
// off the bobbing, which on a small, tightly spaced stack let plates touch.
function Plate({ layer, index, progress, gap, spread, reduce, labels, active, still }) {
  const n = LAYERS.length
  const level = (n - 1) / 2 - index // top plate is the frontend
  const z = useTransform(progress, (p) => level * (gap + p * spread))
  return (
    <motion.div className="absolute inset-0" style={{ z, '--c': layer.color }}>
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { z: 420, opacity: 0 }}
        animate={{ z: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 + (n - 1 - index) * 0.13 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: active < 0 || active === index ? 1 : 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={still ? 'absolute inset-0' : 'plate-float'} style={still ? undefined : { animationDelay: `${-index * 1.1}s` }}>
            <div className="plate">
              <svg viewBox="0 0 240 190" preserveAspectRatio="xMidYMid meet">{MOTIFS[layer.id]}</svg>
              {(labels === true || (labels === 'active' && active === index)) && <span className="plate-name">{layer.name}</span>}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
