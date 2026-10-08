import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import type { Program } from '@/models/Program'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchPrograms,
  insertAddedSong,
  updateProgramThunk,
} from '@/store/reducers/programSlice'
import { fetchSongs } from '@/store/reducers/songSlice'
import {
  GaugeIcon,
  Music2Icon,
  Plus,
  PlusIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SongsPage = () => {
  const { items, loading } = useAppSelector((state) => state.song)
  const programs = useAppSelector((state) => state.program.items)
  const dispatch = useAppDispatch()

  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 500)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(
      fetchSongs({
        search:
          debouncedValue.trim().length > 0 ? debouncedValue.trim() : undefined,
      }),
    )
  }, [debouncedValue, dispatch])

  useEffect(() => {
    if (programs.length > 0) return
    dispatch(fetchPrograms())
  }, [dispatch, programs])

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
    <div className="py-16 space-y-4">
      <div className="flex items-center gap-1 fixed top-4 right-3 left-3 max-w-md mx-auto z-60">
        <div className="relative w-full">
          <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-2 z-20 stroke-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="py-5 px-10 border-background/50 border-2 rounded-full bg-secondary/60 duration-200 drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] backdrop-blur-xs text-foreground focus-visible:border-background/50 dark:border-muted/50"
            placeholder="Введите название хвалы..."
          />
          {value.length > 0 && (
            <XIcon
              onClick={() => setValue('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 stroke-muted-foreground"
            />
          )}
        </div>
        <button
          onClick={() => navigate('/song/create')}
          className="shrink-0 p-0 flex items-center justify-center rounded-full size-11 bg-primary/20 drop-shadow-xs text-primary backdrop-blur-xs"
          type="button"
        >
          <PlusIcon />
        </button>
      </div>
      <div>
        {!loading && items.length === 0 && (
          <div className="mx-auto pt-10 text-center">
            <h5 className="font-medium text-xl -mb-6">Песня не найдена</h5>
            <img
              src="./song-not-found.png"
              alt="песня не найдена"
              className="max-w-[300px] mx-auto"
            />
          </div>
        )}
        {loading &&
          items.length === 0 &&
          [...new Array(10)].map((_, i) => (
            <div
              className="p-3 flex justify-between items-center gap-2"
              key={i}
            >
              <div className="w-full space-y-2">
                <Skeleton className="w-4/5 h-5" />
                <div className="w-full flex gap-3 items-center">
                  <Skeleton className="w-[60px] h-5" />
                  <Skeleton className="w-[60px] h-5" />
                </div>
              </div>
              <Skeleton className="size-8 rounded-full" />
            </div>
          ))}
        {items.map((song) => (
          <div
            onClick={() => navigate(`/song/${song.id}`)}
            className="py-3 border-b border-muted/30 px-3 flex items-center justify-between gap-2 select-none"
            key={song.id}
          >
            <div className="truncate space-y-1">
              <h4 className="font-semibold truncate select-none">
                {song.name}
              </h4>
              <div className="flex gap-3">
                <span className="text-[14px] font-semibold px-2 pr-2.5 py-0.5 rounded-md text-primary bg-primary/10 flex gap-1 items-center">
                  <Music2Icon size={15} />
                  {song.key}
                </span>
                <span className="text-[14px] font-semibold px-2 py-0.5 rounded-md text-third text-nowrap bg-third/15 flex gap-1 items-center">
                  <GaugeIcon size={15} />
                  {song.bpm}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full shadow-xs"
                  variant={'secondary'}
                  size={'icon-sm'}
                >
                  <Plus className="size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                className="bg-background/20 backdrop-blur-lg"
              >
                {programs
                  .filter((program) => !program.isArchived)
                  .map((program) => (
                    <DropdownMenuItem
                      className="text-base focus:bg-transparent font-medium border-b border-border/50 rounded-none py-3"
                      onClick={(e) => addSongToProgram(e, program, song.id)}
                    >
                      {program.name}
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch(insertAddedSong(song))
                    navigate('/program/create')
                  }}
                  className="text-base focus:text-primary text-primary text-center focus:bg-transparent font-semibold rounded-none py-3"
                >
                  Новая программа
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SongsPage
