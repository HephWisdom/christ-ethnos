import { useState, useRef, useEffect } from 'react'
import bibleImage from '../assets/bible-image.png'
import { dailyWordFallback } from '../../shared/content.js'
import { useContentCollection } from '../hooks/useContentCollection.js'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

export default function DailyWord() {
  const [active, setActive] = useState(0)
  const [ref, inView] = useInView()
  const { items: verses } = useContentCollection('/api/daily-word', dailyWordFallback)

  const now = new Date()
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })
  const verse = verses[active] ?? dailyWordFallback[0]

  useEffect(() => {
    if (active > verses.length - 1) {
      setActive(0)
    }
  }, [active, verses.length])

  return (
    <section id="daily-word" ref={ref} className="relative py-28 md:py-40 overflow-hidden bg-void">
      {/* Premium background with multiple gradient layers */}
      <div className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 72% 48% at 50% 0%, rgba(230, 200, 155, 0.22) 0%, rgba(162, 114, 76, 0.16) 28%, transparent 62%),
            radial-gradient(ellipse 92% 66% at 50% 120%, rgba(72, 48, 36, 0.62) 0%, rgba(33, 22, 18, 0.28) 34%, transparent 62%),
            #040505
          `,
        }}
      >
        <img
          src={bibleImage}
          alt="Bible-themed background"
          className="absolute inset-0 h-full w-full object-cover opacity-28"
          style={{ mixBlendMode: 'soft-light' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,5,0.38),rgba(4,5,5,0.9))]" />
      </div>

      {/* Atmospheric fog layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3/4 z-0 animate-drift opacity-35 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 120% 60% at 50% 100%, rgba(162, 114, 76, 0.18) 0%, transparent 65%)
          `,
        }}
      />

      {/* Top ember glow accent */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(230, 200, 155, 0.42), rgba(162, 114, 76, 0.18) 42%, transparent 72%)' }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-16">

        {/* Section label */}
        <div className={`flex items-center gap-6 mb-20 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <span className="meta-label">Daily Scripture</span>
          <div className="flex-1 h-px bg-bone/10" />
          <span className="meta-label">03 • 02</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — mobile card mockup */}
          <div className={`flex justify-center transition-all duration-1000 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            <div
              className="relative w-72 rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(145deg, #090b0b 0%, #2b211b 36%, #6a4b37 70%, #bc8c61 100%)',
                padding: '2px',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.55), 0 0 80px rgba(188, 140, 97, 0.18)',
              }}
            >
              <div
                className="relative rounded-3xl overflow-hidden h-full backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(145deg, rgba(6,7,7,0.96) 0%, rgba(33,22,18,0.92) 55%, rgba(72,48,36,0.88) 100%)',
                }}
              >
                <img
                  src={bibleImage}
                  alt="Meditative prayer scene"
                  className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-36"
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(4,5,5,0.45),rgba(4,5,5,0.75))]" />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(230, 200, 155, 0.12), transparent 60%)',
                  }}
                />
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 pt-5 pb-2">
                  <span className="font-label text-xs text-bone/50">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-2 border border-bone/40 rounded-sm">
                      <div className="w-2 h-full bg-bone/40 rounded-sm" />
                    </div>
                  </div>
                </div>

                {/* App header */}
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="font-label tracking-[0.2em] text-sm text-bone/90 uppercase">Christ Ēthnos</span>
                  <span className="btn-bracket text-xs py-1 px-3" style={{ borderColor: 'rgba(244,238,228,0.3)', fontStyle: 'italic' }}>(menu)</span>
                </div>

                {/* Meta */}
                <div className="flex justify-between px-6 pt-4 pb-2">
                  <div>
                    <p className="meta-label text-bone/40" style={{ fontSize: '9px' }}>DAILY WORD</p>
                    <p className="font-label text-bone/50" style={{ fontSize: '10px' }}>02 • 08</p>
                  </div>
                  <div className="text-right">
                    <p className="meta-label text-bone/40" style={{ fontSize: '9px' }}>DAILY CALM</p>
                    <p className="font-label text-bone/50" style={{ fontSize: '10px' }}>{dayStr}</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="px-6 pt-4 pb-8">
                  <p className="font-display text-xl leading-snug text-bone" style={{ fontStyle: 'italic' }}>
                    {verse.meditation}
                  </p>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <button className="border border-bone/40 px-4 py-2 font-label text-xs italic text-bone/80 tracking-widest">
                    (get daily word by email)
                  </button>
                </div>

                {/* Scripture ref */}
                <div className="flex justify-between items-end px-6 pb-6 pt-4 border-t border-bone/10">
                  <div>
                    <p className="meta-label text-bone/30" style={{ fontSize: '9px' }}>{verse.ref.split(' ')[0].toUpperCase()}</p>
                    <p className="font-display text-2xl text-bone/70">{verse.ref.replace(/\D+/g, ':').replace(/^:/, '')}</p>
                  </div>
                  <span className="font-label text-bone/30 text-xs tracking-widest">AV</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — verse selector + text */}
          <div className={`transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-bone mb-8 animate-fade-in">
              A word for
              <br />
              <em className="text-ember-300 drop-shadow-lg">every morning</em>
            </h2>

            <p className="font-body text-bone/50 text-base leading-relaxed max-w-md mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Each day we share a scripture and a short reflection —
              a quiet moment to anchor your heart before the world rushes in.
            </p>

            {/* Verse cards with enhanced hover effects */}
            <div className="flex flex-col gap-4">
              {verses.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`text-left p-5 border transition-all duration-300 backdrop-blur-sm ${
                    active === i
                      ? 'border-ember-400 bg-gradient-to-r from-ember-950/80 to-ember-900/40 shadow-lg shadow-ember-900/30'
                      : 'border-bone/10 hover:border-ember-300/35 hover:bg-ember-950/25'
                  }`}
                >
                  <p className="meta-label text-ember-300/90 mb-1 font-semibold">{v.ref}</p>
                  <p className="font-body text-sm text-bone/70 leading-relaxed line-clamp-2 italic">
                    "{v.quote}"
                  </p>
                </button>
              ))}
            </div>

            <button className="btn-bracket-glow mt-10 transition-all duration-300 hover:shadow-lg hover:shadow-ember-800/40">(subscribe to daily word)</button>
          </div>
        </div>
      </div>
    </section>
  )
}
