export const en = {
  meta: {
    title: '$LIGHTER — Story of Disappearing Lighters',
    description: 'You found this lighter. But did it find you?',
  },
  genesis: {
    stanzas: {
      auau: `**1.7 million years ago, Auau** struck two stones together and drew the first man-made spark out of the dark — and gifted warmth to humanity.`,
      fatyhu: `**Fat\u2011yhu** found a message from **a thousand years ago** — hope for the bleak, numb world of **3025** where the real and the fake could no longer be told apart — and gifted warmth back to the human heart.`,
      visitor: `And you... **you are about to write that message.**`,
    },
    altText: {
      auauArm: "Auau's arm",
      fatyhuArm: "Fat\u2011yhu's arm",
    },
  },
  audio: {
    play: 'Play sound',
    pause: 'Pause sound',
  },
  language: {
    label: 'Language',
    name: 'English',
    code: 'EN',
  },
} as const

export type Dictionary = typeof en
