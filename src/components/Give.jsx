import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../lib/api.js'

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
  const [customAmount, setCustomAmount] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    frequency: 'one-time',
    note: '',
  })
  const [status, setStatus] = useState({ tone: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const effectiveAmount = Number(customAmount) > 0 ? Number(customAmount) : selected

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ tone: 'idle', message: '' })

    try {
      await apiRequest('/api/giving-intents', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          amount: effectiveAmount,
        }),
      })

      setStatus({
        tone: 'success',
        message: 'Giving intent saved. Your finance team can now follow up from the database.',
      })
      setForm({
        name: '',
        email: '',
        phone: '',
        frequency: 'one-time',
        note: '',
      })
      setCustomAmount('')
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <em className="text-ember-300">quiet invitation</em>
        </h1>

        <blockquote className="mx-auto max-w-2xl text-bone/75 text-xl md:text-2xl italic font-body leading-relaxed">
          "Each of you should give what you have decided in your heart to give, not reluctantly or
          under compulsion, for God loves a cheerful giver."
        </blockquote>
        <cite className="mt-4 block font-label tracking-[0.2em] text-sm text-ember-300 uppercase">
          2 Corinthians 9:7
        </cite>

        <div className="mt-12 mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {amounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setSelected(amount)}
              className={`text-left border p-4 text-center transition-all duration-300 ${
                selected === amount
                  ? 'border-ember-400 bg-ember-950/45 shadow-[0_0_24px_rgba(162,114,76,0.14)]'
                  : 'border-bone/20 hover:border-bone/35'
              }`}
            >
              <p className="font-display text-2xl text-bone">${amount}</p>
              <p className="font-label text-xs tracking-widest uppercase text-bone/40 mt-1">one-time</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-12 grid max-w-3xl gap-4 text-left md:grid-cols-2">
          <label className="field-shell md:col-span-2">
            <span className="meta-label">Custom Amount</span>
            <input
              className="field-input"
              type="number"
              min="1"
              placeholder={`Current selection: $${selected}`}
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
            />
          </label>
          <label className="field-shell">
            <span className="meta-label">Name</span>
            <input
              className="field-input"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Your full name"
              required
            />
          </label>
          <label className="field-shell">
            <span className="meta-label">Email</span>
            <input
              className="field-input"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="field-shell">
            <span className="meta-label">Phone</span>
            <input
              className="field-input"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="+233..."
            />
          </label>
          <label className="field-shell">
            <span className="meta-label">Frequency</span>
            <select
              className="field-input"
              value={form.frequency}
              onChange={(event) => setForm((current) => ({ ...current, frequency: event.target.value }))}
            >
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label className="field-shell md:col-span-2">
            <span className="meta-label">Note</span>
            <textarea
              className="field-textarea"
              value={form.note}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              placeholder="Optional note for the finance team"
            />
          </label>

          {status.message && (
            <p className={`md:col-span-2 form-status ${status.tone === 'error' ? 'form-status-error' : 'form-status-success'}`}>
              {status.message}
            </p>
          )}

          <div className="md:col-span-2 flex flex-wrap items-center gap-4 pt-2">
            <button className="btn-bracket-glow" disabled={isSubmitting}>
              {isSubmitting ? '(saving...)' : `(give $${effectiveAmount})`}
            </button>
            <span className="font-body text-sm text-bone/35 italic">
              This stores an intent record in MongoDB. It is not a payment gateway yet.
            </span>
          </div>
        </form>
      </section>
    </main>
  )
}
