import { useState } from 'react'
import logo from '../assets/logo-nav.webp'

const navLinks = ['About', 'Sermons', 'Events', 'Give', 'FAQ']

function routeHref(label) {
  if (label === 'About') return '#about'
  if (label === 'FAQ') return '#faq'
  return `#${label.toLowerCase()}`
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const renderNavLabel = (label) => (
    <>
      <span className="font-semibold">{label.charAt(0)}</span>
      <span>{label.slice(1)}</span>
    </>
  )

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-void/35 backdrop-blur-md border-b border-bone/15"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <a
            href="#home"
            className="flex flex-col items-center gap-1 transition-opacity hover:opacity-85"
            aria-label="Christ Ethnos Global Ministries home"
          >
            <img
              src={logo}
              alt="Christ Ethnos Global Ministries"
              className="h-10 w-auto shrink-0 md:h-12"
            />
            <span className="font-label tracking-[0.18em] text-[10px] uppercase leading-none text-bone/90 md:text-xs">
              Christ Ēthnos
            </span>
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

          <a href="#connect" className="btn-bracket hidden md:inline-block text-xs">
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
        <div className="fixed inset-0 z-40 bg-void/55 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
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
          <a href="#connect" onClick={() => setMenuOpen(false)} className="btn-bracket mt-4">
            (join us)
          </a>
        </div>
      )}
    </>
  )
}
