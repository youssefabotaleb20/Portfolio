import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]#$%&*+=?'

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Text that "decodes": random glyphs settle into the real letters, left to right.
// Starts when `active` turns true. Returns the string to render.
export default function useDecode(text, active = true, { duration = 900, delay = 0 } = {}) {
  const [out, setOut] = useState(text)
  const done = useRef(false)

  useEffect(() => {
    if (!active || done.current || reduced()) return
    let raf
    let start
    const tick = (t) => {
      if (start === undefined) start = t + delay
      const p = Math.max(0, Math.min(1, (t - start) / duration))
      const settled = Math.floor(p * text.length)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (i < settled || c === ' ' || c === '\n') s += c
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (p < 1) raf = requestAnimationFrame(tick)
      else { done.current = true; setOut(text) }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, text, duration, delay])

  return out
}
