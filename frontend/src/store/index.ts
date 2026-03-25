import { configureStore } from '@reduxjs/toolkit'
import { songSlice } from './reducers/songSlice'
import { programSlice } from './reducers/programSlice'
import { settingsSlice } from './reducers/settingsSlice'

export const store = configureStore({
  reducer: {
    song: songSlice.reducer,
    program: programSlice.reducer,
    settings: settingsSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
