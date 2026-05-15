import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { Layout } from './Layout'
import { SectionLayout } from './SectionLayout'
import NewProgramPage from './pages/NewProgramPage'
import SongsPage from './pages/SongsPage'
import LiveModePage from './pages/LiveModePage'
import SongDetailPage from './pages/SongDetailPage'
import MutationSongPage from './pages/MutationSongPage'
import { useAppSelector } from './store/hooks'
import { useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

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
        path="/new-program"
        element={
          <SectionLayout title="Новая программа">
            <NewProgramPage />
          </SectionLayout>
        }
      />
      <Route
        path="/live-mode"
        element={
          <Layout>
            <LiveModePage />
          </Layout>
        }
      />
      <Route
        path="/songs"
        element={
          <Layout>
            <SongsPage />
          </Layout>
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
          <SectionLayout title="Редактирование">
            <MutationSongPage />
          </SectionLayout>
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
