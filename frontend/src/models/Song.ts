export interface Song {
  id: number
  name: string
  key: KeyType
  bpm: number
}

export type KeyType =
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'A'
  | 'H'
  | 'Cm'
  | 'Dm'
  | 'Em'
  | 'Fm'
  | 'Gm'
  | 'Am'
  | 'Bm'
