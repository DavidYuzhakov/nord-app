import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomBar } from '../components/BottomBar'
import { Loading } from '../components/Loading'

export function Layout() {
  return (
    <div className="px-3 max-w-[500px] mx-auto">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <BottomBar />
    </div>
  )
}
