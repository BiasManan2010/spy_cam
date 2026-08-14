import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { MediaItem } from '../types'

interface StealthCamDB extends DBSchema {
  media: {
    key: string
    value: {
      id: string
      type: 'photo' | 'video'
      blob: Blob
      thumbnail: string
      createdAt: number
      mimeType: string
      filename: string
    }
    indexes: { 'by-date': number }
  }
}

const DB_NAME = 'stealthcam-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<StealthCamDB>> | null = null

function getDB(): Promise<IDBPDatabase<StealthCamDB>> {
  if (!dbPromise) {
    dbPromise = openDB<StealthCamDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('media', { keyPath: 'id' })
        store.createIndex('by-date', 'createdAt')
      },
    })
  }
  return dbPromise
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  const db = await getDB()
  await db.put('media', item)
}

export async function getAllMediaItems(): Promise<MediaItem[]> {
  const db = await getDB()
  const items = await db.getAllFromIndex('media', 'by-date')
  return items.reverse()
}

export async function deleteMediaItem(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('media', id)
}

export async function clearAllMedia(): Promise<void> {
  const db = await getDB()
  await db.clear('media')
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function createVideoThumbnail(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    const url = URL.createObjectURL(blob)

    video.onloadeddata = () => {
      video.currentTime = 0.1
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 160
      canvas.height = 90
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const thumb = canvas.toDataURL('image/jpeg', 0.7)
        URL.revokeObjectURL(url)
        resolve(thumb)
      } else {
        URL.revokeObjectURL(url)
        reject(new Error('Canvas unavailable'))
      }
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Video load failed'))
    }

    video.src = url
  })
}
