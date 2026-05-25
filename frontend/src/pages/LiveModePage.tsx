import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Song } from '@/components/Song'
import { useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hooks'
import { Navigate } from 'react-router-dom'
import type { Program } from '@/models/Program'
import { Loading } from '@/components/Loading'
import { Header } from '@/components/Header'

const styles = [
  'text-primary bg-primary/25',
  'text-red-400 bg-red-400/25',
  'text-green-400 bg-green-400/25',
  'text-gray-400 bg-gray-400/25',
  'text-orange-400 bg-orange-400/25',
]

export default function LiveModePage() {
  const { items, loading } = useAppSelector((state) => state.program)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(items.length === 1 ? false : true)
  const [currentProgram, setCurrentProgram] = useState<Program>(items[0])

  if (loading) return <Loading />

  if (items.length === 0 || !currentProgram) {
    return <Navigate to={'/'} />
  }

  const totalSlides = currentProgram.songs.length
  const programStructure = currentProgram.songs[activeIndex].song.structure

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex)
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <div className="-mx-3 relative pb-0">
        {totalSlides > 0 ? (
          <>
            <Header
              songId={currentProgram.songs[activeIndex].songId}
              structure={programStructure}
            >
              <h2 className="text-[22px] font-semibold truncate">
                {currentProgram.songs[activeIndex].song.name}
              </h2>
              <div className="flex gap-1 z-10">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    className={`size-3 rounded-full transition-all ${
                      index === activeIndex
                        ? 'bg-primary'
                        : 'bg-background dark:bg-secondary border border-gray-400'
                    }`}
                    aria-label={`Перейти к слайду ${index + 1}`}
                  />
                ))}
              </div>
            </Header>

            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              autoHeight
              onSlideChange={handleSlideChange}
            >
              {currentProgram.songs.map((song) => (
                <SwiperSlide className="pb-[74px] pt-3">
                  <Song song={song.song} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <p className="text-muted-foreground text-center mt-5">Нет хвал</p>
        )}
      </div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-lg mb-0">
              Выберите программу для Live режима
            </DrawerTitle>
          </DrawerHeader>
          <div
            className={`${items.length > 0 ? 'grid grid-cols-2' : ''} items-center gap-3 px-2 pb-5`}
          >
            {items.map((program, i) => (
              <Button
                onClick={() => {
                  setCurrentProgram(program)
                  setIsOpen(false)
                }}
                className={`w-full ${styles[i] ?? 'bg-primary/25 text-primary'} py-7 text-lg font-medium`}
                key={program.id}
              >
                <span className="truncate w-full">{program.name}</span>
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
