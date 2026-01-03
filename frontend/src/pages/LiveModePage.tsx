// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Song } from '@/components/Song'
export default function LiveModePage() {
  return (
    <div className="-mx-3">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <Song />
        </SwiperSlide>
        <SwiperSlide>
          <Song />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
