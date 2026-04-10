import scriptureImage from '../assets/scripture-image.png'

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
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-2/3 pointer-events-none animate-flicker"
          style={{ background: 'linear-gradient(to top, rgba(230, 200, 155, 0.95), transparent)' }}
        />

        <div className="relative z-10 px-6">
          <p className="meta-label mb-6">Come as you are</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-bone leading-tight mb-10">
            Your seat is
            <br />
            <em className="text-ember-300">already waiting</em>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#give" className="btn-bracket-glow text-base px-8 py-3 inline-block">
              (plan your visit)
            </a>
            <a href="#sermons" className="btn-bracket text-base px-8 py-3 inline-block">
              (watch sermons)
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-bone/8 py-8 px-6 md:px-16">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-label tracking-[0.3em] text-xs text-bone/30 uppercase">Christ Ēthnos</span>
          <div className="flex items-center gap-8">
            {['Instagram', 'YouTube', 'Podcast', 'Newsletter'].map((link) => (
              <a key={link} href="#" className="meta-label hover:text-bone/70 transition-colors">
                {link}
              </a>
            ))}
          </div>
          <span className="font-body text-xs text-bone/20 italic">{new Date().getFullYear()} · All are welcome</span>
        </div>
      </div>
    </footer>
  )
}
