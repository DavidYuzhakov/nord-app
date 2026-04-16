type SectionType =
  | 'вступление'
  | 'куплет'
  | 'пред-припев'
  | 'припев'
  | 'бридж'
  | 'проигрыш'
  | 'тег'
  | 'unknown'

const validSectionTypes: Set<string> = new Set([
  'вступление',
  'куплет',
  'пред-припев',
  'припев',
  'бридж',
  'проигрыш',
  'тег',
])

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

// 👇 ключевое изменение тут
const SECTION_HEADER_REGEX =
  /^(\d+\s+)?(вступление|куплет|пред[- ]припев|припев|бридж|проигрыш|тег)(?:\s+\d+|\s+x\d+|\s+х\d+)?\s*:/iu

export function parseSongSections(text: string): SongSection[] {
  const lines = text.split('\n')

  const sections: SongSection[] = []
  let currentSection: SongSection | null = null

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const headerMatch = line.match(SECTION_HEADER_REGEX)

    if (headerMatch) {
      let key = headerMatch[2].toLowerCase()

      // 👇 нормализация "пред припев" → "пред-припев"
      if (key === 'пред припев') {
        key = 'пред-припев'
      }

      if (currentSection) {
        sections.push(currentSection)
      }

      const title = headerMatch[0].trim()

      currentSection = {
        type: validSectionTypes.has(key) ? (key as SectionType) : 'unknown',
        title,
        lines: [],
      }
      continue
    }

    if (!currentSection) {
      currentSection = {
        type: 'unknown',
        title: '',
        lines: [],
      }
    }

    if (line.trim().length > 0) {
      currentSection.lines.push({ raw: line, tokens: [] })
    }
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}
