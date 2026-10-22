import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Program, ProgramSong } from '@/models/Program'
import {
  programService,
  type CreateProgramDto,
  type UpdateProgramDto,
  type UpdateProgramSongDto,
} from '@/services/programService'
import type { Song } from '@/models/Song'

interface ProgramState {
  items: Program[]
  current: Program | null
  currentSong: ProgramSong | null
  loading: boolean
  addedSong: Song | null
}

const initialState: ProgramState = {
  items: [],
  current: null,
  currentSong: null,
  loading: false,
  addedSong: null,
}

export const fetchPrograms = createAsyncThunk<Program[]>(
  'program/fetchAll',
  async () => {
    return programService.getAllPrograms()
  },
)

export const fetchProgram = createAsyncThunk<Program, number>(
  'program/fetchOne',
  async (id) => {
    return programService.getProgram(id)
  },
)

export const fetchProgramSong = createAsyncThunk<
  ProgramSong,
  { programId: number; songId: number }
>('program/fetchSong', async ({ programId, songId }) => {
  return programService.getProgramSong(programId, songId)
})

export const createProgramThunk = createAsyncThunk<Program, CreateProgramDto>(
  'program/create',
  async (payload) => {
    return programService.createProgram(payload)
  },
)

export const updateProgramThunk = createAsyncThunk<
  Program,
  { id: number; data: UpdateProgramDto }
>('program/update', async ({ id, data }) => {
  return programService.updateProgram(id, data)
})

export const deleteProgramThunk = createAsyncThunk<number, number>(
  'program/delete',
  async (id) => {
    await programService.deleteProgram(id)
    return id
  },
)

export const updateProgramSongThunk = createAsyncThunk<
  ProgramSong,
  { programId: number; songId: number; data: UpdateProgramSongDto }
>('program/updateSong', async ({ programId, songId, data }) => {
  return programService.updateProgramSong(programId, songId, data)
})

export const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    destroyAddedSong: (state) => {
      state.addedSong = null
    },
    insertAddedSong: (state, action: PayloadAction<Song>) => {
      state.addedSong = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPrograms
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      // fetchProgram
      .addCase(fetchProgram.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProgram.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload
      })
      .addCase(fetchProgram.rejected, (state) => {
        state.loading = false
      })
      .addCase(fetchProgramSong.pending, (state) => {
        state.loading = true
        state.currentSong = null
      })
      .addCase(fetchProgramSong.fulfilled, (state, action) => {
        state.loading = false
        state.currentSong = action.payload
      })
      .addCase(fetchProgramSong.rejected, (state) => {
        state.loading = false
      })
      // createProgramThunk
      .addCase(createProgramThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(createProgramThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      // updateProgramThunk
      .addCase(updateProgramThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProgramThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        )
        state.current = null
      })
      .addCase(updateProgramSongThunk.fulfilled, (state, action) => {
        const updatedSong = action.payload
        if (
          state.currentSong?.programId === updatedSong.programId &&
          state.currentSong.songId === updatedSong.songId
        ) {
          state.currentSong = updatedSong
        }
        const programs = state.current
          ? [...state.items, state.current]
          : state.items

        for (const program of programs) {
          if (program.id !== updatedSong.programId) continue
          const index = program.songs.findIndex(
            (song) => song.songId === updatedSong.songId,
          )
          if (index !== -1) {
            const orderChanged = program.songs[index].order !== updatedSong.order
            program.songs[index] = updatedSong
            if (orderChanged) program.songs.sort((a, b) => a.order - b.order)
          }
        }
      })
      // deleteProgramThunk
      .addCase(deleteProgramThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteProgramThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(
          (program) => program.id !== action.payload,
        )
        if (state.current?.id === action.payload) {
          state.current = null
        }
      })
  },
})

export const { destroyAddedSong, insertAddedSong } = programSlice.actions
