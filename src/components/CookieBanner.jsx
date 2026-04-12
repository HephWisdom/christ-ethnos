import { useState } from 'react'
import { getAnalyticsConsent, setAnalyticsConsent, trackConsentGranted, trackPageView } from '../lib/analytics.js'

export default function CookieBanner() {
  const [consent, setConsent] = useState(() => getAnalyticsConsent())

  if (consent) {
    return null
  }

  function handleAccept() {
    setAnalyticsConsent('accepted')
    setConsent('accepted')
    trackConsentGranted()
    trackPageView(window.location.hash || '#home')
  }

  function handleDecline() {
    setAnalyticsConsent('declined')
    setConsent('declined')
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[70] md:left-8 md:right-8">
      <div className="mx-auto max-w-5xl border border-bone/12 bg-[#090b0b]/95 p-5 shadow-[0_0_48px_rgba(0,0,0,0.35)] backdrop-blur-md md:flex md:items-center md:justify-between md:gap-8">
        <div>
          <p className="meta-label">Cookies & Analytics</p>
          <p className="mt-3 max-w-3xl font-body text-sm leading-relaxed text-bone/48">
            We use cookies to understand visits, measure which pages people use, and improve the online guest journey.
            Accepting analytics helps the admin dashboard report real visitor activity.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
          <button type="button" className="btn-bracket" onClick={handleDecline}>
            (decline)
          </button>
          <button type="button" className="btn-bracket-glow" onClick={handleAccept}>
            (accept analytics)
          </button>
        </div>
      </div>
    </div>
  )
}
