import { PlusCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProgramCard } from '@/components/ProgramCard'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect } from 'react'
import { fetchPrograms } from '@/store/reducers/programSlice'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomePage() {
  const { loading, items: programs } = useAppSelector((state) => state.program)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchPrograms())
  }, [dispatch])

  return (
    <div className="space-y-2.5 pb-36">
      <div className="flex items-center gap-2 py-3">
        <img className="size-10" src="/logo.png" alt="Логотип" />
        <span className="flex-1 text-xl tracking-tighter font-bold flex gap-0.5 items-end">
          Nord App
          <div className="size-1.5 rounded-full bg-primary -translate-y-1" />
        </span>
      </div>
      <h3 className="text-xl font-semibold">Готовые программы</h3>

      <div className="space-y-3">
        {!loading && programs.length === 0 && (
          <p className="text-center text-slate-500">Список пуст</p>
        )}
        {loading &&
          programs.length === 0 &&
          [...new Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full rounded-xl h-[60px]" />
          ))}
        {programs.map((program) => (
          <ProgramCard key={program.id} {...program} />
        ))}
      </div>

      <Button
        onClick={() => navigate('/new-program')}
        className="flex items-center max-w-md mx-auto fixed bottom-24 left-7 right-7 text-xl font-semibold py-6 px-2 shadow-md "
      >
        Новая программа <PlusCircleIcon className="size-6" />
      </Button>
    </div>
  )
}
