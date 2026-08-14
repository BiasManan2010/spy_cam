import { useThreeFingerTripleTap } from '../hooks/useThreeFingerTripleTap'

interface DisguiseOverlayProps {
  active: boolean
  mode: 'black' | 'decoy'
  decoySrc: string | null
  onDeactivate: () => void
}

export function DisguiseOverlay({
  active,
  mode,
  decoySrc,
  onDeactivate,
}: DisguiseOverlayProps) {
  const gestureHandlers = useThreeFingerTripleTap(onDeactivate, active)

  if (!active) return null

  const blockInteraction = (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-50 touch-none select-none"
      style={{
        height: '100dvh',
        width: '100vw',
        backgroundColor: mode === 'black' ? '#000000' : undefined,
        backgroundImage:
          mode === 'decoy' && decoySrc ? `url(${decoySrc})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={blockInteraction}
      onTouchStart={(e) => {
        blockInteraction(e)
        gestureHandlers.onTouchStart(e)
      }}
      onTouchEnd={(e) => {
        blockInteraction(e)
        gestureHandlers.onTouchEnd(e)
      }}
      onTouchMove={blockInteraction}
      onTouchCancel={gestureHandlers.onTouchCancel}
      onContextMenu={blockInteraction}
      role="presentation"
      aria-hidden="true"
    />
  )
}
