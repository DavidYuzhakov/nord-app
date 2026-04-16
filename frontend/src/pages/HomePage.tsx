import { Button } from '@/components/ui/button'
import { ProgramCard } from '@/components/ProgramCard'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect } from 'react'
import { fetchPrograms } from '@/store/reducers/programSlice'
import { Skeleton } from '@/components/ui/skeleton'
import { MoonStarIcon, SunIcon } from 'lucide-react'
import { updateMode } from '@/store/reducers/settingsSlice'

export default function HomePage() {
  const { loading, items: programs } = useAppSelector((state) => state.program)
  const mode = useAppSelector((state) => state.settings.mode)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [params, setParams] = useSearchParams()
  const openId = Number(params.get('open'))

  useEffect(() => {
    dispatch(fetchPrograms())
  }, [dispatch])

  return (
    <div className="space-y-2.5 pb-[120px]">
      <div className="flex items-center gap-2 py-3">
        <img className="size-10" src="/logo.png" alt="Логотип" />
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
      <h3 className="text-xl font-semibold">Готовые программы</h3>
      <div className="space-y-3">
        {!loading && programs.length === 0 && (
          <p className="text-center text-muted-foreground">Список пуст</p>
        )}
        {loading &&
          programs.length === 0 &&
          [...new Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full rounded-xl h-[60px]" />
          ))}
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            {...program}
            isOpenExternal={openId === program.id}
            setOpenExternal={(id) => {
              setParams(id ? { open: String(id) } : {})
            }}
          />
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
