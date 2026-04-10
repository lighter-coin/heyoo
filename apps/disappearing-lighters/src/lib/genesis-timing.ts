/*
  Single source of truth for the Genesis choreography timeline.
  All values in seconds. Both Genesis (parent orchestrator) and StoryCard
  (child) read from here so the numbers are never duplicated.
*/

// Phase 1 — existing arm + spark intro (preserve current values exactly)
export const AUAU_ENTRY_DELAY_SEC = 0.4
export const AUAU_ENTRY_DURATION_SEC = 2.24
export const FATYHU_ENTRY_DELAY_SEC =
  AUAU_ENTRY_DELAY_SEC + AUAU_ENTRY_DURATION_SEC + 1 // 3.64
export const FATYHU_ENTRY_DURATION_SEC = 2.24
export const PHASE_1_END_SEC = 5.88

// Phase 2 — sun expansion → card emergence → stanza stagger
export const HOLD_BEAT_SEC = 0.62
export const SUN_EXPAND_START_SEC = PHASE_1_END_SEC + HOLD_BEAT_SEC // 6.50
export const SUN_EXPAND_DURATION_SEC = 2.0 // ends at 8.50
export const STANZA_1_DELAY_SEC = 8.2 // Auau line — bottom of card
export const STANZA_2_DELAY_SEC = 9.0 // Fat-yhu line — top of card
export const STANZA_3_DELAY_SEC = 9.8 // Visitor line — center
export const STANZA_FADE_DURATION_SEC = 0.8

// Arm spotlight pulse — fires the moment the arm's own stanza fades in,
// scales the arm 1 -> 1.2 -> 1 over ~0.8s for a soft "look at me" beat.
export const ARM_PULSE_DURATION_SEC = 0.9
export const ARM_PULSE_SCALE = 1.2
