import { useCallback, useRef } from 'react'

const REQUIRED_FINGERS = 3
const REQUIRED_TAPS = 3
const TAP_WINDOW_MS = 900
const MAX_TAP_DURATION_MS = 350

interface TouchPoint {
  startTime: number
  fingerCount: number
}

/**
 * Detects a three-finger triple-tap gesture anywhere on the screen.
 * Each tap requires exactly 3 simultaneous fingers touching and releasing.
 */
export function useThreeFingerTripleTap(onTrigger: () => void, enabled: boolean) {
  const tapCountRef = useRef(0)
  const lastTapEndRef = useRef(0)
  const activeTouchRef = useRef<TouchPoint | null>(null)
  const maxFingersRef = useRef(0)

  const reset = useCallback(() => {
    tapCountRef.current = 0
    lastTapEndRef.current = 0
    activeTouchRef.current = null
    maxFingersRef.current = 0
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return

      maxFingersRef.current = Math.max(maxFingersRef.current, e.touches.length)

      if (e.touches.length === REQUIRED_FINGERS && !activeTouchRef.current) {
        activeTouchRef.current = {
          startTime: Date.now(),
          fingerCount: e.touches.length,
        }
      }
    },
    [enabled],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return

      if (e.touches.length > 0) return

      const touch = activeTouchRef.current
      const peakFingers = maxFingersRef.current
      activeTouchRef.current = null
      maxFingersRef.current = 0

      if (!touch || peakFingers !== REQUIRED_FINGERS) {
        return
      }

      const duration = Date.now() - touch.startTime
      if (duration > MAX_TAP_DURATION_MS) {
        reset()
        return
      }

      const now = Date.now()
      if (now - lastTapEndRef.current > TAP_WINDOW_MS) {
        tapCountRef.current = 0
      }

      tapCountRef.current += 1
      lastTapEndRef.current = now

      if (tapCountRef.current >= REQUIRED_TAPS) {
        reset()
        onTrigger()
      }
    },
    [enabled, onTrigger, reset],
  )

  const handleTouchCancel = useCallback(() => {
    activeTouchRef.current = null
    maxFingersRef.current = 0
  }, [])

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  }
}
