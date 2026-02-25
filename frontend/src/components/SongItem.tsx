import type { Song } from '@/models/Song'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SongItemProps {
  isEdit: boolean
  onDelete: (id: number) => void
  item: Song
}

export function SongItem({ item, isEdit, onDelete }: SongItemProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: item.id,
    disabled: !isEdit,
  })

  const navigate = useNavigate()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      style={style}
      onClick={() => navigate(`/song/${item.id}`)}
      ref={setNodeRef}
      className={`flex items-center gap-1 justify-between border-b border-border h-10 pb-3 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="text-[17px] font-medium truncate">{item.name}</span>

      <div className="flex gap-2 items-center">
        {!isEdit ? (
          <>
            <span className="text-[14px] font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-third text-third">
              {item.bpm}
            </span>
            <span className="text-[14px] flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
              {item.key}
            </span>
          </>
        ) : (
          <>
            <span className="flex-1 text-[14px] flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
              {item.key}
            </span>
            <Trash2Icon
              onClick={(e) => {
                e.stopPropagation()
                onDelete(item.id)
              }}
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
