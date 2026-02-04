export interface Song {
  id: number
  name: string
  key: KeyType
  bpm: number
  text?: string
  structure?: SongStructureItem[]
}

export type SongStructureItem = {
  text: string
  amount: number
}

export type KeyType =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Hb'
  | 'H'
  | 'Cm'
  | 'C#m'
  | 'Dbm'
  | 'Dm'
  | 'D#m'
  | 'Ebm'
  | 'Em'
  | 'Fm'
  | 'F#m'
  | 'Gbm'
  | 'Gm'
  | 'G#m'
  | 'Abm'
  | 'Am'
  | 'A#m'
  | 'Hbm'
  | 'Hm'
