import { ChevronLeft, MusicIcon } from 'lucide-react'
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
      <div className="flex items-center gap-3 pt-3 pb-2 border-b">
        <button
          onClick={() => goBack()}
          type="button"
          className="bg-secondary w-fit text-background p-2 flex items-center justify-center rounded-full text-2xl"
        >
          <ChevronLeft className="stroke-foreground" />
        </button>
        <h5 className="flex-1 text-xl font-semibold">{title}</h5>
      </div>
      {children}
      <BottomBar />
    </div>
  )
}
