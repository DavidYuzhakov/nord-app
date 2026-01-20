export type SectionType =
  | 'intro'
  | 'verse'
  | 'chorus'
  | 'bridge'
  | 'instrumental'
  | 'prechorus'
  | 'unknown'

export type LineToken =
  | { type: 'text'; value: string }
  | { type: 'chord'; value: string }

interface SectionLine {
  raw: string
  tokens: LineToken[]
}

export interface SongSection {
  type: SectionType
  title: string
  lines: SectionLine[]
}

const SECTION_HEADER_REGEX =
  /^(\d+\s+)?([\p{L}-]+)(?:\s+\d+|\s+x\d+|\s+х\d+)?\s*:/iu


const SECTION_TYPE_MAP: Record<string, SectionType> = {
  интро: 'intro',
  куплет: 'verse',
  припев: 'chorus',
  бридж: 'bridge',
  проигрыш: 'instrumental',
  'пред-припев': 'prechorus',
}

export function parseSongSections(text: string): SongSection[] {
  const lines = text.split('\n')

  const sections: SongSection[] = []
  let currentSection: SongSection | null = null

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const headerMatch = line.match(SECTION_HEADER_REGEX)
    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection)
      }

      const title = headerMatch[0].trim()
      const key = (headerMatch[2] ?? headerMatch[1]).toLowerCase()

      currentSection = {
        type: SECTION_TYPE_MAP[key] ?? 'unknown',
        title,
        lines: [],
      }

      continue
    }

    if (!currentSection) continue
    currentSection.lines.push({ raw: line, tokens: [] })
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}