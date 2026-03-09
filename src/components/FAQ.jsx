import { useState, useRef, useEffect } from 'react'

const faqs = [
  {
    q: 'Is Christ Enthos a religious community?',
    a: "Christ Enthos is a Christian church that welcomes all people, including those with none, little, or complicated faith backgrounds. It's a space built around presence, compassion, and reflection — not doctrine or conversion pressure.",
  },
  {
    q: 'What should I expect on my first Service?',
    a: "Warm greetings, honest worship, a message that speaks to real life, and no obligation to do or say anything. You're welcome to sit at the back and just observe. There's coffee.",
  },
  {
    q: 'Are children welcome?',
    a: 'Yes. We have dedicated programming for children from nursery through high school during both Sunday services. Families worship together for the opening, then children are dismissed to their own spaces.',
  },
  {
    q: 'How can I get more connected?',
    a: "Start with a Saturday and Sunday service, then consider joining on all social media plaforms.",
  },
]

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

export default function FAQ() {
  const [open, setOpen] = useState(null)
  const [ref, inView] = useInView()

  return (
    <section id="faq" ref={ref} className="relative bg-ash py-28 md:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">

        <div className={`flex items-center gap-6 mb-20 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <span className="meta-label">Questions</span>
          <div className="flex-1 h-px bg-bone/10" />
          <span className="meta-label">05 • 04</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left heading */}
          <div className={`transition-all duration-1000 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-bone">
              Everything you<br />
              want to know<br />
              <em className="text-ember-500">before you visit</em>
            </h2>
            <p className="font-body text-bone/45 text-base leading-relaxed mt-8 max-w-sm">
              First visits can feel uncertain. These questions come from
              people who showed up wondering what they were walking into.
            </p>
            <button className="btn-bracket mt-10">(plan your visit)</button>
          </div>

          {/* Right accordion */}
          <div className={`flex flex-col transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {faqs.map((faq, i) => (
              <div key={i} className="border-t border-bone/10">
                <button
                  className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-display text-base md:text-lg text-bone/80 group-hover:text-bone transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 font-label text-xl text-ember-500 transition-transform duration-300 mt-0.5 ${open === i ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500"
                  style={{ maxHeight: open === i ? '300px' : '0', opacity: open === i ? 1 : 0 }}
                >
                  <p className="font-body text-sm text-bone/50 leading-relaxed pb-6 pr-10">{faq.a}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-bone/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
