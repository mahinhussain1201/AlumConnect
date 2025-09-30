import React, { useEffect, useRef } from 'react'

interface StarsAnimationProps {
  className?: string
  starCount?: number
  speed?: number
}

export const StarsAnimation: React.FC<StarsAnimationProps> = ({ 
  className = '', 
  starCount = 100,
  speed = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Star class
    class Star {
      x: number = 0
      y: number = 0
      z: number = 0
      prevX: number = 0
      prevY: number = 0
      trail: { x: number; y: number; opacity: number }[] = []

      constructor() {
        if (!canvas) return
        
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.z = Math.random() * 1000
        this.prevX = this.x
        this.prevY = this.y
      }

      update() {
        if (!canvas) return
        
        this.prevX = this.x
        this.prevY = this.y
        this.z -= speed
        
        // Add current position to trail
        const screenX = (this.x - canvas.width / 2) * (1000 / this.z) + canvas.width / 2
        const screenY = (this.y - canvas.height / 2) * (1000 / this.z) + canvas.height / 2
        this.trail.push({ x: screenX, y: screenY, opacity: 1 })
        
        // Limit trail length and fade older points
        if (this.trail.length > 8) {
          this.trail.shift()
        }
        
        // Fade trail points
        this.trail.forEach((point, index) => {
          point.opacity = (index + 1) / this.trail.length * 1.0
        })
        
        if (this.z <= 0) {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.z = 1000
          this.trail = [] // Clear trail when star resets
        }
      }

      draw() {
        if (!canvas || !ctx) return
        
        const x = (this.x - canvas.width / 2) * (1000 / this.z) + canvas.width / 2
        const y = (this.y - canvas.height / 2) * (1000 / this.z) + canvas.height / 2
        const prevX = (this.prevX - canvas.width / 2) * (1000 / this.z) + canvas.width / 2
        const prevY = (this.prevY - canvas.height / 2) * (1000 / this.z) + canvas.height / 2

        const size = (1000 - this.z) / 1000 * 8
        const opacity = Math.min((1000 - this.z) / 1000, 1.0)

        // Draw fading trail
        if (this.trail.length > 1) {
          for (let i = 0; i < this.trail.length - 1; i++) {
            const current = this.trail[i]
            const next = this.trail[i + 1]
            
            const trailGradient = ctx.createLinearGradient(current.x, current.y, next.x, next.y)
            trailGradient.addColorStop(0, `rgba(59, 130, 246, ${current.opacity * 0.6})`)
            trailGradient.addColorStop(1, `rgba(37, 99, 235, ${next.opacity * 0.8})`)
            
            ctx.strokeStyle = trailGradient
            ctx.lineWidth = size * 0.8
            ctx.beginPath()
            ctx.moveTo(current.x, current.y)
            ctx.lineTo(next.x, next.y)
            ctx.stroke()
          }
        }

        // Create blue gradient for main star trail
        const gradient = ctx.createLinearGradient(prevX, prevY, x, y)
        gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity * 0.8})`) // blue-500 with higher opacity
        gradient.addColorStop(0.5, `rgba(37, 99, 235, ${opacity * 0.9})`) // blue-600 with higher opacity
        gradient.addColorStop(1, `rgba(29, 78, 216, ${opacity})`) // blue-700 with full opacity

        ctx.strokeStyle = gradient
        ctx.lineWidth = size
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()

        // Create radial gradient for star point
        const starGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
        starGradient.addColorStop(0, `rgba(147, 197, 253, ${opacity})`) // blue-300
        starGradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity})`) // blue-500
        starGradient.addColorStop(1, `rgba(29, 78, 216, ${opacity * 0.8})`) // blue-700

        ctx.fillStyle = starGradient
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create stars
    const stars: Star[] = []
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star())
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        star.update()
        star.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [starCount, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}
