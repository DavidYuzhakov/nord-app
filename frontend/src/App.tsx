import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { Layout } from './Layout'
import { SectionLayout } from './SectionLayout'
import MutationProgramPage from './pages/MutationProgramPage'
import SongDetailPage from './pages/SongDetailPage'
import { useAppSelector } from './store/hooks'
import { lazy, Suspense, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { Loading } from './components/Loading'

const MutationSongPage = lazy(() => import('./pages/MutationSongPage'))
const LiveModePage = lazy(() => import('./pages/LiveModePage'))
const SongsPage = lazy(() => import('./pages/SongsPage'))

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
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/program/create"
        element={
          <SectionLayout title="Новая программа">
            <MutationProgramPage />
          </SectionLayout>
        }
      />
      <Route
        path="/program/:id/edit"
        element={
          <SectionLayout title="Редактирование">
            <MutationProgramPage />
          </SectionLayout>
        }
      />
      <Route
        path="/live-mode"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <LiveModePage />
            </Layout>
          </Suspense>
        }
      />
      <Route
        path="/songs"
        element={
          <Suspense fallback={<Loading />}>
            <Layout>
              <SongsPage />
            </Layout>
          </Suspense>
        }
      />
      <Route
        path="/song/:id"
        element={
          <Layout>
            <SongDetailPage />
          </Layout>
        }
      />
      <Route
        path="/song/:id/edit"
        element={
          <Suspense fallback={<Loading />}>
            <SectionLayout title="Редактирование">
              <MutationSongPage />
            </SectionLayout>
          </Suspense>
        }
      />
      <Route
        path="/song/create"
        element={
          <SectionLayout title="Создание хвалы">
            <MutationSongPage />
          </SectionLayout>
        }
      />
    </Routes>
  )
}

export default App
