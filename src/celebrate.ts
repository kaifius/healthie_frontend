import confetti from 'canvas-confetti'

/** Fired when a card reaches Done. */
export function celebrate() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.7 },
    disableForReducedMotion: true,
  })
}
