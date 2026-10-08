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
  Share2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function SongDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const goBack = useGoBack()
  const [isCopied, setIsCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const sharingRef = useRef(false)
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

  const shareSong = async () => {
    if (sharingRef.current) return

    sharingRef.current = true
    setIsSharing(true)
    const url = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title: current.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        setIsCopied(true)
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      alert('Не удалось поделиться песней. Попробуйте ещё раз')
    } finally {
      sharingRef.current = false
      setIsSharing(false)
    }
  }

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
      <div className="px-3 pb-2 grid grid-cols-2 gap-2">
        {current.audio && (
          <Button
            type="button"
            onClick={() => window.open(current.audio)}
            className="w-full bg-primary/15 text-primary border-none cursor-pointer"
          >
            Слушать аудио <Headphones />
          </Button>
        )}
        {current.danceVideo && (
          <Button onClick={() => window.open(current.danceVideo)} type="button" className="w-full text-base bg-third/15 text-third">
            Юльтон <PersonStanding />
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={shareSong}
          disabled={isSharing}
          className="text-foreground bg-foreground/5"
        >
          {isCopied ? 'Скопировано' : 'Поделиться'} <Share2 />
        </Button>
      </div>
    </div>
  )
}
