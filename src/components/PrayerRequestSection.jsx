import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../lib/api.js'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        obs.disconnect()
      }
    }, { threshold })

    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, inView]
}

export default function PrayerRequestSection() {
  const [ref, inView] = useInView()
  const [form, setForm] = useState({
    name: '',
    email: '',
    request: '',
    isPrivate: false,
  })
  const [status, setStatus] = useState({ tone: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ tone: 'idle', message: '' })

    try {
      await apiRequest('/api/prayer-requests', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      setStatus({
        tone: 'success',
        message: 'Your prayer request was received.',
      })
      setForm({
        name: '',
        email: '',
        request: '',
        isPrivate: false,
      })
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
    <section id="prayer" ref={ref} className="relative overflow-hidden bg-void py-28 md:py-36">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 56% 40% at 15% 15%, rgba(188, 140, 97, 0.12) 0%, transparent 72%),
            radial-gradient(ellipse 44% 52% at 84% 85%, rgba(72, 48, 36, 0.48) 0%, transparent 70%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-16">
        <div className={`flex items-center gap-6 mb-20 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="meta-label">Prayer</span>
          <div className="flex-1 h-px bg-bone/10" />
          <span className="meta-label">06 • 03</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <p className="meta-label">Pastoral Care</p>
            <h2 className="mt-5 font-display text-4xl md:text-6xl leading-tight text-bone">
              Let someone
              <br />
              <em className="text-ember-300">stand with you</em>
            </h2>
            <p className="mt-8 max-w-xl font-body text-lg leading-relaxed text-bone/50">
              Private burdens should not stay private forever.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                'Requests can be marked private.',
                'Your pastors can review them in the admin portal.',
                'The form stores submissions in real time.',
                'Email is optional for prayer-only requests.',
              ].map((item) => (
                <div key={item} className="border-t border-bone/10 pt-4">
                  <p className="font-body text-sm leading-relaxed text-bone/42">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`border border-bone/12 bg-[#080909]/80 p-6 md:p-8 shadow-[0_0_64px_rgba(72,48,36,0.16)] transition-all duration-1000 delay-150 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-shell">
                <span className="meta-label">Name</span>
                <input
                  className="field-input"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your name"
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
                  placeholder="Optional"
                />
              </label>
              <label className="field-shell md:col-span-2">
                <span className="meta-label">Prayer Request</span>
                <textarea
                  className="field-textarea min-h-[180px]"
                  value={form.request}
                  onChange={(event) => setForm((current) => ({ ...current, request: event.target.value }))}
                  placeholder="Share what you want prayer for..."
                  required
                />
              </label>
            </div>

            <label className="mt-5 flex items-center gap-3 font-body text-sm text-bone/55">
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={(event) => setForm((current) => ({ ...current, isPrivate: event.target.checked }))}
                className="h-4 w-4 accent-ember-500"
              />
              Mark this request as private to the pastoral team.
            </label>

            {status.message && (
              <p className={`mt-5 form-status ${status.tone === 'error' ? 'form-status-error' : 'form-status-success'}`}>
                {status.message}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="btn-bracket-glow" disabled={isSubmitting}>
                {isSubmitting ? '(sending...)' : '(send prayer request)'}
              </button>
              <span className="font-body text-sm italic text-bone/30">
                Shared with the pastoral care team.
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
