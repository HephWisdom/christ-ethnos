import earthVid from '../assets/earth-vid.mp4'
import { useRef } from 'react'

export default function Hero() {
  const heroRef = useRef(null)

  return (
    <section id="home" className="relative min-h-[100vh] flex flex-col overflow-hidden bg-void">

      {/* Background image + ember glow and cinematic overlay */}
      <div
        ref={heroRef}
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 110%, #c2410c 0%, #7c2d12 25%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 50% 115%, #fbbf24 0%, transparent 40%),
            #080808
          `,
        }}
      >
        <video
          ref={heroRef}
          className="absolute inset-0 h-full w-full object-cover opacity-75"
          src={earthVid}
          autoPlay
          loop
          muted
          playsInline
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 30%, rgba(8,8,8,0.93) 100%)',
          }}
        />
      </div>

      {/* Atmospheric fog layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-0 opacity-40 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 50% at 50% 100%, rgba(194,65,12,0.15) 0%, transparent 70%)
          `,
        }}
      />

        {/* Subtle cross of light in center */}
        <div className="absolute inset-0 z-0 flex items-end justify-center pb-0 pointer-events-none">
          {/* Vertical beam */}
          <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '1px',
            height: '65%',
            background: 'linear-gradient(to top, #fbbf24, #fb923c55, transparent)',
            filter: 'blur(0.5px)',
          }}
          />
          {/* Horizontal beam */}
          <div
          style={{
            position: 'absolute',
            bottom: '55%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #fbbf2488, #fbbf24, #fbbf2488, transparent)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-between min-h-[110vh] px-6 md:px-16 pt-32 pb-16">

      

        {/* Central headline */}
        <div className="max-w-4xl mx-auto text-center mt-auto mb-12">
          
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-bone animate-fade-up opacity-0-init"
            style={{ animationFillMode: 'forwards' }}
          >
            Those seeking
            <br />
            <em className="text-ember-400">grace, truth,</em>
            <br />
            and belonging
          </h1>

          <p
            className="font-body text-lg md:text-xl text-bone/50 mt-8 max-w-xl mx-auto leading-relaxed animate-fade-up opacity-0-init"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            Where ancient faith meets present-day life. A family
            rooted in love, open to all who seek.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-fade-up opacity-0-init"
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <a href="#give" className="btn-bracket-glow inline-block">(plan your visit)</a>
            <a href="#sermons" className="btn-bracket inline-block">(watch sermons)</a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="meta-label">↓ Scroll to explore</p>
          </div>
          <div className="text-right">
            <p className="meta-label">John 1:5</p>
            <p className="font-display italic text-bone/30 text-sm mt-1">
              "The light shines in the darkness"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
