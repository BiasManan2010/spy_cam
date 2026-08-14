const PATTERN = [12] as const

export function hapticPulse(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([...PATTERN])
    } catch {
      // Vibration not supported or blocked
    }
  }
}
