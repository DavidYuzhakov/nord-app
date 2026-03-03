import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { Program } from '@/models/Program'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateProgramThunk } from '@/store/reducers/programSlice'
import { fetchSongs } from '@/store/reducers/songSlice'
import { Plus, PlusCircleIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SongsPage() {
  const { items, loading } = useAppSelector((state) => state.song)
  const programs = useAppSelector((state) => state.program.items)
  const dispatch = useAppDispatch()

  const [value, setValue] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(
      fetchSongs({ search: value.trim().length > 0 ? value : undefined }),
    )
  }, [value, dispatch])

  const addSongToProgram = (
    e: React.MouseEvent,
    { id, name, songs }: Program,
    songId: number,
  ) => {
    e.stopPropagation()
    if (songs.some((s) => s.songId === songId)) return
    dispatch(
      updateProgramThunk({
        id,
        data: {
          name,
          songsId: [...songs.map((s) => s.songId), songId],
        },
      }),
    )
  }

  return (
    <div className="pt-19 pb-25 space-y-4">
      <div className="flex items-center gap-1 fixed top-4 right-3 left-3 max-w-md mx-auto z-60">
        <div className="relative w-full">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="py-5 px-5 pr-10 rounded-full bg-secondary/20 duration-200 drop-shadow-xs backdrop-blur-xs"
            placeholder="Введите название хвалы..."
          />
          {value.length > 0 && (
            <XIcon
              onClick={() => setValue('')}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            />
          )}
        </div>
        <button
          className="shrink-0 p-0 flex items-center justify-center rounded-full size-11 bg-secondary/20 backdrop-blur-xs border drop-shadow-xs"
          type="button"
        >
          <SearchIcon />
        </button>
        <button
          onClick={() => navigate('/song/create')}
          className="shrink-0 p-0 flex items-center justify-center rounded-full size-11 bg-primary drop-shadow-xs text-white"
          type="button"
        >
          <PlusIcon />
        </button>
      </div>
      <div>
        {!loading && items.length === 0 && (
          <p className="text-center text-slate-500">Список пуст</p>
        )}
        {loading &&
          items.length === 0 &&
          [...new Array(10)].map((_, i) => (
            <div
              className="p-3 border-b border-slate-100 flex justify-between items-center gap-2"
              key={i}
            >
              <Skeleton className="w-2/3 h-7" />
              <Skeleton className="size-8 rounded-full" />
            </div>
          ))}
        {items.map((song) => (
          <div
            onClick={() => navigate(`/song/${song.id}`)}
            className="border-b border-slate-100 py-3 px-3 flex items-center justify-between gap-2"
            key={song.id}
          >
            <div className="flex items-center gap-2 truncate">
              <h4 className="font-semibold truncate">{song.name}</h4>
              <span className="text-[14px] flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
                {song.key}
              </span>
              <span className="text-[14px] font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-third text-third text-nowrap">
                {song.bpm}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full shadow-xs"
                  variant={'secondary'}
                  size={'icon-sm'}
                >
                  <Plus className="size-5 stroke-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                className="bg-white/20 backdrop-blur-lg"
              >
                {programs.map((program) => (
                  <DropdownMenuItem
                    className="text-base focus:bg-transparent font-medium border-b rounded-none py-3"
                    onClick={(e) => addSongToProgram(e, program, song.id)}
                  >
                    {program.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('/new-program')
                  }}
                  className="text-base focus:text-primary text-primary text-center focus:bg-transparent font-semibold border-b rounded-none py-3"
                >
                  Новая программа
                  <PlusCircleIcon className="size-6 stroke-primary" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  )
}
