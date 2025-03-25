import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";


function Au() {
  return (
    <div className="image-box mb-12">
      <div className="h-130 sm:h-200 flex items-center justify-center">
        <div className="flex flex-col items-center w-full max-w-[520px]">
          <Skeleton className="w-60 h-60 sm:w-[400px] sm:h-[400px] mb-4" />
          <Skeleton className="w-40 h-6 sm:w-48 sm:h-8 mb-2" />
          <Skeleton className="w-60 h-4 sm:w-80 sm:h-6 mb-2" />
          <Skeleton className="w-32 h-10 sm:w-40 sm:h-12" />
        </div>
      </div>
    </div> 
  )
}

export default Au