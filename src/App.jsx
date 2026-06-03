import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import DailyWord from './components/DailyWord'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Sermons from './components/Sermons'
import Events from './components/Events'
import Give from './components/Give'
import SmoothCursor from './components/SmoothCursor'
import PrayerRequestSection from './components/PrayerRequestSection'
import ConnectSection from './components/ConnectSection'
import AdminPortal from './components/AdminPortal'
import CookieBanner from './components/CookieBanner'
import { trackPageView } from './lib/analytics.js'

const PAGE_ROUTES = ['home', 'sermons', 'events', 'give', 'admin']
const HOME_SECTIONS = ['about', 'daily-word', 'stories', 'faq', 'prayer', 'connect']

function getHashTarget() {
  return window.location.hash.replace('#', '').toLowerCase()
}

function getRoute() {
  const hash = getHashTarget()
  if (HOME_SECTIONS.includes(hash)) return 'home'
  return PAGE_ROUTES.includes(hash) ? hash : 'home'
}

function getHomeSectionTarget() {
  const hash = getHashTarget()
  return HOME_SECTIONS.includes(hash) ? hash : null
}

function scrollToHomeSection(targetId) {
  requestAnimationFrame(() => {
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

function HomeFlow() {
  return (
    <>
      <Hero />
      <About />
      <DailyWord />
      <Testimonials />
      <FAQ />
      <PrayerRequestSection />
      <ConnectSection />
    </>
  )
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const handleRouteHash = () => {
      const nextRoute = getRoute()
      const nextSection = getHomeSectionTarget()

      if (nextRoute === route) {
        if (route === 'home' && nextSection) {
          scrollToHomeSection(nextSection)
        }
        return
      }

      setIsTransitioning(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        setRoute(nextRoute)
        setIsTransitioning(false)

        if (nextRoute === 'home' && nextSection) {
          scrollToHomeSection(nextSection)
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 330)
    }

    window.addEventListener('hashchange', handleRouteHash)
    return () => {
      window.removeEventListener('hashchange', handleRouteHash)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [route])

  useEffect(() => {
    if (route === 'home') {
      const nextSection = getHomeSectionTarget()
      if (nextSection) {
        scrollToHomeSection(nextSection)
      }
    }
  }, [route])

  useEffect(() => {
    const handleAnalyticsPageView = () => {
      trackPageView(window.location.hash || '#home')
    }

    handleAnalyticsPageView()
    window.addEventListener('hashchange', handleAnalyticsPageView)
    return () => window.removeEventListener('hashchange', handleAnalyticsPageView)
  }, [])

  return (
    <div className="bg-void min-h-screen">
      <SmoothCursor />
      <Navbar />
      <CookieBanner />

      <div
        className={`transition-all duration-500 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {route === 'home' && <HomeFlow />}
        {route === 'sermons' && <Sermons />}
        {route === 'events' && <Events />}
        {route === 'give' && <Give />}
        {route === 'admin' && <AdminPortal />}
        {route !== 'admin' && <Footer />}
      </div>
    </div>
  )
}
