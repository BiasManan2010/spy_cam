import { useCallback, useEffect, useRef, useState } from 'react'

export interface CameraState {
  stream: MediaStream | null
  videoRef: React.RefObject<HTMLVideoElement | null>
  error: string | null
  isReady: boolean
}

export function useCamera(micMuted: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  const startCamera = useCallback(async () => {
    setError(null)
    setIsReady(false)

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: true,
      })

      streamRef.current = mediaStream
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.muted = true
        await videoRef.current.play()
        setIsReady(true)
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Camera access denied'
      setError(message)
      setIsReady(false)
    }
  }, [])

  useEffect(() => {
    if (!streamRef.current) return

    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !micMuted
    })
  }, [micMuted])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return {
    stream,
    videoRef,
    error,
    isReady,
    startCamera,
  }
}
