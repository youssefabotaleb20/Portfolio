import { useRef } from 'react'

// Pulls its child a few pixels toward the pointer (fine pointers only).
export default function Magnetic({ children, strength = 0.25, className = '' }) {
  const ref = useRef(null)
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
  const onMove = (e) => {
    if (!fine) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = '' }
  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-flex transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </span>
  )
}
