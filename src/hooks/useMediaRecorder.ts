import { useCallback, useRef, useState } from 'react'
import { extensionForMime, getSupportedMimeType } from '../utils/recorder'

export interface RecorderState {
  isRecording: boolean
  duration: number
  mimeType: string
}

export function useMediaRecorder(stream: MediaStream | null) {
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const mimeType = getSupportedMimeType()

  const startRecording = useCallback(() => {
    if (!stream || isRecording) return null

    try {
      chunksRef.current = []
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2_500_000,
      })

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.start(1000)
      recorderRef.current = recorder
      startTimeRef.current = Date.now()
      setIsRecording(true)

      timerRef.current = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 500)

      return recorder
    } catch {
      return null
    }
  }, [stream, isRecording, mimeType])

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current
      if (!recorder || recorder.state === 'inactive') {
        resolve(null)
        return
      }

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        chunksRef.current = []
        recorderRef.current = null
        setIsRecording(false)
        setDuration(0)
        resolve(blob.size > 0 ? blob : null)
      }

      recorder.stop()
    })
  }, [mimeType])

  const getExtension = useCallback(() => extensionForMime(mimeType), [mimeType])

  return {
    isRecording,
    duration,
    mimeType,
    startRecording,
    stopRecording,
    getExtension,
  }
}
