import { useEffect, useRef } from 'react'

// 香槟金 · 星尘调色板
const COLORS = ['#C8A45D', '#E3C888', '#7C9EB2', '#D0B27A', '#8C97C6']
const LINK_DIST = 110
const MOUSE_LINK_DIST = 160
const MOUSE_REPEL_DIST = 130
const MAX_PARTICLES = 120

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
}

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${alpha})`
}

export default function ParticleField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const host = canvas.parentElement
    if (!host) return

    let particles: Particle[] = []
    let width = 0
    let height = 0
    let raf = 0
    let running = false
    const mouse = { x: -9999, y: -9999 }

    const rand = (min: number, max: number) => min + Math.random() * (max - min)

    const seed = () => {
      const target = Math.min(
        MAX_PARTICLES,
        Math.max(28, Math.round((width * height) / 12000))
      )
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-0.28, 0.28),
        vy: rand(-0.28, 0.28),
        r: rand(1.6, 3.2),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      width = Math.max(rect.width, 1)
      height = Math.max(rect.height, 1)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const drawDots = () => {
      for (const p of particles) {
        ctx.fillStyle = hexToRgba(p.color, 0.85)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawLinks = () => {
      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.32
            ctx.strokeStyle = hexToRgba(a.color, alpha)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        const mdx = a.x - mouse.x
        const mdy = a.y - mouse.y
        const md2 = mdx * mdx + mdy * mdy
        if (md2 < MOUSE_LINK_DIST * MOUSE_LINK_DIST) {
          const alpha = (1 - Math.sqrt(md2) / MOUSE_LINK_DIST) * 0.45
          ctx.strokeStyle = hexToRgba(a.color, alpha)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
    }

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height)
      drawLinks()
      drawDots()
    }

    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        // 鼠标轻柔排斥
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < MOUSE_REPEL_DIST * MOUSE_REPEL_DIST && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const force = ((MOUSE_REPEL_DIST - d) / MOUSE_REPEL_DIST) * 0.07
          p.vx += (dx / d) * force
          p.vy += (dy / d) * force
        }
        // 阻尼 + 限速 + 漂移保底
        p.vx *= 0.985
        p.vy *= 0.985
        const speed = Math.hypot(p.vx, p.vy)
        if (speed > 0.6) {
          p.vx = (p.vx / speed) * 0.6
          p.vy = (p.vy / speed) * 0.6
        } else if (speed < 0.1) {
          p.vx += rand(-0.06, 0.06)
          p.vy += rand(-0.06, 0.06)
        }
        p.x += p.vx
        p.y += p.vy
        // 边缘环绕
        if (p.x < -8) p.x = width + 8
        else if (p.x > width + 8) p.x = -8
        if (p.y < -8) p.y = height + 8
        else if (p.y > height + 8) p.y = -8
      }
      drawLinks()
      drawDots()
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      if (reducedQuery.matches) {
        stop()
        renderStatic()
      } else {
        start()
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseOut = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    syncMotion()

    const ro = new ResizeObserver(() => {
      resize()
      if (reducedQuery.matches) renderStatic()
    })
    ro.observe(host)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onMouseOut)
    reducedQuery.addEventListener('change', syncMotion)

    return () => {
      stop()
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      document.documentElement.removeEventListener('mouseleave', onMouseOut)
      reducedQuery.removeEventListener('change', syncMotion)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  )
}
