import { AddSong } from '@/components/AddSong'
import { Loading } from '@/components/Loading'
import { SongItem } from '@/components/SongItem'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { Song } from '@/models/Song'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  createProgramThunk,
  destroyAddedSong,
  fetchProgram,
  updateProgramThunk,
} from '@/store/reducers/programSlice'
import { getISOString } from '@/utils/date'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarIcon, InfoIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function MutationProgramPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [songs, setSongs] = useState<Song[]>([])
  const [date, setDate] = useState<Date | undefined>()
  const [name, setName] = useState('')
  const placeholder =
    date?.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    }) ?? ''
  const { loading, addedSong, current } = useAppSelector(
    (state) => state.program,
  )

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  })

  const sensors = useSensors(touchSensor, mouseSensor)

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      setSongs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      alert('Выберите дату')
      return
    }
    if (songs.length === 0) {
      alert('Добавьте хотя бы 1 хвалу')
      return
    }

    const nameProgram =
      name.length > 0
        ? name
        : date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
          })

    if (isEdit) {
      try {
        await dispatch(
          updateProgramThunk({
            id: Number(id),
            data: {
              date: getISOString(date),
              songsId: songs.map((song) => song.id),
              name: nameProgram,
            },
          }),
        ).unwrap()
        navigate('/')
      } catch (error) {
        console.log(error)
        alert('Не удалось обновить программу')
      }
    } else {
      try {
        await dispatch(
          createProgramThunk({
            date: getISOString(date),
            name: nameProgram,
            songsId: songs.map((song) => song.id),
          }),
        ).unwrap()
        navigate('/')
      } catch (error) {
        console.log(error)
        alert('Не удалось создать программу')
      }
    }
  }

  const onDelete = (id: number) => {
    if (window.confirm('Вы действительно хотите удалить эту хвалу?')) {
      setSongs((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const onToggleSong = (isChecked: boolean, checkedSong: Song) => {
    if (isChecked) {
      setSongs((prev) => [...prev, checkedSong])
    } else {
      setSongs((prev) => prev.filter((s) => s.id !== checkedSong.id))
    }
  }

  useEffect(() => {
    if (!addedSong) return
    setSongs([addedSong])
    dispatch(destroyAddedSong())
  }, [addedSong, dispatch])

  useEffect(() => {
    if (!isEdit) return

    const load = async () => {
      const program = await dispatch(fetchProgram(Number(id))).unwrap()
      setName(program.name)
      setSongs(program.songs.map((s) => s.song))
      if (program.date) {
        setDate(new Date(program.date))
      }
    }

    load()
  }, [id, dispatch, isEdit])

  if (isEdit && !current && loading) return <Loading />

  if (isEdit && !loading && !current) {
    return (
      <p className="text-center text-muted-foreground text-lg py-2">
        Программа не найдена
      </p>
    )
  }

  return (
    <form
      onSubmit={submitHandler}
      className="py-4 space-y-2 flex flex-col pb-20"
    >
      <div className="flex gap-2 m-0">
        <div className="flex-1 space-y-2">
          <Label className="text-base font-semibold" htmlFor="name">
            Название
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-6 text-base mb-2 border-none bg-muted"
            id="name"
            placeholder={placeholder}
          />
        </div>
        <div className="shrink-0 space-y-2">
          <Label className="text-base font-semibold gap-0" htmlFor="date">
            Дата<span className="text-destructive">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker-range"
                className="justify-start font-normal h-12 rounded-md text-sm bg-muted dark:bg-input/30 border-none shadow-none"
              >
                <CalendarIcon />
                {date ? (
                  format(date, 'dd.MM.yyyy', { locale: ru })
                ) : (
                  <span className="text-muted-foreground">Выберите дату</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full rounded-md p-0" align="end">
              <Calendar
                className="p-2 w-full rounded-xl"
                locale={ru}
                mode="single"
                defaultMonth={date}
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <p className="text-xs flex gap-1.5 text-muted-foreground mb-6">
        <InfoIcon size={15} /> Название формируется автоматически на основе даты
      </p>
      <Label className="text-lg font-semibold gap-0">
        Хвалы<span className="text-destructive">*</span>
      </Label>

      <div className="px-2 pb-4 space-y-3">
        <ul className="space-y-3 px-2">
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={songs}>
              {songs.map((s) => (
                <SongItem
                  key={s.id}
                  isEdit={true}
                  item={s}
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
          <li className="text-center pt-1">
            <AddSong
              selectedIds={songs.map((s) => s.id)}
              onToggleSong={onToggleSong}
            />
          </li>
        </ul>
      </div>

      <Button
        disabled={loading}
        className="ml-auto bg-primary/15 text-primary"
        type="submit"
      >
        Сохранить
      </Button>
    </form>
  )
}
