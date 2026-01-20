import { ChevronLeft } from 'lucide-react'
import { BottomBar } from './components/BottomBar'
import { useGoBack } from './hook/useGoBack'

export function SectionLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const goBack = useGoBack()

  return (
    <div className="px-3 max-w-md mx-auto">
      <div className="flex items-center gap-3 pt-3">
        <button
          onClick={() => goBack()}
          className="shrink-0 p-0 flex items-center justify-center rounded-full size-[45px] bg-secondary/20 backdrop-blur-xs border drop-shadow-xs"
          type="button"
        >
          <ChevronLeft />
        </button>
        <h5 className="flex-1 text-xl font-semibold">{title}</h5>
      </div>
      {children}
      <BottomBar />
    </div>
  )
}
