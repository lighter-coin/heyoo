import styles from '@/components/LighterSpark.module.css'

import type { CSSProperties } from 'react'

interface LighterSparkProps {
  /** Seconds to wait before the sun-expansion animation starts. */
  expandDelaySec: number
  /** Sun-expansion animation duration in seconds. */
  expandDurationSec: number
}

interface SparkCSSProperties extends CSSProperties {
  '--spark-expand-delay': string
  '--spark-expand-duration': string
}

export const LighterSpark = ({ expandDelaySec, expandDurationSec }: LighterSparkProps) => {
  const cssVars: SparkCSSProperties = {
    '--spark-expand-delay': `${expandDelaySec}s`,
    '--spark-expand-duration': `${expandDurationSec}s`,
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div
        style={cssVars}
        className={styles.fireballSpark} />
    </div>
  )
}
