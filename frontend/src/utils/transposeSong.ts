import { Chord, Note } from 'tonal'
import type { SongSection } from './parseSongSections'
import { changeChordHtoB } from './normalizeKeyForTonal'

function transposeChord(chord: string, interval: string): string {
  const transposed = Chord.transpose(changeChordHtoB(chord), interval)

  const [main, bass] = transposed.split('/')

  const mainData = Chord.get(main)
  const root = mainData.tonic ? Note.simplify(mainData.tonic) : main

  const suffix = mainData.tonic
    ? mainData.symbol.slice(mainData.tonic.length)
    : ''

  const simplifiedMain = root + suffix

  if (!bass) return simplifiedMain

  const simplifiedBass = Note.simplify(bass)

  return `${simplifiedMain}/${simplifiedBass}`
}

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
              value: transposeChord(token.value, interval),
            }
          : token,
      ),
    })),
  }))
}
