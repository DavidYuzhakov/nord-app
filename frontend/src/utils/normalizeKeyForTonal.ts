import type { KeyType } from "@/models/Song"

export const normalizeKeyForTonal = (key: KeyType): string => {
  let normalized = key.replace(/m$/, '')
  if (normalized.startsWith('Hb')) {
    normalized = 'Bb' + normalized.slice(2)
  } else if (normalized.startsWith('H')) {
    normalized = 'B' + normalized.slice(1)
  }
  return normalized
}

export const normalizeChordFromTonal = (chord: string): string => {
  if (chord.startsWith('Bb')) {
    return 'Hb' + chord.slice(2)
  }
  if (chord.match(/^B($|[m0-9#b/A-Z])/)) {
    return 'H' + chord.slice(1)
  }
  return chord
}