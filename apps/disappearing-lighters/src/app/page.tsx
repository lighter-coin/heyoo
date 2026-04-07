import { LighterSpark } from '../components/LighterSpark'
import { TargetedArm } from '../components/TargetedArm'

/*
  Entry choreography:
    t=0.00s → star ignites and grows (LighterSpark, 5s reveal)
    t=0.40s → Auau's arm slides in linearly from bottom-left (2.24s)
    t=2.64s → Auau's slide finishes
    t=3.64s → Fat-yhu's arm slides in from top-right (2.24s),
              exactly 1s after Auau's slide finished
    t=5.00s → star reveal completes, breath loop takes over
    t=5.88s → Fat-yhu's slide finishes
*/
const AUAU_ENTRY_DELAY_SEC = 0.4
const AUAU_ENTRY_DURATION_SEC = 2.24
const FAYTHU_ENTRY_DELAY_SEC = AUAU_ENTRY_DELAY_SEC + AUAU_ENTRY_DURATION_SEC + 1
const FAYTHU_ENTRY_DURATION_SEC = 2.24

export default function Home() {
  return (
    <main className="relative w-full h-dvh overflow-hidden bg-black">

      {/* Auau's arm — bottom-left */}
      <TargetedArm
        src="/auau-arm.png"
        alt="Auau's arm"
        corner="bottom-left"
        entryEasing="linear"
        entryDelaySec={AUAU_ENTRY_DELAY_SEC}
        entryDurationSec={AUAU_ENTRY_DURATION_SEC}
        filterDropShadow="drop-shadow(0 0 30px rgba(255,140,0,0.3))" />

      <LighterSpark />

      {/* Fat-yhu's arm — top-right */}
      <TargetedArm
        src="/faythu-arm.png"
        alt="Fat-yhu's arm"
        corner="top-right"
        entryEasing="linear"
        entryDelaySec={FAYTHU_ENTRY_DELAY_SEC}
        entryDurationSec={FAYTHU_ENTRY_DURATION_SEC}
        filterDropShadow="drop-shadow(0 0 30px rgba(100,150,255,0.3))" />
    </main>
  )
}
