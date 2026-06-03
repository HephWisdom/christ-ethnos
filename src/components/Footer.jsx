import scriptureImage from '../assets/scripture-image.png'
import logo from '../assets/logo-2.webp'
import { getOnlineServiceConfig } from '../lib/onlineService.js'
import { getWhatsAppHref, isWhatsAppConfigured } from '../lib/whatsapp.js'

const whatsappHref = getWhatsAppHref()
const whatsappReady = isWhatsAppConfigured()
const onlineService = getOnlineServiceConfig()

const footerSections = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Sermons', href: '#sermons' },
      { label: 'Events', href: '#events' },
    ],
  },
  {
    title: 'Next Steps',
    links: [
      { label: 'Plan a visit', href: '#connect' },
      { label: 'Prayer request', href: '#prayer' },
      { label: 'Daily word', href: '#daily-word' },
      { label: 'Give', href: '#give' },
    ],
  },
]

const contactItems = [
  { label: 'Online service', value: onlineService.serviceTime },
  { label: 'Platform', value: onlineService.platform },
  { label: 'Follow-up', value: whatsappReady ? 'WhatsApp and contact form' : 'Contact form' },
]

const socialLinks = [
  {
    name: 'WhatsApp',
    href: whatsappHref || '#connect',
    accentClass: whatsappReady
      ? 'hover:border-[#25d366]/70 hover:bg-[#25d366]/10'
      : 'opacity-55',
    external: Boolean(whatsappHref),
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]">
        <path
          d="M12 3.5a8.45 8.45 0 0 0-7.34 12.63L3.5 20.5l4.5-1.14A8.5 8.5 0 1 0 12 3.5Zm0 15.25a6.7 6.7 0 0 1-3.42-.94l-.24-.14-2.67.67.71-2.6-.16-.27A6.75 6.75 0 1 1 12 18.75Zm3.7-4.98c-.2-.1-1.16-.57-1.34-.63-.18-.07-.32-.1-.45.1-.14.2-.52.63-.64.76-.12.13-.24.15-.45.05-.2-.1-.86-.31-1.63-.98-.6-.54-1-1.2-1.12-1.4-.12-.2-.01-.31.09-.4.09-.09.2-.24.3-.36.1-.12.14-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.32-.34-.45-.34h-.38c-.13 0-.35.05-.53.25-.18.2-.7.69-.7 1.69s.72 1.97.82 2.1c.1.13 1.42 2.17 3.44 3.04 2.03.87 2.03.58 2.4.54.37-.04 1.16-.47 1.33-.92.17-.45.17-.84.12-.92-.04-.08-.18-.12-.38-.22Z"
          fill="#25d366"
        />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/christethnos?igsh=MXJqOXU5Ym41bGJrOA==',
    accentClass: 'hover:border-[#ee2a7b]/70 hover:bg-[#ee2a7b]/10',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]">
        <defs>
          <linearGradient id="instagramGradient" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f9ce34" />
            <stop offset="38%" stopColor="#ee2a7b" />
            <stop offset="72%" stopColor="#6228d7" />
            <stop offset="100%" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="url(#instagramGradient)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="url(#instagramGradient)" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="#f9ce34" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: null,
    accentClass: 'cursor-not-allowed opacity-55',
    comingSoon: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]">
        <path
          d="M21 12.2c0 2.3-.3 4-.6 5-.2.9-.9 1.6-1.8 1.8-1 .3-3.4.6-6.6.6s-5.6-.3-6.6-.6c-.9-.2-1.6-.9-1.8-1.8-.3-1-.6-2.7-.6-5s.3-4 .6-5c.2-.9.9-1.6 1.8-1.8 1-.3 3.4-.6 6.6-.6s5.6.3 6.6.6c.9.2 1.6.9 1.8 1.8.3 1 .6 2.7.6 5Z"
          fill="#ff0033"
        />
        <path d="m10 9 5 3-5 3V9Z" fill="#ffffff" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/18V6txSf7N/',
    accentClass: 'hover:border-[#1877f2]/70 hover:bg-[#1877f2]/10',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]">
        <circle cx="12" cy="12" r="9" fill="#1877f2" />
        <path
          d="M13.6 19v-5.6h1.9l.3-2.2h-2.2V9.8c0-.7.2-1.2 1.2-1.2H16V6.7c-.2 0-.9-.1-1.7-.1-1.7 0-2.8 1-2.8 3v1.6H9.8v2.2h1.7V19h2.1Z"
          fill="#ffffff"
        />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@christethnos?_r=1&_t=ZS-950vh6nEkc4',
    accentClass: 'hover:border-[#25f4ee]/70 hover:bg-[#25f4ee]/10',
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]">
        <path
          d="M14.5 5c.7 1.3 1.8 2.2 3.5 2.5v2.2a6.4 6.4 0 0 1-3.5-1v4.9a4.5 4.5 0 1 1-4.5-4.5c.3 0 .6 0 .9.1v2.2a2.5 2.5 0 1 0 1.6 2.3V5h2Z"
          fill="#25f4ee"
          transform="translate(-0.45 0.3)"
        />
        <path
          d="M14.5 5c.7 1.3 1.8 2.2 3.5 2.5v2.2a6.4 6.4 0 0 1-3.5-1v4.9a4.5 4.5 0 1 1-4.5-4.5c.3 0 .6 0 .9.1v2.2a2.5 2.5 0 1 0 1.6 2.3V5h2Z"
          fill="#fe2c55"
          transform="translate(0.45 -0.3)"
        />
        <path
          d="M14.5 5c.7 1.3 1.8 2.2 3.5 2.5v2.2a6.4 6.4 0 0 1-3.5-1v4.9a4.5 4.5 0 1 1-4.5-4.5c.3 0 .6 0 .9.1v2.2a2.5 2.5 0 1 0 1.6 2.3V5h2Z"
          fill="#ffffff"
        />
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-bone/8 bg-void">
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={scriptureImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.08]"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 74% 52% at 50% 0%, rgba(188, 140, 97, 0.16) 0%, transparent 60%),
              linear-gradient(180deg, rgba(4,5,5,0.88), #040505 42%, #040505 100%)
            `,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-16 md:py-20">
        <div className="grid gap-12 border-b border-bone/10 pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="meta-label">Christ Ethnos Global Ministries</p>
            <h2 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-bone md:text-6xl">
              A family of faith,
              <br className="hidden sm:block" />
              <em className="text-ember-300"> open to every nation.</em>
            </h2>
          </div>

          <div className="flex flex-col gap-5 lg:items-end lg:text-right">
            <p className="max-w-lg font-body text-base leading-relaxed text-bone/48">
              Join the online fellowship, ask for prayer, or connect with the welcome team.
              There is a place for you here.
            </p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a href="#connect" className="btn-bracket-glow">
                (connect with us)
              </a>
              <a href="#give" className="btn-bracket">
                (give)
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_0.7fr_1fr]">
          <div className="max-w-sm">
            <a
              href="#home"
              className="inline-flex items-center gap-4 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300/70"
              aria-label="Christ Ethnos Global Ministries home"
            >
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                className="h-14 w-auto"
              />
              <span className="font-label text-sm uppercase tracking-[0.24em] text-bone">
                Christ Ēthnos
              </span>
            </a>
            <p className="mt-6 font-body text-base leading-relaxed text-bone/45">
              More than a church, Christ Ēthnos is a family gathered around worship,
              prayer, Scripture, and graceful community.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {socialLinks.map((link) => {
                const label = link.comingSoon ? `${link.name} coming soon` : link.name
                const className = `group flex h-10 w-10 items-center justify-center rounded-full border border-bone/12 bg-bone/[0.035] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300/70 sm:h-11 sm:w-11 ${link.accentClass}`

                if (link.comingSoon) {
                  return (
                    <span
                      key={link.name}
                      aria-label={label}
                      title={label}
                      aria-disabled="true"
                      className={className}
                    >
                      {link.icon}
                      <span className="sr-only">{label}</span>
                    </span>
                  )
                }

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    aria-label={label}
                    title={label}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noreferrer' : undefined}
                    className={className}
                  >
                    {link.icon}
                    <span className="sr-only">{label}</span>
                  </a>
                )
              })}
            </div>
          </div>

          {footerSections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3 className="meta-label text-bone/55">{section.title}</h3>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="font-body text-base text-bone/48 transition-colors hover:text-ember-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-300/70"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="meta-label text-bone/55">Visit & Contact</h3>
            <dl className="mt-5 space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="border-b border-bone/8 pb-4 last:border-b-0 last:pb-0">
                  <dt className="font-label text-xs uppercase tracking-[0.22em] text-bone/28">{item.label}</dt>
                  <dd className="mt-1 font-body text-base leading-relaxed text-bone/52">{item.value}</dd>
                </div>
              ))}
            </dl>
            <a href="#connect" className="mt-6 inline-block font-label text-xs uppercase tracking-[0.22em] text-ember-200 transition-colors hover:text-bone">
              Send a message
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-bone/10 pt-7 text-bone/28 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-sm">
            © {year} Christ Ethnos Global Ministries. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-label text-xs uppercase tracking-[0.2em]">
            <a href="#home" className="transition-colors hover:text-bone">Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
