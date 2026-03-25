import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type TMode = 'night' | 'day'
type THideChords = 'on' | 'off'

interface ProgramState {
  mode: TMode
  hideChords: THideChords
}

const initialState: ProgramState = {
  mode: (localStorage.getItem('mode') as TMode) ?? 'day',
  hideChords: (localStorage.getItem('hide-chords') as THideChords) ?? 'off',
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateHideChords: (state, action: PayloadAction<THideChords>) => {
      state.hideChords = action.payload
      localStorage.setItem('hide-chords', action.payload)
    },
    updateMode: (state, action: PayloadAction<TMode>) => {
      state.mode = action.payload
      localStorage.setItem('mode', action.payload)
    },
  },
})

export const { updateHideChords, updateMode } = settingsSlice.actions
