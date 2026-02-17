import { Song } from '@/components/Song'
import { Button } from '@/components/ui/button'
import { useGoBack } from '@/hook/useGoBack'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchSong } from '@/store/reducers/songSlice'
import { getStructureBg } from '@/utils/getStructureBg'
import { ChevronLeft, EditIcon, Headphones, PersonStanding } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function SongDetailPage() {
  const { id } = useParams()
  const goBack = useGoBack()
  const navigate = useNavigate()
  const { current, loading } = useAppSelector((state) => state.song)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (id) {
      dispatch(fetchSong(Number(id)))
    }
  }, [id])

  if (loading) return 'Загрузка'
  if (!current) return 'Нет песни'

  return (
    <div className="-mx-3 space-y-3 pb-23">
      <div className="space-y-3 p-2 rounded-b-xl shadow-xs sticky top-0 z-10 bg-background">
        <div className="flex justify-between items-center gap-1">
          <div className="flex items-center gap-1 truncate">
            <button
              onClick={() => goBack()}
              className="shrink-0 p-0 flex items-center justify-center rounded-full size-10 bg-secondary/20 backdrop-blur-xs border drop-shadow-xs"
              type="button"
            >
              <ChevronLeft />
            </button>
            <h2 className="text-[22px] font-semibold">{current.name}</h2>
          </div>
          <button
            onClick={() => navigate(`/song/${current.id}/edit`)}
            type="button"
            className="bg-primary p-1.5 rounded-md"
          >
            <EditIcon size={20} className="stroke-white" />
          </button>
        </div>
        {current.structure && current.structure.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(45px,1fr))] gap-px">
            {current.structure.map((el, i) => (
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
      <Song isEdit song={current} />
      <div className="px-3 flex gap-2 items-cetner flex-wrap">
        {current.audio && (
          <Button type="button" className="text-base">
            <a
              className="flex items-center gap-2"
              href={current.audio}
              target="_blank"
            >
              Слушать аудио <Headphones />
            </a>
          </Button>
        )}
        {current.danceVideo && (
          <Button type="button" className="text-base bg-third">
            <a
              className="flex items-center gap-2"
              href={current.danceVideo}
              target="_blank"
            >
              Юльтон <PersonStanding className="size-5" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
