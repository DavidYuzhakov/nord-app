import {
  DndContext,
  MouseSensor,
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
import { v4 as uuid } from 'uuid'
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { getStructureBg } from '@/utils/getStructureBg'
import { Dialog, DialogContent } from './ui/dialog'
import type { SongStructureItem } from '@/models/Song'
import { DialogTitle } from '@radix-ui/react-dialog'

const sections = [
  { label: 'вступление', value: 'в' },
  { label: 'куплет', value: 'к' },
  { label: 'предприпев', value: 'пп' },
  { label: 'припев', value: 'п' },
  { label: 'проигрыш', value: 'прг' },
  { label: 'бридж', value: 'б' },
  { label: 'тег', value: 'т' },
]

function DraggableItem({ item }: { item: { label: string; value: string } }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
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
      className={`py-1 px-4 text-base select-none cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-60' : ''}`}
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
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        onClick(item)
      }}
      className={`relative select-none py-1.5 flex items-center justify-center text-white dark:text-background/70 rounded-md ${getStructureBg(
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
        className="absolute -top-1.5 -right-1 bg-destructive shadow-sm rounded-full p-0.5"
      >
        <XIcon size={15} />
      </button>
      {item.amount > 1 && (
        <span className="absolute font-semibold top-0.5 right-7 text-xs translate-x-1/2 -translate-y-1/2 text-foreground z-10 text-[12px] bg-white px-1 dark:bg-muted border rounded-full">
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
          className={`flex items-center justify-center h-10 text-muted-foreground text-sm`}
        />
      )}
      <div
        className={`grid ${items.length > 5 ? 'grid-cols-[repeat(auto-fit,minmax(50px,1fr))]' : 'grid-cols-[repeat(auto-fit,minmax(50px,60px))]'} gap-0.5`}
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
  const [selectedItem, setSelectedItem] = useState<SongStructureItem | null>(
    null,
  )

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 7,
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
        const nextId = uuid()
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
        <DialogContent className="py-4 px-3 max-w-xs" showCloseButton={false}>
          {selectedItem ? (
            <div className="space-y-5">
              <DialogTitle
                className={`font-semibold text-xl uppercase text-center rounded-full text-white dark:text-background/70 ${getStructureBg(selectedItem.text.replace(/\d/g, '').toLowerCase())} `}
              >
                {selectedItem.title}
              </DialogTitle>
              <div>
                <div className="font-medium text-sm text-muted-foreground mb-2">
                  Количество
                </div>
                <div className="flex items-center justify-between gap-3 bg-muted/70 w-full p-2 rounded-lg">
                  <button
                    disabled={selectedItem.amount < 2}
                    onClick={() =>
                      handleChangeItem({
                        ...selectedItem,
                        amount: Number(selectedItem.amount) - 1,
                      })
                    }
                    className="bg-border rounded-md p-2 disabled:opacity-60"
                    type="button"
                  >
                    <MinusIcon size={30} />
                  </button>
                  <span className="text-3xl font-semibold">
                    {selectedItem.amount}
                  </span>
                  <button
                    onClick={() =>
                      handleChangeItem({
                        ...selectedItem,
                        amount: Number(selectedItem.amount) + 1,
                      })
                    }
                    className="bg-border rounded-md p-2 disabled:opacity-60"
                    type="button"
                  >
                    <PlusIcon size={30} />
                  </button>
                </div>
              </div>
              <div>
                <div className="font-medium text-sm text-muted-foreground mb-2">
                  Номер
                </div>
                <div className="flex items-center justify-between gap-3 bg-muted/70 w-full p-2 rounded-lg">
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
                    className="bg-border rounded-md p-2 disabled:opacity-60"
                    type="button"
                  >
                    <MinusIcon size={30} />
                  </button>
                  <span className="text-3xl font-semibold">
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
                    className="bg-border rounded-md p-2 disabled:opacity-60"
                    type="button"
                  >
                    <PlusIcon size={30} />
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
