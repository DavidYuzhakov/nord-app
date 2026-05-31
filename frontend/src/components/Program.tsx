import { useAppSelector } from '@/store/hooks'
import { useSearchParams } from 'react-router-dom'
import { Skeleton } from './ui/skeleton'
import { ProgramCard } from './ProgramCard'
import type { Program } from '@/models/Program'
import { ArchiveIcon, HeartIcon } from 'lucide-react'
import type { TypeProgram } from '@/pages/HomePage'

export function Program({ type }: { type: TypeProgram }) {
  const [params, setParams] = useSearchParams()
  const openKey = params.get('open')

  const { loading, items } = useAppSelector((state) => state.program)
  const programs =
    type === 'ready'
      ? items.filter((item) => !item.isArchived)
      : type === 'favorite'
        ? items.filter((item) => item.isFavorite)
        : items.filter((item) => item.isArchived)
  return (
    <div className="space-y-2.5">
      <h3 className="text-xl font-semibold flex items-center gap-1">
        {type === 'ready' ? (
          <>Готовые программы</>
        ) : type === 'favorite' ? (
          <>
            Любимые программы <HeartIcon className="stroke-destructive" />
          </>
        ) : (
          <>
            Архив программ <ArchiveIcon className="stroke-third" />
          </>
        )}
      </h3>
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
            type={type}
            key={program.id}
            {...program}
            isOpenExternal={openKey === `${type}-${program.id}`}
            setOpenExternal={(id) => {
              setParams(id ? { open: `${type}-${id}` } : {})
            }}
          />
        ))}
      </div>
    </div>
  )
}
