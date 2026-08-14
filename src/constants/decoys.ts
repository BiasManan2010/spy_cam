import type { DecoyOption } from '../types'

export const DECOY_PRESETS: DecoyOption[] = [
  {
    id: 'ios-home',
    label: 'iOS Home Screen',
    src: '/decoy/ios-home.svg',
  },
  {
    id: 'android-home',
    label: 'Android Home Screen',
    src: '/decoy/android-home.svg',
  },
  {
    id: 'article',
    label: 'News Article',
    src: '/decoy/article.svg',
  },
  {
    id: 'loading',
    label: 'Loading Screen',
    src: '/decoy/loading.svg',
  },
  {
    id: 'custom',
    label: 'Custom Upload',
    src: null,
  },
]

export function getDecoyImageSrc(
  preset: DecoyOption['id'],
  customUrl: string | null,
): string | null {
  if (preset === 'custom') return customUrl
  return DECOY_PRESETS.find((d) => d.id === preset)?.src ?? null
}
