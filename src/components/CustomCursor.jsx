import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [visible, setVisible]   = useState(false)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)

  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  // Dot snaps immediately
  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 40 })
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 40 })

  // Ring trails behind
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22 })
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22 })

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }

    const onOver = (e) => {
      setHovering(!!e.target.closest('a, button, [role="button"], input, textarea, select, label'))
    }

    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseover',  onOver)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseover',  onOver)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [mouseX, mouseY])

  if (!visible) return null

  const ringSize  = clicking ? 28 : hovering ? 50 : 36
  const dotSize   = clicking ? 4  : hovering ? 5  : 7
  const dotColor  = hovering ? '#7c3aed' : '#00d4ff'
  const dotGlow   = hovering ? '0 0 10px #7c3aed88' : '0 0 8px #00d4ff99'

  return (
    <>
      {/* Trailing ring — gradient border */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width:  ringSize,
          height: ringSize,
          background:
            'linear-gradient(var(--color-bg), var(--color-bg)) padding-box,' +
            'linear-gradient(135deg, #7c3aed, #00d4ff) border-box',
          border: '1.5px solid transparent',
          opacity: 0.85,
          transition: 'width 0.18s ease, height 0.18s ease',
        }}
      />

      {/* Sharp dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width:      dotSize,
          height:     dotSize,
          background: dotColor,
          boxShadow:  dotGlow,
          transition: 'width 0.12s ease, height 0.12s ease, background 0.15s ease, box-shadow 0.15s ease',
        }}
      />
    </>
  )
}
