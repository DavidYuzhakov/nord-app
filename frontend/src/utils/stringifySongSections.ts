import type { SongSection } from './parseSongSections'

export function stringifySongSections(sections: SongSection[]): string {
  return sections
    .map((section) => {
      const lines: string[] = []

      if (section.title) {
        lines.push(section.title)
      }

      for (const line of section.lines) {
        if (line.tokens && line.tokens.length > 0) {
          lines.push(line.tokens.map((token) => token.value).join(''))
        } else {
          lines.push(line.raw)
        }
      }

      return lines.join('\n')
    })
    .join('\n')
}
