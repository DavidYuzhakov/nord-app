import { apiInstance } from '@/api'
import type { Program } from '@/models/Program'

export type CreateProgramDto = {
  name: string
  songsId: number[]
}
export type UpdateProgramDto = {
  name?: string
  songsId?: number[]
  isArchived?: boolean
  isFavorite?: boolean
}

export const programService = {
  getAllPrograms: async () => {
    const { data } = await apiInstance.get<Program[]>('/program')
    return data
  },
  getProgram: async (id: number) => {
    const { data } = await apiInstance.get<Program>(`/program/${id}`)
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

  deleteProgram: async (id: number) => {
    const { data } = await apiInstance.delete<void>(`/program/${id}`)
    return data
  },
}
