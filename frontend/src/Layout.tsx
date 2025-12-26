import { BottomBar } from './components/BottomBar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 max-w-md mx-auto">
      {children}
      <BottomBar />
    </div>
  )
}
