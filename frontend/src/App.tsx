import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { Layout } from './Layout'
import { SectionLayout } from './SectionLayout'
import { useAppSelector } from './store/hooks'
import { lazy, Suspense, useEffect } from 'react'
import { Loading } from './components/Loading'
import { loadLiveModePage, loadSongsPage } from './routeLoaders'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const MutationProgramPage = lazy(() => import('./pages/MutationProgramPage'))
const MutationSongPage = lazy(() => import('./pages/MutationSongPage'))
const SongDetailPage = lazy(() => import('./pages/SongDetailPage'))
const LiveModePage = lazy(loadLiveModePage)
const SongsPage = lazy(loadSongsPage)

function App() {
  const mode = useAppSelector((state) => state.settings.mode)

  useEffect(() => {
    if (mode === 'night') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [mode])

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="live-mode" element={<LiveModePage />} />
          <Route path="songs" element={<SongsPage />} />
          <Route path="song/:id" element={<SongDetailPage />} />
          <Route path="*" element={<p>404</p>} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<SectionLayout title="Новая программа" />}>
          <Route path="program/create" element={<MutationProgramPage />} />
        </Route>
        <Route element={<SectionLayout title="Редактирование" />}>
          <Route path="program/:id/edit" element={<MutationProgramPage />} />
          <Route path="song/:id/edit" element={<MutationSongPage />} />
        </Route>
        <Route element={<SectionLayout title="Создание хвалы" />}>
          <Route path="song/create" element={<MutationSongPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
