import { useEffect, useRef, useState } from 'react'
import { eventFallback } from '../../shared/content.js'
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

export default function Events() {
  const [ref, inView] = useInView()
  const { items: events } = useContentCollection('/api/events', eventFallback)

  return (
    <section id="events" ref={ref} className="min-h-screen bg-void pt-28 md:pt-36 pb-28">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div
          className={`flex items-center gap-6 mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="meta-label">Events</span>
          <div className="flex-1 h-px bg-bone/10" />
          <span className="meta-label">06 • 02</span>
        </div>

        <div
          className={`grid gap-8 md:grid-cols-2 xl:grid-cols-3 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {events.map((event, i) => (
            <article
              key={event.title + event.date}
              className="relative border border-bone/12 bg-ash/85 px-8 py-10 transition-all duration-500 hover:border-ember-500/55"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <p className="font-display text-[4.5rem] leading-none text-ember-400">{event.date}</p>
              <p className="font-label uppercase tracking-[0.3em] text-sm text-bone/45 mt-2">{event.month}</p>
              <h2 className="font-display text-3xl md:text-4xl mt-8 text-bone leading-tight">{event.title}</h2>
              <p className="meta-label mt-5">{event.location}</p>
              <button className="mt-8 btn-bracket">(register)</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
