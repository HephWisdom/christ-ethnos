import { useState, useRef, useEffect } from 'react'
import bibleImage from '../assets/bible-image.png'

const verses = [
  {
    ref: 'Isaiah 41:10',
    quote: 'Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.',
    meditation: 'In stillness you discover that you were never alone. The fear you carry has no claim on a heart surrendered to grace.',
  },
  {
    ref: 'Psalm 46:10',
    quote: 'Be still, and know that I am God.',
    meditation: 'Silence is not emptiness — it is fullness waiting to be recognized. When you stop striving, you begin to receive.',
  },
  {
    ref: 'Romans 8:38–39',
    quote: 'Neither death nor life, neither angels nor demons, can separate us from the love of God.',
    meditation: 'Love this complete asks nothing more of you than to rest in it. You are held not by what you do, but by who He is.',
  },
]

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

  const now = new Date()
  const dayStr = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })
  const verse = verses[active]

  return (
    <section id="daily-word" ref={ref} className="relative py-28 md:py-40 overflow-hidden bg-void">
      {/* Premium background with multiple gradient layers */}
      <div className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% -20%, #c24f0c 0%, #7c3c12 30%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 50% 120%, #ea580c 0%, #c2410c 20%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 45% 110%, #fb7a24 0%, transparent 40%),
            #080808
          `,
        }}
      >
        <img
          src={bibleImage}
          alt="Bible-themed background"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          style={{ mixBlendMode: 'soft-light' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.4),rgba(8,8,8,0.88))]" />
      </div>

      {/* Atmospheric fog layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3/4 z-0 animate-drift opacity-35 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 120% 60% at 50% 100%, rgba(194,65,12,0.2) 0%, transparent 65%)
          `,
        }}
      />

      {/* Top ember glow accent */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #c2550c, #eadb0c 40%, transparent)' }}
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
                background: `linear-gradient(135deg, #1a0800 0%, #7c2d12 35%, #c2410c 65%, #ea580c 100%)`,
                padding: '2px',
                boxShadow: '0 20px 60px rgba(194, 65, 12, 0.4), 0 0 80px rgba(234, 88, 12, 0.25)',
              }}
            >
              <div
                className="relative rounded-3xl overflow-hidden h-full backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, #150600 0%, #7c2d1250 50%, #8b1a1a 75%, #6b1612 100%)`
                }}
              >
                <img
                  src={bibleImage}
                  alt="Meditative prayer scene"
                  className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-60"
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,8,8,0.45),rgba(8,8,8,0.75))]" />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, rgba(234,88,12,0.15), transparent 60%)`
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
                  <span className="font-label tracking-[0.2em] text-sm text-bone/90 uppercase">Christ Enthos</span>
                  <span className="btn-bracket text-xs py-1 px-3" style={{ borderColor: 'rgba(245,240,232,0.3)', fontStyle: 'italic' }}>(menu)</span>
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
              <em className="text-ember-400 drop-shadow-lg">every morning</em>
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
                      ? 'border-ember-500 bg-gradient-to-r from-ember-950/60 to-ember-900/30 shadow-lg shadow-ember-600/20'
                      : 'border-bone/10 hover:border-ember-400/40 hover:bg-ember-950/20'
                  }`}
                >
                  <p className="meta-label text-ember-400/90 mb-1 font-semibold">{v.ref}</p>
                  <p className="font-body text-sm text-bone/70 leading-relaxed line-clamp-2 italic">
                    "{v.quote}"
                  </p>
                </button>
              ))}
            </div>

            <button className="btn-bracket-glow mt-10 transition-all duration-300 hover:shadow-lg hover:shadow-ember-500/50">(subscribe to daily word)</button>
          </div>
        </div>
      </div>
    </section>
  )
}
