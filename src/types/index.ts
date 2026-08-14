export type DisguiseType = 'black' | 'decoy'

export type CaptureMode = 'photo' | 'video'

export type DecoyPreset =
  | 'ios-home'
  | 'android-home'
  | 'article'
  | 'loading'
  | 'custom'

export interface DecoyOption {
  id: DecoyPreset
  label: string
  src: string | null
}

export interface MediaItem {
  id: string
  type: 'photo' | 'video'
  blob: Blob
  thumbnail: string
  createdAt: number
  mimeType: string
  filename: string
}

export interface AppSettings {
  disguiseType: DisguiseType
  decoyPreset: DecoyPreset
  customDecoyUrl: string | null
  captureMode: CaptureMode
  micMuted: boolean
}
