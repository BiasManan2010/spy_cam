import { useCallback } from 'react'

export function useFullscreen() {
  const enterFullscreen = useCallback(async () => {
    const el = document.documentElement

    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen()
      } else if ('webkitRequestFullscreen' in el) {
        await (
          el as HTMLElement & {
            webkitRequestFullscreen: () => Promise<void>
          }
        ).webkitRequestFullscreen()
      }
    } catch {
      // Fullscreen not available
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else if ('webkitExitFullscreen' in document) {
        await (
          document as Document & {
            webkitExitFullscreen: () => Promise<void>
          }
        ).webkitExitFullscreen()
      }
    } catch {
      // Already exited
    }
  }, [])

  return { enterFullscreen, exitFullscreen }
}
