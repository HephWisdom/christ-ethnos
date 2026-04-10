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
            radial-gradient(ellipse 28% 64% at 50% 0%, rgba(230, 200, 155, 0.28) 0%, rgba(188, 140, 97, 0.16) 28%, transparent 72%),
            radial-gradient(ellipse 76% 58% at 50% 115%, rgba(72, 48, 36, 0.58) 0%, transparent 64%),
            #040505
          `,
        }}
      >
        <video
          ref={heroRef}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
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
              'linear-gradient(180deg, rgba(4,5,5,0.18) 0%, rgba(4,5,5,0.5) 38%, rgba(4,5,5,0.94) 100%)',
          }}
        />
      </div>

      {/* Atmospheric fog layer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/3 z-0 opacity-40 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 110% 56% at 50% 100%, rgba(72, 48, 36, 0.55) 0%, transparent 68%)
          `,
        }}
      />

        {/* Central light beam */}
        <div className="absolute inset-0 z-0 flex items-start justify-center pointer-events-none">
          <div
            style={{
              position: 'absolute',
              top: '-6%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(140px, 18vw, 220px)',
              height: '78%',
              background:
                'linear-gradient(180deg, rgba(244,238,228,0) 0%, rgba(230,200,155,0.34) 16%, rgba(188,140,97,0.2) 62%, rgba(4,5,5,0) 100%)',
              filter: 'blur(18px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '13%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '220px',
              height: '220px',
              borderRadius: '999px',
              background: 'radial-gradient(circle, rgba(230,200,155,0.16), rgba(188,140,97,0.06) 45%, transparent 72%)',
              filter: 'blur(10px)',
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
            <em className="text-ember-300">grace, truth,</em>
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
