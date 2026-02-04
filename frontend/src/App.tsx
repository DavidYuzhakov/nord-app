import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { Layout } from './Layout'
import { SectionLayout } from './SectionLayout'
import NewProgramPage from './pages/NewProgramPage'
import SongsPage from './pages/SongsPage'
import LiveModePage from './pages/LiveModePage'
import SongDetailPage from './pages/SongDetailPage'
import EditSongPage from './pages/EditSongPage'

function App() {
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
          <Layout>
            <EditSongPage />
          </Layout>
        }
      />
    </Routes>
  )
}

export default App
