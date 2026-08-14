import { useCallback, useEffect, useRef } from 'react'

export function useWakeLock(active: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return

    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen')
      wakeLockRef.current.addEventListener('release', () => {
        wakeLockRef.current = null
      })
    } catch {
      // Wake lock denied or unavailable
    }
  }, [])

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release()
      } catch {
        // Already released
      }
      wakeLockRef.current = null
    }
  }, [])

  useEffect(() => {
    if (active) {
      void requestWakeLock()
    } else {
      void releaseWakeLock()
    }

    return () => {
      void releaseWakeLock()
    }
  }, [active, requestWakeLock, releaseWakeLock])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && active) {
        void requestWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [active, requestWakeLock])
}
