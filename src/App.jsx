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
import AmbientSoundToggle from './components/AmbientSoundToggle'

const PAGE_ROUTES = ['home', 'sermons', 'events', 'give']

function getRoute() {
  const hash = window.location.hash.replace('#', '').toLowerCase()
  return PAGE_ROUTES.includes(hash) ? hash : 'home'
}

function HomeFlow() {
  return (
    <>
      <Hero />
      <About />
      <DailyWord />
      <Testimonials />
      <FAQ />
      <Footer />
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
      if (nextRoute === route) return

      setIsTransitioning(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        setRoute(nextRoute)
        setIsTransitioning(false)

        if (nextRoute === 'home') {
          const targetId = window.location.hash.replace('#', '')
          if (targetId && ['about', 'daily-word', 'stories', 'faq'].includes(targetId)) {
            requestAnimationFrame(() => {
              const el = document.getElementById(targetId)
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            })
          }
        }
      }, 330)
    }

    window.addEventListener('hashchange', handleRouteHash)
    return () => {
      window.removeEventListener('hashchange', handleRouteHash)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [route])

  return (
    <div className="bg-void min-h-screen">
      <SmoothCursor />
      <AmbientSoundToggle />
      <Navbar />

      <div
        className={`transition-all duration-500 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {route === 'home' && <HomeFlow />}
        {route === 'sermons' && <Sermons />}
        {route === 'events' && <Events />}
        {route === 'give' && <Give />}
      </div>
    </div>
  )
}
