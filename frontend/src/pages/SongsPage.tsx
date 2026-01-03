import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { programs } from '@/mocks/programs'
import { mockSongs } from '@/mocks/songs'
import { Plus, PlusCircleIcon, SearchIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SongsPage() {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  return (
    <div className="pt-19 pb-25 space-y-4">
      <div className="flex items-center gap-2 fixed top-4 right-3 left-3 z-60">
        <div className="relative w-full">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="py-6 px-5 pr-10 rounded-full bg-secondary/20 duration-200 drop-shadow-xs backdrop-blur-xs"
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
          className="shrink-0 p-0 flex items-center justify-center rounded-full size-[50px] bg-secondary/20 backdrop-blur-xs border drop-shadow-xs"
          type="button"
        >
          <SearchIcon />
        </button>
      </div>
      <div className="space-y-3">
        {mockSongs.map((song) => (
          <div
            className="border-b py-3 px-3 flex items-center justify-between gap-2"
            key={song.id}
          >
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold truncate">{song.name}</h4>
              <span className="text-[14px] flex items-center justify-center font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-primary text-primary">
                {song.key}
              </span>
              <span className="text-[14px] font-semibold px-2 py-0.5 rounded-md border-[1.5px] border-third text-third text-nowrap">
                {song.bpm}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={'icon-lg'}>
                  <Plus className="size-7" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="end"
                className="bg-white/20 backdrop-blur-lg"
              >
                {programs.map((program) => (
                  <DropdownMenuItem className="text-base focus:bg-transparent font-medium border-b rounded-none py-3">
                    {program.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => navigate('/new-program')}
                  className="text-base focus:text-primary text-primary text-center focus:bg-transparent font-semibold border-b rounded-none py-3"
                >
                  Новая программа{' '}
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
