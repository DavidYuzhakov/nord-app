import { Header } from '@/components/Header'
import { Loading } from '@/components/Loading'
import { Song } from '@/components/Song'
import { Button } from '@/components/ui/button'
import { useGoBack } from '@/hooks/useGoBack'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearCurrent, fetchSong } from '@/store/reducers/songSlice'
import {
  ChevronLeft,
  Headphones,
  PencilIcon,
  PersonStanding,
} from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function SongDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const goBack = useGoBack()
  const { current, loading } = useAppSelector((state) => state.song)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (id) {
      dispatch(fetchSong(Number(id)))
    }
  }, [id, dispatch])

  if (loading && !current) return <Loading />
  if (!current)
    return (
      <p className="text-center text-muted-foreground text-lg py-2">
        Песня не найдена
      </p>
    )

  return (
    <div className="-mx-3 space-y-3 pb-16">
      <Header structure={current.structure} songId={current.id}>
        <div className="flex items-center gap-1 truncate">
          <button
            onClick={() => {
              goBack()
              dispatch(clearCurrent())
            }}
            className="shrink-0 p-0 flex items-center justify-center rounded-full size-10 bg-secondary/20 backdrop-blur-xs drop-shadow-xs border"
            type="button"
          >
            <ChevronLeft />
          </button>
          <h2 className="text-[22px] font-semibold truncate">{current.name}</h2>
        </div>
        <button
          onClick={() => navigate(`/song/${current.id}/edit`)}
          type="button"
          className="p-2 rounded-md bg-secondary/20 backdrop-blur-xs drop-shadow-xs border"
        >
          <PencilIcon size={20} className="" />
        </button>
      </Header>
      <Song isEdit song={current} />
      <div className="px-3 pb-2 flex gap-2 items-cetner flex-wrap">
        {current.audio && (
          <Button
            type="button"
            className="text-base bg-primary/15 text-primary border-none"
          >
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
          <Button type="button" className="text-base bg-third/15 text-third">
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
