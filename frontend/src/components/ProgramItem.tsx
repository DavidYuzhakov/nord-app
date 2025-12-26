import type { ProgramSong } from '@/models/Program'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2Icon } from 'lucide-react'

export function ProgramItem({
  song,
  id,
  isEdit,
}: ProgramSong & { isEdit: boolean }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: id,
    disabled: !isEdit,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      style={style}
      ref={setNodeRef}
      className={`flex items-center justify-between border-b border-border h-10 pb-3 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="text-[17px] font-medium">{song.name}</span>

      <div className="flex gap-2 items-center">
        {!isEdit ? (
          <>
            <span className="text-[14px] font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-third text-third">
              {song.bpm}
            </span>
            <span className="text-[14px] size-7 flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
              {song.key}
            </span>
          </>
        ) : (
          <>
            <span className="flex-1 text-[14px] size-7 flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
              {song.key}
            </span>
            <Trash2Icon
              onClick={() =>
                window.confirm('Вы действительно хотите удалить хвалу?')
              }
            />
            <button {...attributes} {...listeners} className="ml-3 space-y-1">
              <span className="block w-4 rounded-full h-0.5 bg-foreground" />
              <span className="block w-4 rounded-full h-0.5 bg-foreground" />
            </button>
          </>
        )}
      </div>
    </li>
  )
}
