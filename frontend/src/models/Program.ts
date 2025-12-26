import type { Song } from './Song'

export interface ProgramSong {
  id: number
  order: number
  song: Song
}

export interface Program {
  id: number
  name: string
  leader: string
  songs: ProgramSong[]
}
