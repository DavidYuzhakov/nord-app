import { Chord } from "tonal";
import type { SongSection } from './parseSongSections'

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
              value: Chord.transpose(token.value, interval) ?? token.value,
            }
          : token,
      ),
    })),
  }))
}