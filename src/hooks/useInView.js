import { useEffect, useRef, useState } from 'react'

export default function useInView({ margin = '0px 0px -15% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (once) io.disconnect() }
      else if (!once) setInView(false)
    }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin, once])
  return [ref, inView]
}
