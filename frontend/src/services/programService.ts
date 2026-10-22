import { apiInstance } from '@/api'
import type { Program, ProgramSong } from '@/models/Program'

export type CreateProgramDto = {
  name: string
  songsId: number[]
  date: string
}
export type UpdateProgramDto = {
  name?: string
  songsId?: number[]
  date?: string
  isArchived?: boolean
  isFavorite?: boolean
}
export type UpdateProgramSongDto = Partial<
  Omit<ProgramSong, 'id' | 'programId' | 'songId' | 'song'>
>

export const programService = {
  getAllPrograms: async () => {
    const { data } = await apiInstance.get<Program[]>('/program')
    return data
  },
  getProgram: async (id: number) => {
    const { data } = await apiInstance.get<Program>(`/program/${id}`)
    return data
  },

  getProgramSong: async (programId: number, songId: number) => {
    const { data } = await apiInstance.get<ProgramSong>(
      `/program/${programId}/songs/${songId}`,
    )
    return data
  },

  createProgram: async (payload: CreateProgramDto) => {
    const { data } = await apiInstance.post<Program>('/program', payload)
    return data
  },

  updateProgram: async (id: number, payload: UpdateProgramDto) => {
    const { data } = await apiInstance.patch<Program>(`/program/${id}`, payload)
    return data
  },

  updateProgramSong: async (
    programId: number,
    songId: number,
    payload: UpdateProgramSongDto,
  ) => {
    const { data } = await apiInstance.patch<ProgramSong>(
      `/program/${programId}/songs/${songId}`,
      payload,
    )
    return data
  },

  deleteProgram: async (id: number) => {
    const { data } = await apiInstance.delete<void>(`/program/${id}`)
    return data
  },
}
