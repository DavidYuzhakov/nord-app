import { Chord } from "tonal";
import type { SongSection } from './parseSongSections'
import { normalizeChordFromTonal } from './normalizeKeyForTonal'

export function transposeSections(
  sections: SongSection[],
  interval: string,
): SongSection[] {
  return sections.map(section => ({
    ...section,
    lines: section.lines.map(line => ({
      ...line,
      tokens: line.tokens.map(token =>
        token.type === 'chord'
          ? {
              type: 'chord',
              value: normalizeChordFromTonal(
                Chord.transpose(token.value, interval) ?? token.value
              ),
            }
          : token,
      ),
    })),
  }))
}