# StealthCam PWA

A mobile-first Progressive Web App that captures photos and videos with a fully disguised interface. Designed to look and feel like a native iOS/Android application.

## Features

- **Disguise Modes**
  - Pitch-black screen (#000000) — device appears powered off
  - Custom decoy images — preset iOS/Android home screens, news article, loading screen, or upload your own
- **Hidden Gesture** — Three-finger triple-tap to exit disguise mode
- **Haptic Feedback** — Subtle vibration on enter/exit disguise mode
- **Rear Camera** — WebRTC with `facingMode: environment` by default
- **Photo & Video** — Canvas JPEG capture and MediaRecorder (MP4/WebM)
- **Local Gallery** — IndexedDB persistence with download and delete
- **Fullscreen** — Auto fullscreen in disguise mode
- **Wake Lock** — Screen stays on while recording or disguised

## Development

```bash
npm install
npm run dev
```

Open on a mobile device over HTTPS (or localhost) for camera access.

## Build

```bash
npm run build
npm run preview
```

## Usage

1. Tap **Enable Camera & Microphone**
2. Choose photo or video mode and configure disguise settings
3. Tap **Activate Disguise Mode**
4. To exit: **three-finger triple-tap** anywhere on screen

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- vite-plugin-pwa
- IndexedDB (via `idb`)
