import { Chord } from 'tonal'
import type { SongSection } from './parseSongSections'
import {
  changeChordHtoB,
  normalizeChordFromTonal,
} from './normalizeKeyForTonal'

export function transposeSections(
  sections: SongSection[],
  interval: string,
): SongSection[] {
  return sections.map((section) => ({
    ...section,
    lines: section.lines.map((line) => ({
      ...line,
      tokens: line.tokens.map((token) =>
        token.type === 'chord'
          ? {
              type: 'chord',
              value: normalizeChordFromTonal(
                Chord.transpose(changeChordHtoB(token.value), interval) ??
                  token.value,
              ),
            }
          : token,
      ),
    })),
  }))
}
