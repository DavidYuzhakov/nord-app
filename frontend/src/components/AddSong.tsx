import { PlusCircleIcon, SearchIcon, XIcon } from 'lucide-react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useEffect, useState } from 'react'
import { Checkbox } from './ui/checkbox'
import { fetchSongs } from '@/store/reducers/songSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useDebounce } from '@/hook/useDebounce'
import type { Song } from '@/models/Song'

interface AddSongProps {
  selectedIds: number[]
  onToggleSong: (isChecked: boolean, checkedSong: Song) => void
}

export function AddSong({ onToggleSong, selectedIds }: AddSongProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { items } = useAppSelector((state) => state.song)

  useEffect(() => {
    dispatch(
      fetchSongs({
        search: debouncedSearch.trim().length > 0 ? debouncedSearch : undefined,
      }),
    )
  }, [debouncedSearch, dispatch])

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        <span className="flex items-center gap-2 justify-center text-primary font-bold">
          Новая хвала <PlusCircleIcon />
        </span>
      </button>

      <div
        className={`fixed max-w-md mx-auto left-2 right-2 z-11 rounded-xl bg-white px-4 py-3 space-y-2 duration-200 ${
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-7 focus-visible:ring-0"
            placeholder="Введите название хвалы"
          />
          {search.length > 0 && (
            <XIcon
              onClick={() => setSearch('')}
              size={20}
              className="absolute top-1/2 -translate-1/2 -right-1 "
            />
          )}
        </div>
        <ul className="border max-h-80 rounded-md overflow-y-auto px-3 py-2">
          {items.map((song) => (
            <li
              className="flex items-center gap-1.5 border-b border-accent py-2"
              key={song.id}
            >
              <span className="truncate font-medium">{song.name}</span>
              <span className="text-[14px] flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
                {song.key}
              </span>
              <span className="text-[14px] font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-third text-third">
                {song.bpm}
              </span>
              <Checkbox
                className="ml-auto size-6"
                checked={selectedIds.includes(song.id)}
                onCheckedChange={(value) => onToggleSong(Boolean(value), song)}
              />
            </li>
          ))}
        </ul>
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
