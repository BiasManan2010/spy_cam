import { useEffect } from 'react'

interface CameraEngineProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  visible: boolean
}

export function CameraEngine({ videoRef, visible }: CameraEngineProps) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
  }, [videoRef])

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="pointer-events-none fixed inset-0 h-full w-full object-cover"
      style={{
        opacity: visible ? 1 : 0,
        zIndex: visible ? 1 : 0,
      }}
      aria-hidden="true"
    />
  )
}
