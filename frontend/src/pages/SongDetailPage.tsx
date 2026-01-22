import { Song } from '@/components/Song'
import { Button } from '@/components/ui/button'
import { programs } from '@/mocks/programs'
import { getStructureBg } from '@/utils/getStructureBg'
import { EditIcon, Headphones, PersonStanding } from 'lucide-react'
import { useParams } from 'react-router-dom'

export default function SongDetailPage() {
  const { id } = useParams()
  const songData = id ? programs[0].songs[Number(id)].song : null

  if (!songData) return 'Нет песни'

  return (
    <div className="-mx-3 space-y-3 pb-23">
      <div className="space-y-3 p-2 rounded-b-xl shadow-xs sticky top-0 z-10 bg-background">
        <div className="flex justify-between items-center gap-1">
          <h2 className="text-[22px] font-semibold truncate">
            {songData.name}
          </h2>
          <button type="button" className="bg-primary p-1.5 rounded-md">
            <EditIcon size={20} className="stroke-white" />
          </button>
        </div>
        {songData.structure && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(45px,1fr))] gap-px">
            {songData.structure.map((el, i) => (
              <div
                key={i}
                className={`relative aspect-square flex items-center justify-center text-white rounded-md ${getStructureBg(
                  el.text.replace(/\d/g, '').toLowerCase(),
                )}`}
              >
                <span className="uppercase text-center text-lg font-semibold">
                  {el.text}
                </span>
                {el.amount > 1 && (
                  <span className="absolute font-semibold top-1 right-1 text-xs translate-x-1/2 -translate-y-1/2 text-foreground z-10 text-[12px] bg-secondary px-1 border rounded-full">
                    {el.amount}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Song isEdit song={songData} />
      <div className="px-3 flex gap-2 items-cetner flex-wrap">
        <Button type="button" className="text-base">
          <a
            className="flex items-center gap-2"
            href="https://t.me/c/3600117652/20"
            target="_blank"
          >
            Слушать аудио <Headphones />
          </a>
        </Button>
        <Button type="button" className="text-base bg-third">
          <a
            className="flex items-center gap-2"
            href="https://www.youtube.com/watch?v=4eKk6dyTqgY&list=RD4eKk6dyTqgY&start_radio=1"
            target="_blank"
          >
            Юльтон <PersonStanding className="size-5" />
          </a>
        </Button>
      </div>
    </div>
  )
}
