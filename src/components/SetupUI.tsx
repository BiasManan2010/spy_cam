import type { CaptureMode, DecoyPreset, DisguiseType } from '../types'
import { DECOY_PRESETS } from '../constants/decoys'

interface SetupUIProps {
  disguiseType: DisguiseType
  decoyPreset: DecoyPreset
  customDecoyUrl: string | null
  captureMode: CaptureMode
  micMuted: boolean
  cameraReady: boolean
  cameraError: string | null
  isRecording: boolean
  recordDuration: number
  onDisguiseTypeChange: (type: DisguiseType) => void
  onDecoyPresetChange: (preset: DecoyPreset) => void
  onCustomImageUpload: (file: File) => void
  onCaptureModeChange: (mode: CaptureMode) => void
  onMicMutedChange: (muted: boolean) => void
  onStartCamera: () => void
  onCapture: () => void
  onToggleRecording: () => void
  onActivateDisguise: () => void
  onOpenGallery: () => void
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function SetupUI({
  disguiseType,
  decoyPreset,
  customDecoyUrl,
  captureMode,
  micMuted,
  cameraReady,
  cameraError,
  isRecording,
  recordDuration,
  onDisguiseTypeChange,
  onDecoyPresetChange,
  onCustomImageUpload,
  onCaptureModeChange,
  onMicMutedChange,
  onStartCamera,
  onCapture,
  onToggleRecording,
  onActivateDisguise,
  onOpenGallery,
}: SetupUIProps) {
  return (
    <div className="relative z-10 flex h-[100dvh] flex-col overflow-hidden bg-zinc-950/90 backdrop-blur-sm">
      <header className="shrink-0 border-b border-zinc-800/80 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-50">
              StealthCam
            </h1>
            <p className="text-xs text-zinc-500">Discreet capture mode</p>
          </div>
          <button
            type="button"
            onClick={onOpenGallery}
            className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-200 active:bg-zinc-700"
          >
            Gallery
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {/* Camera status */}
        <section className="mb-5">
          {cameraError ? (
            <div className="rounded-xl border border-red-900/50 bg-red-950/40 p-4">
              <p className="text-sm text-red-300">{cameraError}</p>
              <button
                type="button"
                onClick={onStartCamera}
                className="mt-3 w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white"
              >
                Retry Camera
              </button>
            </div>
          ) : !cameraReady ? (
            <button
              type="button"
              onClick={onStartCamera}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white active:bg-blue-500"
            >
              Enable Camera & Microphone
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-900/40 bg-emerald-950/30 px-4 py-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-sm text-emerald-300">Camera active</span>
            </div>
          )}
        </section>

        {/* Capture mode */}
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Capture Mode
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {(['photo', 'video'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                disabled={!cameraReady}
                onClick={() => onCaptureModeChange(mode)}
                className={`rounded-xl py-3 text-sm font-semibold capitalize transition-colors ${
                  captureMode === mode
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-300 active:bg-zinc-700'
                } disabled:opacity-40`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* Capture controls */}
        {cameraReady && (
          <section className="mb-5">
            {captureMode === 'photo' ? (
              <button
                type="button"
                onClick={onCapture}
                className="w-full rounded-xl bg-white py-4 text-sm font-bold text-zinc-900 active:bg-zinc-200"
              >
                Take Photo
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleRecording}
                className={`w-full rounded-xl py-4 text-sm font-bold ${
                  isRecording
                    ? 'bg-red-600 text-white active:bg-red-500'
                    : 'bg-white text-zinc-900 active:bg-zinc-200'
                }`}
              >
                {isRecording
                  ? `Stop Recording (${formatDuration(recordDuration)})`
                  : 'Start Recording'}
              </button>
            )}
          </section>
        )}

        {/* Audio */}
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Audio
          </h2>
          <label className="flex items-center justify-between rounded-xl bg-zinc-900 px-4 py-3 ring-1 ring-zinc-800">
            <span className="text-sm text-zinc-300">Mute microphone</span>
            <input
              type="checkbox"
              checked={micMuted}
              onChange={(e) => onMicMutedChange(e.target.checked)}
              className="h-5 w-5 rounded accent-blue-500"
            />
          </label>
        </section>

        {/* Disguise type */}
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Disguise Mode
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onDisguiseTypeChange('black')}
              className={`rounded-xl py-3 text-sm font-semibold ${
                disguiseType === 'black'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              Pitch Black
            </button>
            <button
              type="button"
              onClick={() => onDisguiseTypeChange('decoy')}
              className={`rounded-xl py-3 text-sm font-semibold ${
                disguiseType === 'decoy'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              Decoy Image
            </button>
          </div>
        </section>

        {/* Decoy presets */}
        {disguiseType === 'decoy' && (
          <section className="mb-5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Decoy Preset
            </h2>
            <div className="space-y-2">
              {DECOY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onDecoyPresetChange(preset.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${
                    decoyPreset === preset.id
                      ? 'bg-blue-600/20 ring-1 ring-blue-500/50 text-blue-200'
                      : 'bg-zinc-900 text-zinc-300 ring-1 ring-zinc-800'
                  }`}
                >
                  {preset.src && (
                    <img
                      src={preset.src}
                      alt=""
                      className="h-10 w-7 rounded object-cover ring-1 ring-zinc-700"
                    />
                  )}
                  {preset.id === 'custom' && customDecoyUrl && (
                    <img
                      src={customDecoyUrl}
                      alt=""
                      className="h-10 w-7 rounded object-cover ring-1 ring-zinc-700"
                    />
                  )}
                  <span className="font-medium">{preset.label}</span>
                </button>
              ))}
              {decoyPreset === 'custom' && (
                <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 py-4 text-sm text-zinc-400">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) onCustomImageUpload(file)
                    }}
                  />
                  Upload Custom Image
                </label>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Activate disguise */}
      <footer className="shrink-0 border-t border-zinc-800 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          disabled={!cameraReady}
          onClick={onActivateDisguise}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-violet-900/30 active:from-violet-500 active:to-indigo-500 disabled:opacity-40"
        >
          Activate Disguise Mode
        </button>
        <p className="mt-2 text-center text-[11px] text-zinc-600">
          Exit: three-finger triple-tap anywhere on screen
        </p>
      </footer>
    </div>
  )
}
