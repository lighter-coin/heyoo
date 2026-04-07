'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import styles from './TargetedArm.module.css'

interface TargetedArmProps {
  src: string
  alt: string
  corner: 'bottom-left' | 'top-right'
  filterDropShadow: string
  /** Seconds to wait before the slide-in animation starts. */
  entryDelaySec: number
  /** Slide-in duration in seconds. */
  entryDurationSec: number
  /** CSS easing function for the slide-in. Defaults to linear. */
  entryEasing?: string
}

/**
 * Central reserved area for the future card, expressed as a fraction of the
 * viewport. The arm tip is guaranteed to stay outside the bounding circle of
 * a (RESERVED_RATIO × W) by (RESERVED_RATIO × H) box centered on screen.
 */
const RESERVED_RATIO = 0.3

/** Visual lower/upper bounds so the arm never becomes unreadable or absurd. */
const MIN_ARM_LENGTH = 140
const MAX_ARM_LENGTH = 560

/**
 * Source PNGs are square (1280x1280) with the arm running corner-to-corner.
 * Once the div is rotated around the anchor corner, the visible hand sits at
 * the diagonally opposite corner — i.e. at distance `width × √2` from the
 * pivot, NOT just `width`. Divide by √2 to convert "max hand distance from
 * corner" into "max div width".
 */
const ARM_DIAGONAL_FACTOR = Math.SQRT2

export const TargetedArm = ({
  src,
  alt,
  corner,
  filterDropShadow,
  entryDelaySec,
  entryDurationSec,
  entryEasing = 'linear',
}: TargetedArmProps) => {
  const isBottomLeft = corner === 'bottom-left'
  const [angle, setAngle] = useState(0)
  const [armLength, setArmLength] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const recalculate = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      const targetX = w / 2
      const targetY = h / 2
      const originX = isBottomLeft ? 0 : w
      const originY = isBottomLeft ? h : 0

      const dx = targetX - originX
      const dy = targetY - originY

      const angleToCenter = Math.atan2(dy, dx) * (180 / Math.PI)
      const baseAngle = isBottomLeft ? -45 : 135
      setAngle(angleToCenter - baseAngle)

      const diagonal = Math.hypot(w, h)
      const cornerToCenter = diagonal / 2
      const safeRadius = (RESERVED_RATIO / 2) * diagonal
      const maxHandDistance = cornerToCenter - safeRadius
      const rawWidth = maxHandDistance / ARM_DIAGONAL_FACTOR
      const clamped = Math.max(MIN_ARM_LENGTH, Math.min(rawWidth, MAX_ARM_LENGTH))
      setArmLength(clamped)
    }

    recalculate()
    window.addEventListener('resize', recalculate)

    return () => {
      window.removeEventListener('resize', recalculate)
    }
  }, [isBottomLeft])

  const slideInClass = isBottomLeft
    ? styles.slideWrapperBottomLeft
    : styles.slideWrapperTopRight
  const slideOutClass = isBottomLeft
    ? styles.slideOutBottomLeft
    : styles.slideOutTopRight
  const activeSlideClass = isExiting ? slideOutClass : slideInClass

  return (
    <div
      className={`absolute z-10 cursor-pointer ${activeSlideClass}`}
      onClick={() => setIsExiting(true)}
      style={{
        bottom: isBottomLeft ? '0' : 'auto',
        left: isBottomLeft ? '0' : 'auto',
        top: !isBottomLeft ? '0' : 'auto',
        right: !isBottomLeft ? '0' : 'auto',
        width: `${armLength}px`,
        animationDuration: `${entryDurationSec}s`,
        animationDelay: isExiting ? '0s' : `${entryDelaySec}s`,
        animationTimingFunction: entryEasing,
      }}>
      <div
        style={{
          width: '100%',
          transformOrigin: isBottomLeft ? 'bottom left' : 'top right',
          transform: `rotate(${angle}deg)`,
        }}>
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="w-full h-auto"
          style={{ filter: filterDropShadow }} />
      </div>
    </div>
  )
}
