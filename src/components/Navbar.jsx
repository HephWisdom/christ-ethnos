import { useState, useEffect } from 'react'

const navLinks = ['About', 'Sermons', 'Events', 'Give', 'FAQ']

function routeHref(label) {
  if (label === 'About') return '#about'
  if (label === 'FAQ') return '#faq'
  return `#${label.toLowerCase()}`
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const renderNavLabel = (label) => (
    <>
      <span className="font-semibold">{label.charAt(0)}</span>
      <span>{label.slice(1)}</span>
    </>
  )

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-transparent backdrop-blur-sm border-b border-bone/10 opacity-100'
            : 'bg-transparent border-b border-bone/10 opacity-100'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <a
            href="#home"
            className="font-label tracking-[0.3em] text-sm text-bone/90 uppercase hover:text-ember-400 transition-colors"
          >
            Christ Enthos
          </a>

          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={routeHref(link)}
                  className="meta-label text-bone/90 hover:text-bone transition-colors duration-200"
                >
                  {renderNavLabel(link)}
                </a>
              </li>
            ))}
          </ul>

          <a href="#give" className="btn-bracket hidden md:inline-block text-xs">
            (join us)
          </a>

          <button
            className="md:hidden font-label italic text-sm border border-bone/40 px-4 py-1.5 text-bone/80"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '(close)' : '(menu)'}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-void/97 flex flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
                <a
                  key={link}
                  href={routeHref(link)}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-3xl text-bone/80 hover:text-ember-400 transition-colors"
                >
                  {renderNavLabel(link)}
                </a>
          ))}
          <a href="#give" onClick={() => setMenuOpen(false)} className="btn-bracket mt-4">
            (join us)
          </a>
        </div>
      )}
    </>
  )
}
