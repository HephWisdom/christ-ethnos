import { useState, useRef, useEffect } from 'react'
import enterTestimonials from '../assets/enter-testimonials.png'
import holdhands from '../assets/hands-holding.png'


const testimonials = [
  {
    name: 'Marcus & Leila T.',
    location: 'East Side, joined 2021',
    story: 'The moment I found Christ Ēthnos',
    body: "I'd been carrying so much for so long. The first Sunday I walked in, something loosened. No performance, no judgment — just an open door. Now I can't imagine Sundays without it.",
  },
  {
    name: 'Adaeze O.',
    location: 'Northgate, joined 2019',
    story: 'I found a family',
    body: "Moving to a new city, I was completely alone. Christ Ēthnos gave me not just a community but people who actually showed up — in the hard moments and the good ones.",
  },
  {
    name: 'David R.',
    location: 'Westbrook, joined 2023',
    story: 'Faith without the fear',
    body: "I grew up with a very different idea of church. Christ Ēthnos showed me that faith could be gentle, that doubt was welcome, and that grace was genuinely unconditional.",
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

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [ref, inView] = useInView()
  const t = testimonials[active]

  return (
    <section id="stories" ref={ref} className="relative bg-void py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={enterTestimonials}
          alt="Cathedral interior background for testimonials"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(4,5,5,0.28) 0%, rgba(4,5,5,0.65) 52%, #040505 100%)',
          }}
        />
      </div>

      {/* Ambient side glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-96 rounded-full blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(188, 140, 97, 0.42), transparent 72%)' }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-16">

        {/* Label row */}
        <div className={`flex items-center gap-6 mb-20 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <span className="meta-label">Stories</span>
          <div className="flex-1 h-px bg-bone/10" />
          <span className="meta-label">04 • 03</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: Small portrait stack */}
          <div className={`lg:col-span-3 flex flex-col gap-3 transition-all duration-1000 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex items-center gap-4 p-4 border transition-all duration-300 text-left group ${
                  active === i ? 'border-ember-500/70 bg-ember-950/45' : 'border-bone/10 hover:border-bone/20'
                }`}
              >
                {/* Avatar (CSS circle with initials) */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    active === i ? 'bg-ember-700' : 'bg-bone/10'
                  }`}
                >
                <span className="font-label text-xs text-bone/80 uppercase tracking-wider">
                  {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-label text-xs text-bone/70 tracking-wider uppercase">{t.name.split(' & ')[0]}</p>
                <p className="font-body text-xs text-bone/35 italic mt-0.5">{t.location.split(',')[0]}</p>
              </div>
            </button>
          ))}
        </div>

          {/* Right: Quote + nav */}
          <div className={`lg:col-span-4 flex flex-col justify-between transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div>
              <div className="quote-mark mb-2">"</div>
              <h3 className="font-display text-2xl md:text-3xl text-bone italic mb-6 leading-snug">{t.story}</h3>
              <p className="font-body text-base text-bone/50 leading-relaxed">{t.body}</p>

              <div className="mt-8 pt-6 border-t border-bone/10">
                <p className="font-label text-xs tracking-widest text-bone/60 uppercase">{t.name}</p>
                <p className="font-body text-xs italic text-bone/30 mt-1">{t.location}</p>
              </div>
            </div>

            {/* Next / Prev */}
            <div className="flex items-center gap-6 mt-10">
              <button
                onClick={() => setActive((active - 1 + testimonials.length) % testimonials.length)}
                className="font-label italic text-sm text-bone/40 hover:text-bone/80 transition-colors tracking-widest"
              >
                (prev)
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${active === i ? 'bg-ember-400 w-6' : 'bg-bone/20'}`}
                    />
                  ))}
              </div>
              <button
                onClick={() => setActive((active + 1) % testimonials.length)}
                className="font-label italic text-sm text-bone/40 hover:text-bone/80 transition-colors tracking-widest"
              >
                (next)
              </button>
            </div>
          </div>
           {/* Ember glow right */}
      <div className="absolute left-0 bottom-1/2 -translate-y-1/2 w-96 h-96 blur-[160px] opacity-10 pointer-events-none"
        style={{ background: 'rgba(162, 114, 76, 0.45)' }}
      />
        </div>
      </div>
    </section>
  )
}
