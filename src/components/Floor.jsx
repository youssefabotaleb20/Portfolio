import { useEffect, useRef } from 'react'

// Animated grid floor. The loop only runs while it is on screen.
export default function Floor({ className = '', style }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-live', e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} aria-hidden="true" className={`floor ${className}`} style={style} />
}
