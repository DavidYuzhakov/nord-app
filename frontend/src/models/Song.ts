export interface Song {
  id: number
  name: string
  key: KeyType
  bpm: number
  text?: string
  structure?: SongStructureItem[]
}

type SongStructureItem = {
  text: string
  amount: number
}

export type KeyType = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'H'
