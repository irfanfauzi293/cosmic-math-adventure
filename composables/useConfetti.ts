import confetti from 'canvas-confetti'

export const useConfetti = () => {
  const fireConfetti = () => {
    // Single, gentle burst that looks more magical and less aggressive
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.4 },
      gravity: 0.6, // Slower fall rate
      scalar: 1.2, // Slightly larger particles
      ticks: 300, // Lasts longer on screen
      colors: ['#FFC107', '#4CAF50', '#03A9F4', '#E91E63', '#9C27B0', '#FFFFFF'], // Colorful and soft
      disableForReducedMotion: true
    })
  }

  const stopConfetti = () => {
    confetti.reset()
  }

  return {
    fireConfetti,
    stopConfetti
  }
}
