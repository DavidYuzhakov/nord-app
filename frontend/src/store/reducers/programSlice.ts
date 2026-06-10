import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Program } from '@/models/Program'
import {
  programService,
  type CreateProgramDto,
  type UpdateProgramDto,
} from '@/services/programService'
import type { Song } from '@/models/Song'

interface ProgramState {
  items: Program[]
  current: Program | null
  loading: boolean
  addedSong: Song | null
}

const initialState: ProgramState = {
  items: [],
  current: null,
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
