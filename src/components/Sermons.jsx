import { useEffect, useRef, useState } from 'react'
import { sermonFallback } from '../../shared/content.js'
import { useContentCollection } from '../hooks/useContentCollection.js'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

export default function Sermons() {
  const [ref, inView] = useInView()
  const [active, setActive] = useState(null)
  const { items: sermons } = useContentCollection('/api/sermons', sermonFallback)

  return (
    <main id="sermons" className="min-h-screen bg-ash pt-28 md:pt-36 pb-24">
      <section ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div
          className={`flex items-center gap-6 mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="meta-label">Sermons</span>
          <div className="flex-1 h-px bg-bone/10" />
          <span className="meta-label">06 • 01</span>
        </div>

        <h1
          className={`font-display text-5xl md:text-6xl text-bone leading-tight transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Listen to recent
          <br />
          <em className="text-ember-300">preaching</em>
        </h1>

        <p
          className={`mt-6 max-w-2xl text-bone/55 font-body text-lg leading-relaxed transition-all duration-1000 delay-100 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Every Sunday we offer a 30-45 minute message rooted in scripture and lived wisdom.
          Choose one to listen with subtitles and save it for your walk home.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sermons.map((sermon, i) => {
            const video = `https://www.youtube.com/embed/${sermon.videoId}?autoplay=1&modestbranding=1&rel=0`
            const visible = inView ? `opacity-100 translate-y-0` : 'opacity-0 translate-y-8'

            return (
              <article
                key={sermon.title}
                className={`group border border-bone/12 bg-void p-6 transition-all duration-700 ${visible}`}
                style={{ transitionDelay: `${100 + i * 90}ms` }}
              >
                <p className="font-label uppercase tracking-[0.22em] text-[11px] text-bone/45">{sermon.speaker}</p>
                <h2 className="font-display text-2xl md:text-3xl text-bone mt-4 leading-tight">{sermon.title}</h2>
                <p className="mt-4 font-body text-sm text-bone/45">{sermon.date}</p>
                <p className="font-label text-xs tracking-[0.2em] uppercase text-bone/35">{sermon.duration}</p>
                <button
                  onClick={() => setActive(video)}
                  className="mt-8 btn-bracket inline-block"
                >
                  (listen)
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-50 bg-void/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl">
            <button
              className="absolute -top-12 right-0 font-label tracking-[0.2em] text-xs text-bone/70 uppercase"
              onClick={() => setActive(null)}
            >
              (close)
            </button>
            <div className="aspect-video border border-ember-400/35 shadow-[0_0_40px_rgba(162,114,76,0.18)]">
              <iframe
                title="Sermon player"
                src={active}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
