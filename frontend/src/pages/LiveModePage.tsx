import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Song } from '@/components/Song'
import { useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { getStructureBg } from '@/utils/getStructureBg'
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

export default function LiveModePage() {
  const { items, loading } = useAppSelector((state) => state.program)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [currentProgram, setCurrentProgram] = useState<Program>(items[0])

  if (loading) return <p className="text-center">Загрузка...</p>

  if (items.length === 0 || !currentProgram) {
    return <Navigate to={'/'} />
  }

  const totalSlides = currentProgram.songs.length

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex)
  }

  return (
    <>
      <div className="-mx-3 relative space-y-3 pb-23">
        <div className="space-y-3 p-2 rounded-b-xl shadow-xs sticky top-0 z-10 bg-background">
          <div className="flex justify-between items-center gap-1">
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
                      : 'bg-background border border-gray-400'
                  }`}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          </div>
          {currentProgram.songs[activeIndex].song.structure && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(45px,1fr))] gap-px">
              {currentProgram.songs[activeIndex].song.structure.map((el, i) => (
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
                    <span className="absolute font-semibold top-1 right-1 text-xs translate-x-1/2 -translate-y-1/2 text-foreground z-10 text-[12px] bg-white px-1 border rounded-full">
                      {el.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {currentProgram.songs.map((song) => (
            <SwiperSlide>
              <Song song={song.song} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-lg mb-0">
              Выберите программу для Live режима
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-wrap items-center gap-3 px-2 pb-5">
            {items.map((program) => (
              <Button
                onClick={() => {
                  setCurrentProgram(program)
                  setIsOpen(false)
                }}
                className="w-full py-4 truncate text-lg font-medium"
                key={program.id}
              >
                {program.name}
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
