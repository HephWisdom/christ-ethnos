import { useEffect, useRef, useState } from 'react'

export default function SmoothCursor() {
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const pos = useRef({ x: target.current.x, y: target.current.y })
  const raf = useRef(0)
  const [point, setPoint] = useState({ x: target.current.x, y: target.current.y })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const onMove = (event) => {
      target.current = { x: event.clientX, y: event.clientY }
    }

    const animate = () => {
      pos.current = {
        x: pos.current.x + (target.current.x - pos.current.x) * 0.18,
        y: pos.current.y + (target.current.y - pos.current.y) * 0.18,
      }

      const next = document.elementFromPoint(target.current.x, target.current.y)
      const interactive =
        !!next?.closest('a, button, [role="button"], input, textarea, [tabindex]:not([tabindex="-1"])')
      if (interactive !== hover) setHover(interactive)

      setPoint({ x: pos.current.x, y: pos.current.y })
      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    document.body.style.cursor = 'none'
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.body.style.cursor = ''
      cancelAnimationFrame(raf.current)
    }
  }, [hover])

  return (
    <>
      <div
        className="pointer-events-none fixed z-[120] rounded-full border border-bone/40 mix-blend-difference transition-all duration-200"
        style={{
          left: point.x,
          top: point.y,
          width: hover ? 28 : 8,
          height: hover ? 28 : 8,
          transform: 'translate(-50%, -50%)',
          background: hover ? 'rgba(244, 238, 228, 0.15)' : 'transparent',
        }}
      />
      <div
        className="pointer-events-none fixed z-[121] rounded-full bg-bone/90"
        style={{
          left: point.x,
          top: point.y,
          width: hover ? 2 : 6,
          height: hover ? 2 : 6,
          transform: 'translate(-50%, -50%)',
          transition: 'width .18s ease, height .18s ease'
        }}
      />
    </>
  )
}
