import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// A soft pool of light that trails the pointer. Desktop pointers only.
export default function Cursor() {
  const x = useMotionValue(-600)
  const y = useMotionValue(-600)
  const sx = useSpring(x, { stiffness: 90, damping: 20 })
  const sy = useSpring(y, { stiffness: 90, damping: 20 })
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!fine) return
    const move = (e) => { x.set(e.clientX - 300); y.set(e.clientY - 300) }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [fine, x, y])

  if (!fine) return null
  return <motion.div aria-hidden="true" style={{ x: sx, y: sy, '--c': '#6ee7b7' }} className="aura fixed left-0 top-0 z-[1] h-[600px] w-[600px] opacity-[0.22]" />
}
