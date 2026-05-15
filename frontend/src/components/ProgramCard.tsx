import { useEffect, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { ChevronDownIcon, PenIcon, Trash2Icon } from 'lucide-react'
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
import { Input } from './ui/input'

export function ProgramCard({
  id,
  name,
  songs,
  isOpenExternal,
  setOpenExternal,
}: Program & {
  isOpenExternal: boolean
  setOpenExternal: (id: number | null) => void
}) {
  const [selectedSongs, setSelectedSongs] = useState<Song[]>(
    songs.map((s) => s.song),
  )
  const [isEdit, setIsEdit] = useState(false)
  const [programName, setProgramName] = useState(name)

  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.program.loading)

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  })

  const sensors = useSensors(touchSensor, pointerSensor)

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
          data: { name: programName, songsId: selectedSongs.map((s) => s.id) },
        }),
      )
      setIsEdit(false)
    } catch (e) {
      console.log(e)
      alert('Не удалось сохранить программу')
    }
  }

  useEffect(() => {
    setIsEdit((prev) => (isOpenExternal ? prev : false))
  }, [isOpenExternal])

  return (
    <Collapsible
      key={id}
      open={isOpenExternal}
      onOpenChange={(open) => {
        setOpenExternal(open ? id : null)
      }}
      className="rounded-xl bg-secondary"
    >
      <CollapsibleTrigger asChild>
        <button
          disabled={isEdit}
          className="relative w-full group flex items-center gap-5 justify-between p-3"
        >
          <Input
            disabled={!isEdit}
            onChange={(e) => setProgramName(e.target.value)}
            value={programName}
            className={`text-lg md:text-lg font-semibold truncate shadow-none border-t-0 border-x-0 px-0 pt-0 rounded-none duration-200 transition-all focus-visible:border-border disabled:opacity-100 disabled:border-transparent dark:bg-transparent ${
              isOpenExternal ? 'text-foreground' : 'text-muted-foreground'
            }`}
          />
          <span className="absolute top-[78%] left-3 right-full group-has-focus-visible:right-3 duration-300 h-px bg-primary" />
          {!isEdit && (
            <ChevronDownIcon
              className={`transition-transform duration-200 ${
                isOpenExternal ? 'rotate-180' : 'stroke-muted-foreground'
              }`}
            />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="
          data-[state=closed]:animate-collapsible-up
          data-[state=open]:animate-collapsible-down
          overflow-hidden
        "
      >
        <div className="px-3 pb-3 space-y-3">
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
              className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md border border-dashed border-foreground/20 dark:border-border w-full text-center text-muted-foreground"
            >
              <PenIcon size={14} />
              изменить
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={deleteProgram}
                className="text-center px-2 py-1.5 rounded-md bg-destructive/15 text-destructive disabled:opacity-50 dark:font-medium"
              >
                <Trash2Icon />
              </button>
              <div className="space-x-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsEdit(false)}
                  className="self-end w-fit text-center bg-border text-muted-foreground px-3 py-1.5 rounded-md disabled:opacity-50 dark:font-medium"
                >
                  отменить
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={saveHandler}
                  className="w-fit text-center px-3 py-1.5 rounded-md bg-primary/15 dark:bg-primary dark:text-background text-primary disabled:opacity-50 dark:font-medium"
                >
                  сохранить
                </button>
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
