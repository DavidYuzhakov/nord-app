import { apiInstance } from '@/api'
import type { Song } from '@/models/Song'

export type CreateSongDto = Omit<Song, 'id'>
export type UpdateSongDto = Partial<CreateSongDto>
export interface GetSongsParams {
  search?: string
}

export const songService = {
  getAllSongs: async (params: GetSongsParams = {}) => {
    const { data } = await apiInstance.get<Song[]>('/song', {
      params,
    })
    return data
  },

  getSong: async (id: number) => {
    const { data } = await apiInstance.get<Song>(`/song/${id}`)
    return data
  },

  createSong: async (payload: CreateSongDto) => {
    const { data } = await apiInstance.post<Song>('/song', payload)
    return data
  },

  updateSong: async (id: number, payload: UpdateSongDto) => {
    const { data } = await apiInstance.patch<Song>(`/song/${id}`, payload)
    return data
  },

  deleteSong: async (id: number) => {
    const { data } = await apiInstance.delete<void>(`/song/${id}`)
    return data
  },
}
