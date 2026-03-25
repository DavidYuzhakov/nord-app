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

const sectionAliases: Record<string, SectionType> = {
  'пред-припев': 'пред-припев',
  'пред припев': 'пред-припев',
}

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
  /^(\d+\s+)?([\p{L}]+(?:[ -][\p{L}]+)*)(?:\s+\d+|\s+x\d+|\s+х\d+)?\s*:/iu

export function parseSongSections(text: string): SongSection[] {
  const lines = text.split('\n')

  const sections: SongSection[] = []
  let currentSection: SongSection | null = null

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const headerMatch = line.match(SECTION_HEADER_REGEX)

    if (headerMatch) {
      const key = (headerMatch[2] ?? headerMatch[1])
        .toLowerCase()
        .replace(/\s+/g, '-')
      if (currentSection) {
        sections.push(currentSection)
      }

      const title = headerMatch[0].trim()

      console.log(sectionAliases[key])
      currentSection = {
        type: validSectionTypes.has(key) ? (key as SectionType) : 'unknown',
        title,
        lines: [],
      }

      console.log(currentSection)
      continue
    }

    if (!currentSection) {
      currentSection = {
        type: 'unknown',
        title: '',
        lines: [],
      }
    }
    currentSection.lines.push({ raw: line, tokens: [] })
  }

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}
