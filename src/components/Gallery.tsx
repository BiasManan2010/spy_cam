import { useEffect, useMemo, useState } from 'react'
import type { MediaItem } from '../types'
import {
  deleteMediaItem,
  downloadBlob,
  getAllMediaItems,
} from '../store/mediaStore'

interface GalleryProps {
  open: boolean
  onClose: () => void
  refreshKey: number
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Gallery({ open, onClose, refreshKey }: GalleryProps) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setLoading(true)

    getAllMediaItems()
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, refreshKey])

  const handleDelete = async (id: string) => {
    await deleteMediaItem(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const handleDownload = (item: MediaItem) => {
    downloadBlob(item.blob, item.filename)
  }

  const selectedVideoUrl = useMemo(() => {
    if (!selected || selected.type !== 'video') return null
    return URL.createObjectURL(selected.blob)
  }, [selected])

  useEffect(() => {
    return () => {
      if (selectedVideoUrl) URL.revokeObjectURL(selectedVideoUrl)
    }
  }, [selectedVideoUrl])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-zinc-950">
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 className="text-lg font-semibold text-zinc-100">Gallery</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 active:bg-zinc-700"
        >
          Close
        </button>
      </header>

      {selected ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 items-center justify-center bg-black p-2">
            {selected.type === 'photo' ? (
              <img
                src={selected.thumbnail}
                alt="Captured"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <video
                src={selectedVideoUrl ?? undefined}
                controls
                playsInline
                className="max-h-full max-w-full"
              />
            )}
          </div>
          <div className="flex shrink-0 gap-3 border-t border-zinc-800 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => handleDownload(selected)}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white active:bg-blue-500"
            >
              Download
            </button>
            <button
              type="button"
              onClick={() => void handleDelete(selected.id)}
              className="flex-1 rounded-xl bg-red-600/90 py-3 text-sm font-semibold text-white active:bg-red-500"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-200"
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {loading ? (
            <p className="text-center text-zinc-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="mt-12 text-center text-zinc-500">
              No captures yet. Take photos or record videos from the setup
              screen.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item)}
                  className="relative aspect-square overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800"
                >
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {item.type === 'video' && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      VIDEO
                    </span>
                  )}
                  <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-zinc-300">
                    {formatDate(item.createdAt)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
