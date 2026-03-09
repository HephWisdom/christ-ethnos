import { useEffect, useRef, useState } from 'react'

const amounts = [10, 25, 50, 100, 250]

function useInView(threshold = 0.2) {
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

export default function Give() {
  const [ref, inView] = useInView()
  const [selected, setSelected] = useState(amounts[1])

  return (
    <main id="give" className="min-h-screen bg-ash pt-28 md:pt-36 pb-24">
      <section
        ref={ref}
        className={`max-w-4xl mx-auto px-6 md:px-12 text-center transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <p className="meta-label">Generosity</p>
        <h1 className="font-display text-5xl md:text-6xl text-bone mt-5 mb-8 leading-tight">
          Every gift is a
          <br />
          <em className="text-ember-500">quiet invitation</em>
        </h1>

        <blockquote className="mx-auto max-w-2xl text-bone/75 text-xl md:text-2xl italic font-body leading-relaxed">
          "Each of you should give what you have decided in your heart to give, not reluctantly or
          under compulsion, for God loves a cheerful giver."
        </blockquote>
        <cite className="mt-4 block font-label tracking-[0.2em] text-sm text-ember-500 uppercase">
          2 Corinthians 9:7
        </cite>

        <div className="mt-12 mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {amounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelected(amount)}
              className={`text-left border p-4 text-center transition-all duration-300 ${
                selected === amount
                  ? 'border-ember-600 bg-ember-950/40'
                  : 'border-bone/20 hover:border-bone/35'
              }`}
            >
              <p className="font-display text-2xl text-bone">${amount}</p>
              <p className="font-label text-xs tracking-widest uppercase text-bone/40 mt-1">one-time</p>
            </button>
          ))}
        </div>

        <button className="mt-10 btn-bracket-glow">(give today)</button>
      </section>
    </main>
  )
}
