import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../lib/api.js'
import { getOnlineServiceConfig, isOnlineServiceConfigured } from '../lib/onlineService.js'
import { getWhatsAppHref, isWhatsAppConfigured } from '../lib/whatsapp.js'

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

export default function ConnectSection() {
  const [ref, inView] = useInView()
  const onlineService = getOnlineServiceConfig()
  const onlineReady = isOnlineServiceConfigured()
  const whatsappHref = getWhatsAppHref()
  const whatsappReady = isWhatsAppConfigured()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    visitType: 'online-service',
    preferredFollowUp: whatsappReady ? 'whatsapp' : 'email',
    message: '',
  })
  const [status, setStatus] = useState({ tone: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ tone: 'idle', message: '' })

    try {
      await apiRequest('/api/contact-messages', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      setStatus({
        tone: 'success',
        message: 'Your message is in. The follow-up team can now see it in the admin dashboard.',
      })
      setForm({
        name: '',
        email: '',
        phone: '',
        visitType: 'online-service',
        preferredFollowUp: whatsappReady ? 'whatsapp' : 'email',
        message: '',
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
    <section id="connect" ref={ref} className="relative bg-ash py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-16">
        <div className={`flex items-center gap-6 mb-20 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="meta-label">Connect</span>
          <div className="flex-1 h-px bg-bone/10" />
          <span className="meta-label">06 • 04</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <p className="meta-label">Online Guests</p>
            <h2 className="mt-5 font-display text-4xl md:text-6xl leading-tight text-bone">
              Join us on
              <br />
              <em className="text-ember-300">Zoom with ease</em>
            </h2>
            <p className="mt-8 max-w-lg font-body text-lg leading-relaxed text-bone/48">
              Our online service meets on Zoom. To keep the room warm, safe, and easy to manage,
              we send the Zoom link through WhatsApp and email follow-up instead of leaving it floating
              in public. Join the WhatsApp flow or leave your email below and our welcome team will send
              you the access details before service starts.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <article className="border border-bone/10 bg-void/45 p-4">
                <p className="meta-label">When</p>
                <p className="mt-3 font-display text-2xl text-bone leading-tight">{onlineService.serviceTime}</p>
              </article>
              <article className="border border-bone/10 bg-void/45 p-4">
                <p className="meta-label">Platform</p>
                <p className="mt-3 font-display text-2xl text-bone leading-tight">{onlineService.platform}</p>
              </article>
              <article className="border border-bone/10 bg-void/45 p-4">
                <p className="meta-label">Get The Link</p>
                <p className="mt-3 font-display text-2xl text-bone leading-tight">WhatsApp or Email</p>
              </article>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-bracket"
                onClick={() => {
                  setForm((current) => ({
                    ...current,
                    visitType: 'first-visit',
                    preferredFollowUp: 'email',
                    message: 'I am new here. Please email me the Zoom details and follow up with me after the online service.',
                  }))
                }}
              >
                (email me the zoom link)
              </button>

              {onlineReady && (
                <a
                  href={onlineService.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-bracket"
                >
                  (open zoom room)
                </a>
              )}
            </div>

            <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-bone/34 italic">
              {onlineService.host} sends Zoom details and reminders before service. If you are new,
              start with WhatsApp or leave your email so we can welcome you properly.
            </p>

            <div className="mt-10 border border-emerald-500/18 bg-emerald-500/6 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="meta-label text-emerald-200/80">WhatsApp</p>
                  <h3 className="mt-3 font-display text-2xl text-bone">Need a faster reply?</h3>
                  <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-bone/45">
                    Follow us on WhatsApp for quick questions, Zoom access details, and simple first-visit support.
                  </p>
                </div>
                <span className={`whatsapp-dot ${whatsappReady ? 'whatsapp-dot-live' : 'whatsapp-dot-muted'}`} />
              </div>

              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-bracket-glow mt-6 inline-block"
                >
                  (follow on whatsapp)
                </a>
              ) : (
                <p className="mt-6 font-body text-sm italic text-bone/28">
                  Add `VITE_WHATSAPP_NUMBER` in `.env` to enable this button.
                </p>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`border border-bone/12 bg-void/75 p-6 md:p-8 transition-all duration-1000 delay-150 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="mb-6">
              <p className="meta-label">Online Guest Form</p>
              <h3 className="mt-3 font-display text-3xl text-bone leading-tight">
                Ask for the Zoom link
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-bone/42">
                Leave your email or phone and we will send the Zoom details, welcome you properly,
                and follow up after service if you want.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                <span className="meta-label">Best Follow-up</span>
                <select
                  className="field-input"
                  value={form.preferredFollowUp}
                  onChange={(event) => setForm((current) => ({ ...current, preferredFollowUp: event.target.value }))}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone call</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
                <span className="font-body text-xs italic text-bone/28">
                  Choose how you want to receive the Zoom link.
                </span>
              </label>
              <label className="field-shell md:col-span-2">
                <span className="meta-label">Message</span>
                <textarea
                  className="field-textarea min-h-[180px]"
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  placeholder="Tell the team what you need before, during, or after the online service..."
                  required
                />
              </label>
            </div>

            {status.message && (
              <p className={`mt-5 form-status ${status.tone === 'error' ? 'form-status-error' : 'form-status-success'}`}>
                {status.message}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="btn-bracket-glow" disabled={isSubmitting}>
                {isSubmitting ? '(sending...)' : '(send me the zoom details)'}
              </button>
              <span className="font-body text-sm italic text-bone/30">
                Stored in the `ContactMessage` collection.
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
