import React, { type PropsWithChildren, useEffect, useRef, useState } from 'react'

export function DraggableZoom(props: PropsWithChildren<object>) {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  })

  const [scale, setScale] = useState(1)

  const [dragging, setDragging] = useState(false)
  const offsetRef = useRef({
    x: 0,
    y: 0,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(position)
  positionRef.current = position

  const scaleRef = useRef(scale)
  scaleRef.current = scale

  const pinchStartDistanceRef = useRef<number | null>(null)
  const pinchStartScaleRef = useRef<number>(1)
  const pinchStartMidpointRef = useRef({ x: 0, y: 0 })
  const pinchStartPositionRef = useRef({ top: 0, left: 0 })

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) return

      setDragging(true)

      offsetRef.current = {
        x: event.clientX - positionRef.current.left,
        y: event.clientY - positionRef.current.top,
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragging) return

      setPosition({
        left: event.clientX - offsetRef.current.x,
        top: event.clientY - offsetRef.current.y,
      })
    }

    const handleTouchStart = (event: TouchEvent) => {
      const isInside = containerRef.current?.contains(event.target as Node)
      if (!isInside && !dragging) return

      if (!dragging) setDragging(true)

      if (event.touches.length === 1) {
        offsetRef.current = {
          x: event.touches[0].clientX - positionRef.current.left,
          y: event.touches[0].clientY - positionRef.current.top,
        }
        pinchStartDistanceRef.current = null
      } else if (event.touches.length === 2) {
        const t1 = event.touches[0]
        const t2 = event.touches[1]
        pinchStartDistanceRef.current = Math.sqrt(
          (t1.clientX - t2.clientX) ** 2 + (t1.clientY - t2.clientY) ** 2
        )
        pinchStartScaleRef.current = scaleRef.current
        pinchStartMidpointRef.current = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        }
        pinchStartPositionRef.current = { ...positionRef.current }
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!dragging) return

      if (event.touches.length === 1 && pinchStartDistanceRef.current === null) {
        setPosition({
          left: event.touches[0].clientX - offsetRef.current.x,
          top: event.touches[0].clientY - offsetRef.current.y,
        })
      } else if (event.touches.length === 2 && pinchStartDistanceRef.current !== null && pinchStartDistanceRef.current > 0) {
        event.preventDefault()
        const t1 = event.touches[0]
        const t2 = event.touches[1]
        const currentDistance = Math.sqrt(
          (t1.clientX - t2.clientX) ** 2 + (t1.clientY - t2.clientY) ** 2
        )
        const currentMidpoint = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        }

        const nextScale =
          (currentDistance / pinchStartDistanceRef.current) * pinchStartScaleRef.current
        const clampedScale = Math.min(50, Math.max(0.1, nextScale))

        const scaleRatio = clampedScale / pinchStartScaleRef.current
        setPosition({
          left:
            currentMidpoint.x -
            (pinchStartMidpointRef.current.x - pinchStartPositionRef.current.left) * scaleRatio,
          top:
            currentMidpoint.y -
            (pinchStartMidpointRef.current.y - pinchStartPositionRef.current.top) * scaleRatio,
        })
        setScale(clampedScale)
      }
    }

    const handleTouchEnd = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        setDragging(false)
      } else if (event.touches.length === 1) {
        offsetRef.current = {
          x: event.touches[0].clientX - positionRef.current.left,
          y: event.touches[0].clientY - positionRef.current.top,
        }
        pinchStartDistanceRef.current = null
      }
    }

    const handleMouseUp = () => {
      setDragging(false)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [dragging])

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()

    const nextScale = event.deltaY < 0 ? scale * 1.25 : scale / 1.25

    const clampedScale = Math.min(50, Math.max(0.1, nextScale))

    if (clampedScale !== scale) {
      const mouseX = event.clientX
      const mouseY = event.clientY

      const scaleRatio = clampedScale / scale

      setPosition({
        left: mouseX - (mouseX - position.left) * scaleRatio,
        top: mouseY - (mouseY - position.top) * scaleRatio,
      })
      setScale(clampedScale)
    }
  }

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        cursor: dragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}>
      <div
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          scale,
          userSelect: 'none',
          transformOrigin: 'top left',
        }}>
        {props.children}
      </div>
    </div>
  )
}
