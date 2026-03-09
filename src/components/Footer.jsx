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
              radial-gradient(ellipse 80% 60% at 50% 110%, #c2410c 0%, #7c2d12 30%, transparent 60%),
              radial-gradient(ellipse 40% 30% at 50% 120%, #fbbf24 0%, transparent 50%)
            `,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.72),rgba(8,8,8,0.45),rgba(8,8,8,0.78))] pointer-events-none" />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-2/3 pointer-events-none animate-flicker"
          style={{ background: 'linear-gradient(to top, #fb923c, transparent)' }}
        />

        <div className="relative z-10 px-6">
          <p className="meta-label mb-6">Come as you are</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-bone leading-tight mb-10">
            Your seat is
            <br />
            <em className="text-ember-400">already waiting</em>
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
          <span className="font-label tracking-[0.3em] text-xs text-bone/30 uppercase">Christ Enthos</span>
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
