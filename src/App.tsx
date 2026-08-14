import { useCallback, useEffect, useState } from 'react'
import { CameraEngine } from './components/CameraEngine'
import { DisguiseOverlay } from './components/DisguiseOverlay'
import { Gallery } from './components/Gallery'
import { SetupUI } from './components/SetupUI'
import { getDecoyImageSrc } from './constants/decoys'
import { useCamera } from './hooks/useCamera'
import { useFullscreen } from './hooks/useFullscreen'
import { useMediaRecorder } from './hooks/useMediaRecorder'
import { useWakeLock } from './hooks/useWakeLock'
import {
  createVideoThumbnail,
  saveMediaItem,
} from './store/mediaStore'
import type { CaptureMode, DecoyPreset, DisguiseType } from './types'
import { hapticPulse } from './utils/haptics'
import { capturePhotoFromVideo, dataUrlToBlob } from './utils/photoCapture'

function App() {
  const [disguiseActive, setDisguiseActive] = useState(false)
  const [disguiseType, setDisguiseType] = useState<DisguiseType>('black')
  const [decoyPreset, setDecoyPreset] = useState<DecoyPreset>('ios-home')
  const [customDecoyUrl, setCustomDecoyUrl] = useState<string | null>(null)
  const [captureMode, setCaptureMode] = useState<CaptureMode>('photo')
  const [micMuted, setMicMuted] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryRefresh, setGalleryRefresh] = useState(0)

  const { stream, videoRef, error, isReady, startCamera } = useCamera(micMuted)
  const {
    isRecording,
    duration,
    mimeType,
    startRecording,
    stopRecording,
    getExtension,
  } = useMediaRecorder(stream)

  const { enterFullscreen, exitFullscreen } = useFullscreen()
  useWakeLock(isRecording || disguiseActive)

  const decoySrc = getDecoyImageSrc(decoyPreset, customDecoyUrl)

  const activateDisguise = useCallback(async () => {
    if (!isReady) return
    await enterFullscreen()
    setDisguiseActive(true)
    hapticPulse()
  }, [enterFullscreen, isReady])

  const deactivateDisguise = useCallback(async () => {
    setDisguiseActive(false)
    await exitFullscreen()
    hapticPulse()
  }, [exitFullscreen])

  const handleCustomImageUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    setCustomDecoyUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    setDecoyPreset('custom')
  }, [])

  const savePhoto = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    const dataUrl = capturePhotoFromVideo(video)
    if (!dataUrl) return

    const blob = dataUrlToBlob(dataUrl)
    const id = crypto.randomUUID()
    const filename = `stealthcam-${Date.now()}.jpg`

    await saveMediaItem({
      id,
      type: 'photo',
      blob,
      thumbnail: dataUrl,
      createdAt: Date.now(),
      mimeType: 'image/jpeg',
      filename,
    })
    setGalleryRefresh((k) => k + 1)
  }, [videoRef])

  const handleCapture = useCallback(() => {
    void savePhoto()
  }, [savePhoto])

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      const blob = await stopRecording()
      if (!blob) return

      const id = crypto.randomUUID()
      const ext = getExtension()
      const filename = `stealthcam-${Date.now()}.${ext}`

      try {
        const thumbnail = await createVideoThumbnail(blob)
        await saveMediaItem({
          id,
          type: 'video',
          blob,
          thumbnail,
          createdAt: Date.now(),
          mimeType,
          filename,
        })
        setGalleryRefresh((k) => k + 1)
      } catch {
        // Save without thumbnail fallback
        await saveMediaItem({
          id,
          type: 'video',
          blob,
          thumbnail: '',
          createdAt: Date.now(),
          mimeType,
          filename,
        })
        setGalleryRefresh((k) => k + 1)
      }
    } else {
      startRecording()
    }
  }, [isRecording, stopRecording, startRecording, getExtension, mimeType])

  useEffect(() => {
    return () => {
      if (customDecoyUrl) URL.revokeObjectURL(customDecoyUrl)
    }
  }, [customDecoyUrl])

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <CameraEngine videoRef={videoRef} visible={!disguiseActive} />

      {!disguiseActive && (
        <SetupUI
          disguiseType={disguiseType}
          decoyPreset={decoyPreset}
          customDecoyUrl={customDecoyUrl}
          captureMode={captureMode}
          micMuted={micMuted}
          cameraReady={isReady}
          cameraError={error}
          isRecording={isRecording}
          recordDuration={duration}
          onDisguiseTypeChange={setDisguiseType}
          onDecoyPresetChange={setDecoyPreset}
          onCustomImageUpload={handleCustomImageUpload}
          onCaptureModeChange={setCaptureMode}
          onMicMutedChange={setMicMuted}
          onStartCamera={startCamera}
          onCapture={handleCapture}
          onToggleRecording={() => void handleToggleRecording()}
          onActivateDisguise={() => void activateDisguise()}
          onOpenGallery={() => setGalleryOpen(true)}
        />
      )}

      <DisguiseOverlay
        active={disguiseActive}
        mode={disguiseType === 'black' ? 'black' : 'decoy'}
        decoySrc={decoySrc}
        onDeactivate={() => void deactivateDisguise()}
      />

      <Gallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        refreshKey={galleryRefresh}
      />
    </div>
  )
}

export default App
