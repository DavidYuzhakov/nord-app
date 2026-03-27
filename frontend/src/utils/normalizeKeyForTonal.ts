import type { KeyType } from '@/models/Song'

export const normalizeKeyForTonal = (key: KeyType): string => {
  let normalized = key.replace(/m$/, '')
  if (normalized.startsWith('Hb')) {
    normalized = 'Bb' + normalized.slice(2)
  } else if (normalized.startsWith('H')) {
    normalized = 'B' + normalized.slice(1)
  }
  return normalized
}

export const changeChordHtoB = (chord: string): string => {
  return chord.replace(/\bHb/g, 'Bb').replace(/\bH/g, 'B')
}
