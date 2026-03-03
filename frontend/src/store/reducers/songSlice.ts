import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Song } from '@/models/Song'
import {
  songService,
  type CreateSongDto,
  type UpdateSongDto,
  type GetSongsParams,
} from '@/services/songService'

interface SongState {
  items: Song[]
  current: Song | null
  loading: boolean
}

const initialState: SongState = {
  items: [],
  current: null,
  loading: false,
}

export const fetchSongs = createAsyncThunk<Song[], GetSongsParams | undefined>(
  'song/fetchAll',
  async (params) => {
    return songService.getAllSongs(params ?? {})
  },
)

export const fetchSong = createAsyncThunk<Song, number>(
  'song/fetchOne',
  async (id) => {
    return songService.getSong(id)
  },
)

export const createSongThunk = createAsyncThunk<Song, CreateSongDto>(
  'song/create',
  async (payload) => {
    return songService.createSong(payload)
  },
)

export const updateSongThunk = createAsyncThunk<
  Song,
  { id: number; data: UpdateSongDto }
>('song/update', async ({ id, data }) => {
  return songService.updateSong(id, data)
})

export const deleteSongThunk = createAsyncThunk<number, number>(
  'song/delete',
  async (id) => {
    await songService.deleteSong(id)
    return id
  },
)

export const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchSongs
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.current = null
      })
      // fetchSong
      .addCase(fetchSong.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSong.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload
      })
      .addCase(fetchSong.rejected, (state) => {
        state.loading = false
      })
      // createSongThunk
      .addCase(createSongThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(createSongThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      // updateSongThunk
      .addCase(updateSongThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(updateSongThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.map((song) =>
          song.id === action.payload.id ? action.payload : song,
        )
        state.current = action.payload
      })
      // deleteSongThunk
      .addCase(deleteSongThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteSongThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((song) => song.id !== action.payload)
        state.current = null
      })
  },
})
