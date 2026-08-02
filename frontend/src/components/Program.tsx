import { useAppSelector } from '@/store/hooks'
import { useSearchParams } from 'react-router-dom'
import { Skeleton } from './ui/skeleton'
import { ProgramCard } from './ProgramCard'
import type { Program } from '@/models/Program'
import { CalendarIcon } from 'lucide-react'
import type { TypeProgram } from '@/pages/HomePage'
import { Button } from './ui/button'
import { useMemo, useState } from 'react'
import { Calendar } from './ui/calendar'
import type { DateRange } from 'react-day-picker'
import { ru } from 'date-fns/locale'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export function Program({ type }: { type: TypeProgram }) {
  const [params, setParams] = useSearchParams()
  const openKey = params.get('open')

  // Only for archive programs
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  })

  const { loading, items } = useAppSelector((state) => state.program)
  const programs = useMemo(() => {
    return type === 'ready'
      ? items.filter((item) => !item.isArchived)
      : type === 'favorite'
        ? items.filter((item) => item.isFavorite)
        : items
            .filter((item) => item.isArchived)
            .filter((item) => {
              if (!item.date) return true

              if (!date?.from || !date?.to) return true // все программы

              const programDate = new Date(item.date)

              const from = new Date(date.from)
              from.setHours(0, 0, 0, 0)

              const to = new Date(date.to)
              to.setHours(23, 59, 59, 999)

              return programDate >= from && programDate <= to
            })
            .sort(
              (a, b) =>
                new Date(b.date || b.updatedAt).getTime() -
                new Date(a.date || b.updatedAt).getTime(),
            )
  }, [type, items, date])

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center gap-1 flex-wrap">
        <h3 className="text-xl font-semibold flex items-center gap-1 text-nowrap ">
          {type === 'ready' ? (
            <>Готовые программы</>
          ) : type === 'favorite' ? (
            <>Любимые программы</>
          ) : (
            <>Архив программ</>
          )}
        </h3>
        {type === 'archived' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker-range"
                className="justify-start py-0! font-normal w-fit rounded-full text-xs h-7 dark:bg-background bg-background shadow-none"
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'dd.MM.yy', { locale: ru })} -{' '}
                      {format(date.to, 'dd.MM.yy', { locale: ru })}
                    </>
                  ) : (
                    <>{format(date.from, 'dd.MM.yy', { locale: ru })}</>
                  )
                ) : (
                  <span>Все программы</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full rounded-md p-0" align="end">
              <Calendar
                className="p-2 w-full rounded-xl"
                locale={ru}
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
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
