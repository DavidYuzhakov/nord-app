import { PlusCircleIcon, SearchIcon, XIcon } from 'lucide-react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useState } from 'react'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'

const songs = [
  { name: 'Славьте Его', key: 'C', bpm: 143 },
  { name: 'С днем рождения, Иисус!', key: 'Ab', bpm: 133 },
  { name: 'Радуйся мир', key: 'F', bpm: 150 },
  { name: 'Вся хвала', key: 'H', bpm: 100 },
  { name: 'Пою я аллилуйя', key: 'D', bpm: 140 },
  { name: 'Достоин Ты', key: 'C', bpm: 88 },
  { name: 'Рядом с Тобой', key: 'E', bpm: 80 },
  { name: 'Рядом с Тобой', key: 'E', bpm: 80 },
  { name: 'Рядом с Тобой', key: 'E', bpm: 80 },
  { name: 'Рядом с Тобой', key: 'E', bpm: 80 },
  { name: 'Рядом с Тобой', key: 'E', bpm: 80 },
]

export function AddSong() {
  const [name, setName] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <span className="flex items-center gap-2 justify-center text-primary font-bold">
          Новая хвала <PlusCircleIcon />
        </span>
      </button>

      <div
        className={`fixed left-2 right-2 z-11 rounded-xl bg-white px-4 py-3 space-y-2 duration-200 ${
          isOpen ? 'opacity-100 visible top-2' : 'opacity-0 invisible -top-2'
        } `}
      >
        <Label htmlFor="song">
          <h4 className="text-xl font-semibold">Хвала:</h4>
        </Label>
        <div className="relative">
          <SearchIcon
            size={20}
            className="absolute top-1/2 -translate-y-1/2 left-2 stroke-muted-foreground"
          />
          <Input
            id="song"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-8 pr-7 focus-visible:ring-0"
            placeholder="Введите название хвалы"
          />
          {name.length > 0 && (
            <XIcon
              onClick={() => setName('')}
              size={20}
              className="absolute top-1/2 -translate-1/2 -right-1 "
            />
          )}
        </div>
        <ul className="border max-h-80 rounded-md overflow-y-auto px-3 py-2">
          {songs.map((song) => (
            <li
              className="flex items-center gap-1.5 border-b font-medium border-accent py-2"
              key={song.name}
            >
              {song.name}
              <span className=" text-[14px] size-7 flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
                {song.key}
              </span>
              <span className="text-[14px] font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-third text-third">
                {song.bpm}
              </span>
              <Checkbox className="ml-auto size-6" />
            </li>
          ))}
        </ul>

        <Button
          className="ml-auto block"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          Добавить
        </Button>
      </div>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed w-full h-full top-0 left-0 bg-black/50 z-10 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } duration-200`}
      />
    </>
  )
}
