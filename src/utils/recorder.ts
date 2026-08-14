const PREFERRED_TYPES = [
  'video/mp4',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
] as const

export function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') {
    return 'video/webm'
  }

  for (const type of PREFERRED_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type
    }
  }

  return 'video/webm'
}

export function extensionForMime(mime: string): string {
  if (mime.includes('mp4')) return 'mp4'
  return 'webm'
}
