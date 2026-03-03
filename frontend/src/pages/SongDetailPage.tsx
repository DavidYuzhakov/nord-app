import { Loading } from '@/components/Loading'
import { Song } from '@/components/Song'
import { Button } from '@/components/ui/button'
import { useGoBack } from '@/hook/useGoBack'
import type { SongStructureItem } from '@/models/Song'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchSong } from '@/store/reducers/songSlice'
import { getStructureBg } from '@/utils/getStructureBg'
import {
  ChevronLeft,
  EditIcon,
  Headphones,
  InfoIcon,
  PersonStanding,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function SongDetailPage() {
  const headerRef = useRef<HTMLDivElement | null>(null)
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
      <p className="text-center text-slate-500 text-lg py-2 flex gap-2 items-center justify-center">
        <InfoIcon /> Песня не найдена
      </p>
    )

  const scrollToSection = (el: SongStructureItem) => {
    const hasNumber = /^\d/.test(el.text)
    const id = `${current.id}-${hasNumber ? el.text[0] + el.title : el.title}`

    const target = document.getElementById(id)
    if (!target) return

    const headerHeight = headerRef.current?.offsetHeight || 0
    const y =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      headerHeight -
      13

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    })
  }

  return (
    <div className="-mx-3 space-y-3 pb-23">
      <div
        ref={headerRef}
        className="space-y-3 p-2 rounded-b-xl shadow-xs sticky top-0 z-10 bg-background"
      >
        <div className="flex justify-between items-center gap-1">
          <div className="flex items-center gap-1 truncate">
            <button
              onClick={() => goBack()}
              className="shrink-0 p-0 flex items-center justify-center rounded-full size-10 bg-secondary/20 backdrop-blur-xs border drop-shadow-xs"
              type="button"
            >
              <ChevronLeft />
            </button>
            <h2 className="text-[22px] font-semibold truncate">
              {current.name}
            </h2>
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
          <div
            className={`grid ${current.structure.length > 5 ? 'grid-cols-[repeat(auto-fit,minmax(46px,1fr))]' : 'grid-cols-[repeat(auto-fit,minmax(50px,60px))]'} gap-px`}
          >
            {current.structure.map((el, i) => (
              <div
                key={i}
                onClick={() => scrollToSection(el)}
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
