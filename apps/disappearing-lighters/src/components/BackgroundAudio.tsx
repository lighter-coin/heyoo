'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n/useI18n'

interface BackgroundAudioProps {
  src: string
}

const BAR_COUNT = 7
const FFT_SIZE = 64
const MIN_BAR_SCALE = 0.18
const FREQUENCY_BINS: readonly number[] = [1, 2, 4, 6, 9, 13, 20]

interface AudioGraph {
  context: AudioContext
  analyser: AnalyserNode
  source: MediaElementAudioSourceNode
}

type WebkitWindow = Window & {
  webkitAudioContext?: typeof AudioContext
}

export const BackgroundAudio = ({ src }: BackgroundAudioProps) => {
  const { dict } = useI18n()
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const graphRef = useRef<AudioGraph | null>(null)
  const rafRef = useRef<number | null>(null)
  const barRefs = useRef<Array<HTMLSpanElement | null>>([])

  const ensureAudioGraph = (): AudioGraph | null => {
    if (graphRef.current) {
      return graphRef.current
    }

    const audio = audioRef.current

    if (!audio) {
      return null
    }

    const AudioContextCtor =
      window.AudioContext ?? (window as WebkitWindow).webkitAudioContext

    if (!AudioContextCtor) {
      return null
    }

    const context = new AudioContextCtor()
    const source = context.createMediaElementSource(audio)
    const analyser = context.createAnalyser()
    analyser.fftSize = FFT_SIZE
    analyser.smoothingTimeConstant = 0.75
    source.connect(analyser)
    analyser.connect(context.destination)
    graphRef.current = { context, analyser, source }
    return graphRef.current
  }

  const startPlayback = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current

    if (!audio) {
      return false
    }

    try {
      await audio.play()
      const graph = ensureAudioGraph()

      if (graph && graph.context.state === 'suspended') {
        await graph.context.resume()
      }

      return true
    } catch (error) {
      console.error('Context: audio play failed', error)
      return false
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(src)
      audio.loop = true
      audioRef.current = audio
    }

    const handleInteraction = async () => {
      if (hasInteracted) {
        return
      }

      const started = await startPlayback()

      if (started) {
        setIsPlaying(true)
        setHasInteracted(true)
      }
    }

    if (!hasInteracted) {
      document.addEventListener('click', handleInteraction, { once: true })
      document.addEventListener('keydown', handleInteraction, { once: true })
      document.addEventListener('touchstart', handleInteraction, { once: true })
    }

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [src, hasInteracted, startPlayback])

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }

      return
    }

    const graph = ensureAudioGraph()

    if (!graph) {
      return
    }

    const buffer = new Uint8Array(graph.analyser.frequencyBinCount)

    const tick = () => {
      graph.analyser.getByteFrequencyData(buffer)

      for (let i = 0; i < BAR_COUNT; i++) {
        const bar = barRefs.current[i]
        const bin = FREQUENCY_BINS[i]

        if (!bar || bin === undefined) {
          continue
        }

        const raw = (buffer[bin] ?? 0) / 255
        const scale = MIN_BAR_SCALE + raw * (1 - MIN_BAR_SCALE)
        bar.style.transform = `scaleY(${scale.toFixed(3)})`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      const audio = audioRef.current

      if (audio) {
        audio.pause()
        audioRef.current = null
      }

      const graph = graphRef.current

      if (graph) {
        graph.source.disconnect()
        graph.analyser.disconnect()
        void graph.context.close()
        graphRef.current = null
      }
    }
  }, [])

  const handleToggleMute = async (e: React.MouseEvent) => {
    e.stopPropagation()

    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    const started = await startPlayback()

    if (started) {
      setIsPlaying(true)
      setHasInteracted(true)
    }
  }

  return (
    <button
      onClick={handleToggleMute}
      aria-label={isPlaying ? dict.audio.pause : dict.audio.play}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white bg-white text-black shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:h-12 sm:w-12 md:h-13 md:w-13">
      {isPlaying ? <Equalizer barRefs={barRefs} /> : <PlayIcon />}
    </button>
  )
}

interface EqualizerProps {
  barRefs: React.RefObject<Array<HTMLSpanElement | null>>
}

const Equalizer = ({ barRefs }: EqualizerProps) => (
  <span
    aria-hidden="true"
    className="flex h-4 items-end gap-0.5 sm:h-5">
    {Array.from({ length: BAR_COUNT }, (_, i) => (
      <span
        key={`bar-${i}`}
        ref={(el) => {
          barRefs.current[i] = el
        }}
        className="h-full w-1 origin-bottom rounded-sm bg-blue-600 transition-transform duration-75 ease-out motion-reduce:transform-none" />
    ))}
  </span>
)

const PlayIcon = () => (
  <svg
    fill="black"
    width="20"
    height="20"
    viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)
