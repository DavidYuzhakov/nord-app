import { useState } from 'react'
import {
  DndContext,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { ChevronDownIcon, PenBoxIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { SongItem } from './SongItem'
import type { Program } from '@/models/Program'

import { AddSong } from './AddSong'
import type { Song } from '@/models/Song'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  deleteProgramThunk,
  updateProgramThunk,
} from '@/store/reducers/programSlice'

export function ProgramCard({ id, name, songs }: Program) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [selectedSongs, setSelectedSongs] = useState<Song[]>(
    songs.map((s) => s.song),
  )
  const [isEdit, setIsEdit] = useState(false)
  const isOpen = activeId === id

  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.program.loading)

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
      setSelectedSongs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const deleteHandler = (id: number) => {
    if (window.confirm('Вы действительно хотите удалить хвалу?')) {
      setSelectedSongs((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const deleteProgram = () => {
    if (window.confirm('Вы действительно хотите удалить программу?')) {
      dispatch(deleteProgramThunk(id))
    }
  }

  const onToggleSong = (isChecked: boolean, checkedSong: Song) => {
    if (isChecked) {
      setSelectedSongs((prev) => [...prev, checkedSong])
    } else {
      setSelectedSongs((prev) => prev.filter((s) => s.id !== checkedSong.id))
    }
  }

  const saveHandler = async () => {
    try {
      await dispatch(
        updateProgramThunk({
          id,
          data: { name, songsId: selectedSongs.map((s) => s.id) },
        }),
      )
      setIsEdit(false)
    } catch (e) {
      console.log(e)
      alert('Не удалось сохранить программу')
    }
  }

  return (
    <Collapsible
      key={id}
      open={isOpen}
      onOpenChange={(open) => setActiveId(open ? id : null)}
      className="rounded-xl border border-border/40 bg-secondary"
    >
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between p-4">
          <span
            className={`text-lg font-semibold truncate duration-200 ${
              isOpen ? '' : 'text-muted-foreground'
            }`}
          >
            {name}
          </span>
          <ChevronDownIcon
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'stroke-muted-foreground'
            }`}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="
          data-[state=closed]:animate-collapsible-up
          data-[state=open]:animate-collapsible-down
          overflow-hidden
        "
      >
        <div className="px-4 pb-4 space-y-3">
          <ul className="space-y-3 px-2 mb-7">
            <DndContext
              modifiers={[restrictToVerticalAxis]}
              sensors={sensors}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={selectedSongs}>
                {selectedSongs.map((s) => (
                  <SongItem
                    key={s.id}
                    item={s}
                    onDelete={deleteHandler}
                    isEdit={isEdit}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {isEdit && (
              <li className="text-center pt-1 px-3">
                <AddSong
                  selectedIds={selectedSongs.map((s) => s.id)}
                  onToggleSong={onToggleSong}
                />
              </li>
            )}
          </ul>

          {!isEdit ? (
            <button
              onClick={() => setIsEdit(true)}
              className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-background"
            >
              изменить <PenBoxIcon size={17} />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={deleteProgram}
                className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-md bg-destructive text-background disabled:bg-destructive/60"
              >
                удалить
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={saveHandler}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-background disabled:bg-primary/60"
              >
                сохранить
              </button>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
