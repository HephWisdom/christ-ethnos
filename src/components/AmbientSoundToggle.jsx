import { useEffect, useRef, useState } from 'react'

export default function AmbientSoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef({
    context: null,
    oscillator: null,
    gain: null,
    timeout: null,
  })

  const stopAmbient = () => {
    const state = audioRef.current
    if (state.gain) {
      const endAt = state.context?.currentTime || 0
      state.gain.gain.cancelScheduledValues(endAt)
      state.gain.gain.setTargetAtTime(0, endAt, 0.2)
      setTimeout(() => {
        state.oscillator?.stop()
        state.oscillator = null
        state.gain = null
      }, 300)
    }
  }

  const startAmbient = async () => {
    let { context, oscillator, gain } = audioRef.current
    if (!context) {
      context = new AudioContext()
      audioRef.current.context = context
    }

    if (context.state === 'suspended') {
      await context.resume()
    }

    if (!gain) {
      gain = context.createGain()
      gain.connect(context.destination)
      gain.gain.value = 0
      audioRef.current.gain = gain

      oscillator = context.createOscillator()
      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(45, context.currentTime)
      oscillator.connect(gain)
      oscillator.start()
      audioRef.current.oscillator = oscillator
    }

    gain.gain.cancelScheduledValues(context.currentTime)
    gain.gain.setTargetAtTime(0.018, context.currentTime, 1.6)
  }

  const handleToggle = async () => {
    const next = !isPlaying
    if (next) {
      await startAmbient()
    } else {
      stopAmbient()
    }
    setIsPlaying(next)
  }

  useEffect(() => {
    return () => {
      stopAmbient()
      if (audioRef.current.context) {
        audioRef.current.context.close()
      }
    }
  }, [])

  return (
    <button
      onClick={handleToggle}
      className="fixed right-4 bottom-4 z-50 btn-bracket-glow text-xs"
      aria-label="toggle ambient sound"
    >
      {isPlaying ? '(♪ ambience off)' : '(♪ ambience on)'}
    </button>
  )
}
