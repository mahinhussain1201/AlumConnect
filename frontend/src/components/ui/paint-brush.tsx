import React, { useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PaintBrushProps {
  className?: string
  brushColor?: string
  brushSize?: number
  fadeDuration?: number
  maxTrails?: number
}

interface Trail {
  id: number
  x: number
  y: number
  opacity: number
  size: number
  timestamp: number
}

const PaintBrush: React.FC<PaintBrushProps> = ({
  className,
  brushColor = '#3b82f6',
  brushSize = 8,
  fadeDuration = 2000,
  maxTrails = 50
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trailsRef = useRef<Trail[]>([])
  const trailIdRef = useRef(0)
  const animationFrameRef = useRef<number>(null)

  const updateTrails = useCallback(() => {
    const now = Date.now()
    trailsRef.current = trailsRef.current.filter(trail => {
      const age = now - trail.timestamp
      const progress = age / fadeDuration
      trail.opacity = Math.max(0, 1 - progress)
      return trail.opacity > 0
    })

    if (containerRef.current) {
      const container = containerRef.current
      container.innerHTML = ''
      
      trailsRef.current.forEach(trail => {
        const dot = document.createElement('div')
        dot.style.position = 'absolute'
        dot.style.left = `${trail.x}px`
        dot.style.top = `${trail.y}px`
        dot.style.width = `${trail.size}px`
        dot.style.height = `${trail.size}px`
        dot.style.backgroundColor = brushColor
        dot.style.borderRadius = '50%'
        dot.style.opacity = trail.opacity.toString()
        dot.style.pointerEvents = 'none'
        dot.style.transform = 'translate(-50%, -50%)'
        dot.style.transition = 'opacity 0.1s ease-out'
        container.appendChild(dot)
      })
    }

    if (trailsRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(updateTrails)
    }
  }, [brushColor, fadeDuration])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newTrail: Trail = {
      id: trailIdRef.current++,
      x,
      y,
      opacity: 1,
      size: brushSize + Math.random() * 4,
      timestamp: Date.now()
    }

    trailsRef.current.push(newTrail)

    // Limit the number of trails
    if (trailsRef.current.length > maxTrails) {
      trailsRef.current = trailsRef.current.slice(-maxTrails)
    }

    // Start animation if not already running
    if (!animationFrameRef.current) {
      updateTrails()
    }
  }, [brushSize, maxTrails, updateTrails])

  const handleMouseLeave = useCallback(() => {
    // Keep trails but stop adding new ones
  }, [])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-auto overflow-hidden",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  )
}

export { PaintBrush }
