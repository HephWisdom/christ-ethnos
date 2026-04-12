import scriptureImage from '../assets/scripture-image.png'
import { getWhatsAppHref, isWhatsAppConfigured } from '../lib/whatsapp.js'

const whatsappHref = getWhatsAppHref()
const whatsappReady = isWhatsAppConfigured()

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
  return (
    <footer className="relative bg-void overflow-hidden">
      <div className="relative py-32 md:py-48 text-center overflow-hidden">
        <img
          src={scriptureImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25 pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 84% 60% at 50% 112%, rgba(72, 48, 36, 0.72) 0%, transparent 58%),
              radial-gradient(ellipse 34% 44% at 50% 8%, rgba(230, 200, 155, 0.2) 0%, rgba(162, 114, 76, 0.1) 44%, transparent 72%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,5,0.76),rgba(4,5,5,0.5),rgba(4,5,5,0.82))] pointer-events-none" />
        <div className="relative z-10 px-6">
          <p className="meta-label mb-6">Come as you are</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-bone leading-tight mb-10">
            Your seat is
            <br />
            <em className="text-ember-300">already waiting</em>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#connect" className="btn-bracket-glow text-base px-8 py-3 inline-block">
              (plan your visit)
            </a>
            <a href="#prayer" className="btn-bracket text-base px-8 py-3 inline-block">
              (share a prayer request)
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-bone/8 py-8 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-between gap-5 md:flex-row md:gap-8">
          <span className="text-center font-label tracking-[0.3em] text-xs text-bone/30 uppercase md:text-left">
            Christ Ēthnos
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href || undefined}
                aria-label={link.comingSoon ? `${link.name} coming soon` : link.name}
                title={link.comingSoon ? `${link.name} coming soon` : link.name}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                aria-disabled={link.comingSoon ? 'true' : undefined}
                className={`group flex h-10 w-10 items-center justify-center rounded-full border border-bone/12 bg-bone/[0.03] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(255,255,255,0.08)] sm:h-11 sm:w-11 ${link.accentClass}`}
              >
                {link.icon}
                <span className="sr-only">{link.comingSoon ? `${link.name} coming soon` : link.name}</span>
              </a>
            ))}
          </div>
          <span className="text-center font-body text-xs text-bone/20 italic md:text-right">
            {new Date().getFullYear()} · All are welcome
          </span>
        </div>
      </div>
    </footer>
  )
}
