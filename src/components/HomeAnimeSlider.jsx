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
    <div className="image-box">
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        centeredSlides={true}
        loop={true}
        navigation={true}
        modules={[Navigation, EffectFade]}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="Slide-container">
              <div className="Slider-name">
                <div className="image-name">
                  <img className="anime-logo" src={slide.imageUrl} alt={slide.name} />
                  <h1>{slide.name}</h1>
                </div>
                <div className="anime-info">
                  <p className="score">Рейтинг: {slide.rating}</p>
                  <p>Серий: {slide.episodes}</p>
                  <p>Релиз: {slide.releaseDate}</p>
                </div>
              </div>
              <div className="Slider-description">
                <p>{slide.description}</p>
              </div>
              <div className="play-button-container">
                <div className="play-button">
                  <Link to={"/player"}>
                    <div className="play">
                      <i className="bi bi-play fs-1"></i>
                      <h1>Смотреть</h1>
                    </div>
                  </Link>
                  <div className="play-bookmark">
                    <button type="button">
                      <i className="bi bi-bookmark fs-3  text-amber-50"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <img src={slide.imageUrl} alt={slide.name} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeAnimeSwiper;
