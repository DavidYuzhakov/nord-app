import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { Layout } from './Layout'
import { SectionLayout } from './SectionLayout'
import NewProgramPage from './pages/NewProgramPage'

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
      <Route path="/live-mode" element={<Layout>Live Mode</Layout>} />
      <Route path="/songs" element={<Layout>Songs</Layout>} />
    </Routes>
  )
}

export default App
