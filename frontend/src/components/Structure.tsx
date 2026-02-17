import {
  DndContext,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { CSS } from '@dnd-kit/utilities'
import { useRef, useState } from 'react'
import { getStructureBg } from '@/utils/getStructureBg'
import { Dialog, DialogContent } from './ui/dialog'
import type { SongStructureItem } from '@/models/Song'

const sections = [
  { label: 'вступление', value: 'в' },
  { label: 'куплет', value: 'к' },
  { label: 'пред-припев', value: 'пп' },
  { label: 'припев', value: 'п' },
  { label: 'проигрыш', value: 'прг' },
  { label: 'бридж', value: 'б' },
  { label: 'тэг', value: 'т' },
]

function DraggableItem({ item }: { item: { label: string; value: string } }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.value,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <Badge
      variant={'outline'}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="py-1 px-4 text-base select-none"
    >
      {item.label}
    </Badge>
  )
}

function SortableStructureItem({
  item,
  onRemove,
  onClick,
}: {
  item: SongStructureItem
  onRemove: (id: string) => void
  onClick: (item: SongStructureItem) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <div
      onClick={() => onClick(item)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative aspect-square flex items-center justify-center text-white rounded-md ${getStructureBg(
        item.text.replace(/\d/g, '').toLowerCase(),
      )} ${isDragging ? 'opacity-60' : ''}`}
    >
      <span className="uppercase text-center text-lg font-semibold">
        {item.text}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(item.id)
        }}
        onPointerDown={(e) => {
          e.stopPropagation()
        }}
        className="absolute -top-1 -right-1 bg-destructive shadow-sm rounded-full p-0.5"
      >
        <XIcon size={15} />
      </button>
      {item.amount > 1 && (
        <span className="absolute font-semibold top-1 right-7 text-xs translate-x-1/2 -translate-y-1/2 text-foreground z-10 text-[12px] bg-white px-1 border rounded-full">
          {item.amount}
        </span>
      )}
    </div>
  )
}

export function Droppable({
  items,
  onRemove,
  onItemClick,
}: {
  items: SongStructureItem[]
  onRemove: (id: string) => void
  onItemClick: (item: SongStructureItem) => void
}) {
  const { isOver, setNodeRef } = useDroppable({ id: 'droppable' })

  return (
    <div
      ref={setNodeRef}
      className={`border rounded border-dashed p-0.5 ${isOver ? 'bg-muted ' : ''}`}
    >
      {items.length === 0 && (
        <div
          className={`flex items-center justify-center h-20 text-muted-foreground text-sm`}
        >
          <div className="bg-secondary p-1 rounded-full border border-dashed">
            <PlusIcon />
          </div>
        </div>
      )}
      <div
        className={`grid ${items.length > 5 ? 'grid-cols-[repeat(auto-fit,minmax(46px,1fr))]' : 'grid-cols-[repeat(auto-fit,minmax(50px,60px))]'} gap-px`}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          {items.map((item) => (
            <SortableStructureItem
              key={item.id}
              item={item}
              onRemove={onRemove}
              onClick={onItemClick}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function Structure({
  droppedItems,
  setDroppedItems,
}: {
  droppedItems: SongStructureItem[]
  setDroppedItems: React.Dispatch<React.SetStateAction<SongStructureItem[]>>
}) {
  const idCounter = useRef(0)
  const [selectedItem, setSelectedItem] = useState<SongStructureItem | null>(
    null,
  )

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  })

  const sensors = useSensors(touchSensor)

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e

    if (!over) return

    const isFromPalette = sections.some(
      (section) => section.value === active.id,
    )
    const isFromStructure = droppedItems.some((item) => item.id === active.id)

    // Сортировка уже добавленных элементов
    if (isFromStructure) {
      const overIsItem = droppedItems.some((item) => item.id === over.id)

      if (!overIsItem) return

      const oldIndex = droppedItems.findIndex((item) => item.id === active.id)
      const newIndex = droppedItems.findIndex((item) => item.id === over.id)

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

      setDroppedItems((items) => arrayMove(items, oldIndex, newIndex))
      return
    }

    // Перетаскивание из палитры в Droppable
    if (isFromPalette) {
      const section = sections.find((s) => s.value === active.id)
      if (!section) return

      setDroppedItems((prev) => {
        const nextId = `structure-${idCounter.current++}`
        const newItem: SongStructureItem = {
          id: nextId,
          text: section.value,
          title: section.label,
          amount: 1,
        }

        return [...prev, newItem]
      })
    }
  }

  const handleRemove = (id: string) => {
    setDroppedItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleItemClick = (item: SongStructureItem) => {
    setSelectedItem(item)
  }

  const handleChangeItem = (item: SongStructureItem) => {
    setSelectedItem(() => {
      setDroppedItems((prev) =>
        prev.map((el) => (el.id === item.id ? item : el)),
      )
      return item
    })
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Droppable
        onRemove={handleRemove}
        items={droppedItems}
        onItemClick={handleItemClick}
      />
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <DraggableItem key={section.value} item={section} />
        ))}
      </div>
      <Dialog
        open={Boolean(selectedItem)}
        onOpenChange={() => setSelectedItem(null)}
      >
        <DialogContent className="py-4 px-3" showCloseButton={false}>
          {selectedItem ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium ">
                  Номер раздела "{selectedItem.title}":
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={isNaN(parseInt(selectedItem.text[0]))}
                    onClick={() =>
                      handleChangeItem({
                        ...selectedItem,
                        text:
                          selectedItem.text[0] === '1'
                            ? selectedItem.text.slice(1)
                            : parseInt(selectedItem.text[0]) -
                              1 +
                              selectedItem.text.slice(1),
                      })
                    }
                    className="bg-foreground text-white rounded-full p-1 disabled:opacity-60"
                    type="button"
                  >
                    <MinusIcon size={19} />
                  </button>
                  <span>
                    {isNaN(parseInt(selectedItem.text[0]))
                      ? '0'
                      : selectedItem.text[0]}
                  </span>
                  <button
                    onClick={() =>
                      handleChangeItem({
                        ...selectedItem,
                        text: isNaN(parseInt(selectedItem.text))
                          ? `1${selectedItem.text}`
                          : Math.min(9, parseInt(selectedItem.text[0]) + 1) +
                            selectedItem.text.slice(1),
                      })
                    }
                    className="bg-foreground text-white rounded-full p-1"
                    type="button"
                  >
                    <PlusIcon size={19} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium ">Количество повторений:</div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={selectedItem.amount < 2}
                    onClick={() =>
                      handleChangeItem({
                        ...selectedItem,
                        amount: --selectedItem.amount,
                      })
                    }
                    className="bg-foreground text-white rounded-full p-1 disabled:opacity-60"
                    type="button"
                  >
                    <MinusIcon size={19} />
                  </button>
                  <span>{selectedItem.amount}</span>
                  <button
                    onClick={() =>
                      handleChangeItem({
                        ...selectedItem,
                        amount: ++selectedItem.amount,
                      })
                    }
                    className="bg-foreground text-white rounded-full p-1"
                    type="button"
                  >
                    <PlusIcon size={19} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            'Ошибка'
          )}
        </DialogContent>
      </Dialog>
    </DndContext>
  )
}
