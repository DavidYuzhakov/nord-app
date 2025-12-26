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
import { ProgramItem } from './ProgramItem'
import type { Program } from '@/models/Program'

import { AddSong } from './AddSong'

export function ProgramCard({ id, name, songs }: Program) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [programs, setPrograms] = useState(
    [...songs].sort((a, b) => a.order - b.order)
  )
  const [isEdit, setIsEdit] = useState(false)

  const isOpen = activeId === id

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
      setPrograms((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
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
              <SortableContext items={programs}>
                {programs.map((program) => (
                  <ProgramItem key={program.id} {...program} isEdit={isEdit} />
                ))}
              </SortableContext>
            </DndContext>
            {isEdit && (
              <li className="text-center pt-1 px-3">
                <AddSong />
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
            <button
              type="submit"
              onClick={() => setIsEdit(false)}
              className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-background"
            >
              сохранить
            </button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
