import { useEffect, useRef } from 'react'

const NUM_PARTICLES = 90
const CONNECTION_DIST = 130
const SPEED = 0.35

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const init = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h

      particles = Array.from({ length: NUM_PARTICLES }, () => ({
        x:  Math.random() * w,
        y:  Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r:  Math.random() * 1.5 + 0.5,
        // randomly tint purple or cyan
        hue: Math.random() > 0.5 ? 270 : 190,
      }))
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const alpha = 0.18 * (1 - dist / CONNECTION_DIST)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `hsla(${particles[i].hue}, 70%, 65%, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      // Dots + movement
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, 0.55)`
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        // wrap
        if (p.x < 0)  p.x = w
        if (p.x > w)  p.x = 0
        if (p.y < 0)  p.y = h
        if (p.y > h)  p.y = 0
      }

      animId = requestAnimationFrame(draw)
    }

    init()
    draw()

    const ro = new ResizeObserver(() => {
      init()
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.45 }}
    />
  )
}
