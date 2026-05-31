import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect } from 'react'
import { MoonStarIcon, SunIcon } from 'lucide-react'
import { updateMode } from '@/store/reducers/settingsSlice'
import { Program } from '@/components/Program'
import { fetchPrograms } from '@/store/reducers/programSlice'

export type TypeProgram = 'ready' | 'favorite' | 'archived'

export default function HomePage() {
  const mode = useAppSelector((state) => state.settings.mode)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchPrograms())
  }, [dispatch])

  return (
    <div className="pb-[130px]">
      <div className="flex items-center gap-2 py-3 mb-2.5">
        <img className="size-10 rounded-full" src="/logo.png" alt="Логотип" />
        <span className="flex-1 text-xl tracking-tighter font-bold flex gap-0.5 items-end">
          Nord App
          <div className="size-1.5 rounded-full bg-primary -translate-y-1" />
        </span>
        <button
          onClick={() =>
            mode === 'day'
              ? dispatch(updateMode('night'))
              : dispatch(updateMode('day'))
          }
          type="button"
          className="size-10 p-1"
        >
          {mode === 'day' ? (
            <MoonStarIcon className="stroke-[1.75px]" size={27} />
          ) : (
            <SunIcon className="stroke-[1.75px]" size={27} />
          )}
        </button>
      </div>
      <div className="space-y-8">
        {['ready', 'favorite', 'archived'].map((type) => (
          <Program key={type} type={type as TypeProgram} />
        ))}
      </div>

      <Button
        onClick={() => navigate('/new-program')}
        className="flex items-center max-w-sm mx-auto fixed bottom-18 left-7 right-7 text-xl font-semibold py-6 px-2 rounded-full shadow-md dark:shadow-[0_0_20px_rgba(28,143,214,0.3)]"
      >
        Новая программа
      </Button>
    </div>
  )
}
