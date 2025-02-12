import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { Navigation, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";

const HomeAnimeSwiper = ({ slidesCount = 3 }) => {
  // Генерация массива слайдов на основе slidesCount
  const slides = Array.from({ length: slidesCount }, (_, index) => ({
    id: index + 1,
    name: `Название ${index + 1}`,
    rating: (Math.random() * 10).toFixed(1),
    episodes: Math.floor(Math.random() * 100),
    releaseDate: "2025",
    description: `Описание для слайда ${index + 1}`,
    imageUrl: "", // Замените на ваши изображения
  }));

  return (
    <div className="image-box select-none">
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        centeredSlides={true}
        loop={true}
        navigation={true}
        modules={[Navigation, EffectFade]}
        className="h-130 sm:h-190"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col justify-center mt-auto mb-10 sm:mt-0 sm:mb-0 sm:mr-auto sm:ml-25">
              <div className="Slider-name">
                <div className="image-name">
                  <img className="anime-logo" src={slide.imageUrl} alt={slide.name} />
                  <h1>{slide.name}</h1>
                </div>
                <div className="flex gap-2 mb-5">
                  <p className="bg-green-600 rounded-full pl-1 pr-1">Рейтинг: {slide.rating}</p>
                  <p>Серий: {slide.episodes}</p>
                  <p>Релиз: {slide.releaseDate}</p>
                </div>
              </div>
              <div className="hidden sm:block  mb-5">
                <p>{slide.description}</p>
              </div>
              <div className="">
                <div className="flex items-center justify-center gap-3">
                  <Link to={"/search"}>
                    <div className="flex items-center bg-white text-black rounded-full h-12 hover:scale-95 transition delay-15 ease-in-out pl-2 pr-2">
                      <i className="bi bi-play text-[35px]"></i>
                      <h1 className="text-[20px]">Смотреть</h1>
                    </div>
                  </Link>
                  <div className="justify-center items-center flex rounded-full w-12 h-12 bg-[#A78BFA] hover:scale-95 transition delay-15 ease-in-out">
                    <button type="button">
                      <i className="bi bi-bookmark text-[24px] text-amber-50"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/*<img className="absolute" src={slide.imageUrl} alt={slide.name} />*/}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeAnimeSwiper;
