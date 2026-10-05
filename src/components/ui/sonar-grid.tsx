"use client"

import React, { useEffect, useRef } from 'react'

interface Ring {
  x: number
  y: number
  radius: number
  maxRadius: number
  speed: number
  color: string
}

export function SonarGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let rings: Ring[] = []
    const spacing = 40 // Grid spacing
    const dotRadius = 1.5

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    // Add ambient ping periodically
    const ambientInterval = setInterval(() => {
      rings.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: 300 + Math.random() * 200,
        speed: 1.5 + Math.random(),
        color: `rgba(59, 130, 246, 1)` // Blue-ish
      })
    }, 3000)

    // Interaction handler
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      rings.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 500,
        speed: 3,
        color: `rgba(16, 185, 129, 1)` // Emerald green for interaction
      })
    }
    canvas.addEventListener('mousedown', handleClick)

    // Initial ring for first paint
    rings.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 100,
      maxRadius: 600,
      speed: 2,
      color: `rgba(59, 130, 246, 1)`
    })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw rings
      rings.forEach((ring, index) => {
        ring.radius += ring.speed
        if (ring.radius > ring.maxRadius) {
          rings.splice(index, 1)
        }
      })

      // Draw grid dots
      ctx.fillStyle = '#27272a' // Base zinc-800 color for dots

      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          let dotIntensity = 0
          let currentR, currentG, currentB

          // Calculate if this dot is affected by any expanding ring
          rings.forEach(ring => {
            const dist = Math.hypot(x - ring.x, y - ring.y)
            const ringThickness = 40

            // If dot is near the ring's current radius
            if (Math.abs(dist - ring.radius) < ringThickness) {
              // Calculate intensity based on how close it is to the ring line (0 to 1)
              const intensity = 1 - (Math.abs(dist - ring.radius) / ringThickness)
              // Fade out based on how big the ring is getting
              const fade = 1 - (ring.radius / ring.maxRadius)

              if (intensity * fade > dotIntensity) {
                dotIntensity = intensity * fade
                // Parse color (assuming rgba formatted strings like "rgba(R, G, B, A)")
                const match = ring.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/)
                if (match) {
                  currentR = parseInt(match[1])
                  currentG = parseInt(match[2])
                  currentB = parseInt(match[3])
                }
              }
            }
          })

          ctx.beginPath()
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2)

          if (dotIntensity > 0 && currentR !== undefined) {
            // Highlighted dot
            // Base color is #27272a (39, 39, 42)
            const r = Math.floor(39 + (currentR - 39) * dotIntensity)
            const g = Math.floor(39 + ((currentG || 0) - 39) * dotIntensity)
            const b = Math.floor(42 + ((currentB || 0) - 42) * dotIntensity)
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          } else {
            ctx.fillStyle = '#27272a'
          }

          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousedown', handleClick)
      clearInterval(ambientInterval)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block' }}
    />
  )
}
