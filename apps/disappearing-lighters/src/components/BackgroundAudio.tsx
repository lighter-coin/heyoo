'use client'

import { useEffect, useState, useRef } from 'react'

interface BackgroundAudioProps {
  src: string
}

export const BackgroundAudio = ({ src }: BackgroundAudioProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

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

      const audio = audioRef.current

      if (audio) {
        try {
          await audio.play()
          setIsPlaying(true)
          setHasInteracted(true)
        } catch (error) {
          console.error('Context: audio play failed on global interaction', error)
        }
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
  }, [src, hasInteracted])

  useEffect(() => {
    return () => {
      const audio = audioRef.current

      if (audio) {
        audio.pause()
        audioRef.current = null
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
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
        setHasInteracted(true)
      } catch (error) {
        console.error('Context: audio manual play failed', error)
      }
    }

  }

  return (
    <button
      onClick={handleToggleMute}
      aria-label={(isPlaying) ? 'Ses Kapat' : 'Ses Aç'}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center justify-center w-14 h-14 text-black rounded-full bg-white backdrop-blur-md border border-white hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-2xl">
      {(isPlaying) ? <PauseIcon /> : <PlayIcon />}
    </button>
  )
}

const PlayIcon = () => (
  <svg
    fill="black"
    width="20"
    height="20"
    viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const PauseIcon = () => (
  <svg
    fill="black"
    width="20"
    height="20"
    viewBox="0 0 24 24">
    <rect
      x="6"
      y="4"
      width="4"
      height="16" />
    <rect
      x="14"
      y="4"
      width="4"
      height="16" />
  </svg>
)
