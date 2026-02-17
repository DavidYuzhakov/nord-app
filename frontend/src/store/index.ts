import { configureStore } from '@reduxjs/toolkit'
import { songSlice } from './reducers/songSlice'
import { programSlice } from './reducers/programSlice'

export const store = configureStore({
  reducer: {
    song: songSlice.reducer,
    program: programSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
