import { AddSong } from '@/components/AddSong'
import { SongItem } from '@/components/SongItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Song } from '@/models/Song'
import { useAppDispatch } from '@/store/hooks'
import { createProgramThunk } from '@/store/reducers/programSlice'
import {
  DndContext,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewProgramPage() {
  const [name, setName] = useState('')
  const [songs, setSongs] = useState<Song[]>([])

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })

  const sensors = useSensors(touchSensor)

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

  const submitHandler = async () => {
    try {
      await dispatch(
        createProgramThunk({
          name,
          songsId: songs.map((song) => song.id),
        }),
      ).unwrap()
      navigate('/')
    } catch (error) {
      console.log(error)
      alert('Не удалось создать программу')
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

  console.log(songs)

  return (
    <form onSubmit={submitHandler} className="py-4 space-y-3 flex flex-col">
      <Label className="text-xl font-semibold" htmlFor="name">
        Название:
      </Label>
      <Input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-5 text-lg mb-6"
        id="name"
        placeholder="Воскресное 27.12.2025"
      />
      <Label className="text-xl font-semibold">Хвалы:</Label>

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
          <li className="text-center pt-1 pb-3 border-b border-primary">
            <AddSong
              selectedIds={songs.map((s) => s.id)}
              onToggleSong={onToggleSong}
            />
          </li>
        </ul>
      </div>

      <Button className="ml-auto" type="submit">
        Сохранить
      </Button>
    </form>
  )
}
