import { AddSong } from '@/components/AddSong'
import { ProgramItem } from '@/components/ProgramItem'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { programs } from '@/mocks/programs'
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

export default function NewProgramPage() {
  const [items, setItems] = useState([...programs[0].songs])

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
    },
  })

  const sensors = useSensors(touchSensor)

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <form className="py-4 space-y-3">
      <Label className="text-xl font-semibold" htmlFor="name">
        Название:
      </Label>
      <Input
        className="px-3 py-5 text-lg mb-6"
        id="name"
        placeholder="Воскресное 27.12.2025"
      />
      <Label className="text-xl font-semibold">Хвалы:</Label>
      <ul className="space-y-3 px-2 mb-7">
        <DndContext
          modifiers={[restrictToVerticalAxis]}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={programs}>
            {items.map((program) => (
              <ProgramItem key={program.id} {...program} isEdit={true} />
            ))}
          </SortableContext>
        </DndContext>
        <li className="text-center pt-1 px-3">
          <AddSong />
        </li>
      </ul>
    </form>
  )
}
