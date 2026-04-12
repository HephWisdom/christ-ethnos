import { useEffect, useRef, useState } from 'react'
import { eventFallback } from '../../shared/content.js'
import { useContentCollection } from '../hooks/useContentCollection.js'
import { apiRequest } from '../lib/api.js'

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
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    attendees: 1,
    notes: '',
  })
  const [status, setStatus] = useState({ tone: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function openRegistration(event) {
    if (!event.id) return
    setSelectedEvent(event)
    setRegistrationForm({
      name: '',
      email: '',
      phone: '',
      attendees: 1,
      notes: '',
    })
    setStatus({ tone: 'idle', message: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ tone: 'idle', message: '' })

    try {
      await apiRequest('/api/event-registrations', {
        method: 'POST',
        body: JSON.stringify({
          ...registrationForm,
          eventId: selectedEvent.id,
        }),
      })

      setStatus({
        tone: 'success',
        message: 'Registration received. Our team will follow up by email.',
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
              <button
                className="mt-8 btn-bracket disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-bone/90"
                onClick={() => openRegistration(event)}
                disabled={!event.id}
              >
                (register)
              </button>
            </article>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-void/92 backdrop-blur-md px-4 py-10 overflow-y-auto">
          <div className="mx-auto max-w-2xl border border-bone/12 bg-[#090b0b] p-8 md:p-10 shadow-[0_0_80px_rgba(162,114,76,0.12)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="meta-label">Event Registration</p>
                <h3 className="mt-4 font-display text-3xl md:text-4xl text-bone leading-tight">
                  {selectedEvent.title}
                </h3>
                <p className="mt-4 font-body text-bone/50">{selectedEvent.location}</p>
              </div>
              <button
                type="button"
                className="btn-bracket"
                onClick={() => setSelectedEvent(null)}
              >
                (close)
              </button>
            </div>

            <form className="mt-10 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="field-shell">
                <span className="meta-label">Name</span>
                <input
                  className="field-input"
                  value={registrationForm.name}
                  onChange={(event) => setRegistrationForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </label>
              <label className="field-shell">
                <span className="meta-label">Email</span>
                <input
                  className="field-input"
                  type="email"
                  value={registrationForm.email}
                  onChange={(event) => setRegistrationForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label className="field-shell">
                <span className="meta-label">Phone</span>
                <input
                  className="field-input"
                  value={registrationForm.phone}
                  onChange={(event) => setRegistrationForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="+233..."
                />
              </label>
              <label className="field-shell">
                <span className="meta-label">Attendees</span>
                <input
                  className="field-input"
                  type="number"
                  min="1"
                  max="20"
                  value={registrationForm.attendees}
                  onChange={(event) => setRegistrationForm((current) => ({ ...current, attendees: event.target.value }))}
                  required
                />
              </label>
              <label className="field-shell md:col-span-2">
                <span className="meta-label">Notes</span>
                <textarea
                  className="field-textarea"
                  value={registrationForm.notes}
                  onChange={(event) => setRegistrationForm((current) => ({ ...current, notes: event.target.value }))}
                  placeholder="Anything our team should know?"
                />
              </label>

              {status.message && (
                <p className={`md:col-span-2 form-status ${status.tone === 'error' ? 'form-status-error' : 'form-status-success'}`}>
                  {status.message}
                </p>
              )}

              <div className="md:col-span-2 flex flex-wrap items-center gap-4 pt-2">
                <button type="submit" className="btn-bracket-glow" disabled={isSubmitting}>
                  {isSubmitting ? '(sending...)' : '(reserve my place)'}
                </button>
                <span className="font-body text-sm text-bone/35 italic">
                  Registration lands directly in MongoDB.
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
