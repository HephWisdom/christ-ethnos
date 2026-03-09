import aboutZoom from '../assets/about-zoom.png'
import aboutCloud from '../assets/about-cloud.png'
import { useRef, useEffect, useState } from 'react'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

export default function About() {
  const [ref, inView] = useInView()

  return (
    <section id="about" ref={ref} className="relative bg-void py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={aboutCloud}
          alt="Cloudy cathedral atmosphere"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,8,8,0.28) 0%, rgba(8,8,8,0.7) 52%, #080808 100%)',
          }}
        />
      </div>

      {/* Ambient side glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-96 rounded-full blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(circle, #c2410c, transparent)' }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16">

        {/* Top label row */}
        <div className={`flex items-center gap-6 mb-20 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="meta-label">About Us</span>
          <div className="flex-1 h-px bg-bone/10" />
          <span className="meta-label">02 • 01</span>
        </div>

        {/* Asymmetric two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-0 items-start">

          {/* Left column — organ/architecture visual & small text */}
          <div className={`md:col-span-4 transition-all duration-1000 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

            {/* Architectural illustration with real image treatment */}
            <div className="relative w-full aspect-[3/4] mb-8 overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #111 0%, #1a0800 100%)' }}
            >
              <img
                src={aboutZoom}
                alt="Cathedral interior architecture"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ animation: 'aboutImageZoom 24s ease-in-out infinite alternate' }}
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.8) 100%)',
                  mixBlendMode: 'multiply',
                }}
              />
              {/* Arch */}
              <div className="absolute inset-x-1/4 top-6 bottom-0"
                style={{
                  borderTop: '1px solid rgba(245,240,232,0.15)',
                  borderLeft: '1px solid rgba(245,240,232,0.12)',
                  borderRight: '1px solid rgba(245,240,232,0.12)',
                  borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
                }}
              />
              {/* Inner arch */}
              <div className="absolute inset-x-[30%] top-12 bottom-0"
                style={{
                  borderTop: '1px solid rgba(245,240,232,0.08)',
                  borderLeft: '1px solid rgba(245,240,232,0.06)',
                  borderRight: '1px solid rgba(245,240,232,0.06)',
                  borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
                }}
              />
              {/* Organ pipes (vertical lines) */}
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: `${28 + i * 6}%`,
                    width: '2px',
                    height: `${35 + Math.abs(4 - i) * 8}%`,
                    background: `rgba(245,240,232,${0.06 + i * 0.01})`,
                  }}
                />
              ))}
              {/* Glow at top of arch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-6 rounded-full blur-xl opacity-40 animate-glow-pulse"
                style={{ background: '#fbbf24' }}
              />
            </div>

            {/* Small body text */}
            <p className="font-body text-sm text-bone/40 leading-relaxed">
              Christ Enthos is more than a church, it's a Family.
              A place to slow down, listen deeply, and find something
              greater yet deeply human.
            </p>
            <p className="font-body text-sm text-bone/40 leading-relaxed mt-4">
              We invite gentle connection, wonder, and openness
              blending timeless tradition with present-day presence.
            </p>
          </div>

          {/* Center — large display headline */}
          <div className={`md:col-span-5 md:px-12 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-bone">
              Where faith,
              <br />
              <em className="text-ember-500">Family,</em>
              <br />
              and grace meet
              <br />
              in quiet beauty
            </h2>

            <div className="divider my-8" />

            <p className="font-body text-base md:text-lg text-bone/55 leading-relaxed max-w-sm">
              We are a congregation shaped by ancient wisdom and modern
              compassion, gathering every weekend to worship, serve, and
              belong together.
            </p>

            <button className="btn-bracket mt-10">(about Christ Enthos)</button>
          </div>

          {/* Right — stat blocks */}
          <div className={`md:col-span-3 flex flex-col gap-10 md:pt-16 transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {[
              { num: '3,807', label: 'Hours', note: 'Since 2023' },
              { num: '1,200', label: 'Weekly', note: 'Across all services' },
              { num: '14', label: 'Community programs', note: 'Serving the city' },
            ].map(({ num, label, note }) => (
              <div key={num} className="border-t border-bone/10 pt-6">
                <p className="font-display text-3xl text-ember-400">{num}</p>
                <p className="meta-label mt-1">{label}</p>
                <p className="font-body text-xs text-bone/30 mt-1 italic">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
