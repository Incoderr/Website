
// HomeAnimeSwiper.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Autoplay } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { BsBookmark, BsFillPlayFill } from "react-icons/bs";
import useAnimeData from "../hooks/useTMDB";

import "swiper/css/effect-fade";


const HomeAnimeSwiper = () => {
  const { animeList, loading, error } = useAnimeData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-130 sm:h-190">
        <p className="text-xl">Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-130 sm:h-190">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  const handleWatchClick = (tmdbId) => {
    if (tmdbId) {
      navigate(`/player/${tmdbId}`);
    } else {
      console.warn("TMDB ID не найден для данного аниме");
    }
  };

  return (
    <div className="image-box select-none">
      <Swiper
        spaceBetween={30}
        effect="fade"
        centeredSlides={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        navigation={true}
        loop
        modules={[Navigation, EffectFade, Autoplay]}
        className="h-130 sm:h-195"
      >
        {animeList.map((anime) => (
          <SwiperSlide key={anime.id}>
            {anime.backdrop && (
              <div className="w-full h-full">
                <img
                  src={anime.backdrop}
                  alt={anime.russian}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              </div>
            )}
            
            <div className="absolute left-0 top-17 items-center sm:items-baseline z-10 flex w-full flex-col mb-10 sm:mt-0 sm:mb-0 sm:mr-auto sm:ml-25">
              <div className="w-130 flex flex-col">
                <img
                  className="h-60 sm:h-100 object-contain"
                  src={anime.poster}
                  alt={anime.russian}
                  loading="lazy"
                />
                <h1 className="text-[20px] mb-2 mt-2 font-bold text-white">
                  {anime.russian}
                </h1>
              </div>
              
              <div className="flex  sm:w-130 justify-center sm:justify-normal gap-2 mb-5 flex-wrap">
                <p className="bg-green-600 rounded-full px-3 py-1 text-sm sm:text-base">
                  Рейтинг:⭐ {anime.score}
                </p>
                <p className="bg-gray-700 rounded-full px-3 py-1 text-sm sm:text-base">
                  Серий: {anime.episodes ?? "?"}
                </p>
                <p className="bg-gray-700 rounded-full px-3 py-1 text-sm sm:text-base">
                  Статус: {anime.status}
                </p>
                <p className="bg-gray-700 rounded-full px-3 py-1 text-sm sm:text-base">
                  Год: {anime.aired_on?.split("-")[0]}
                </p>
              </div>
              
              <p className="hidden sm:overflow-hidden sm:w-130 sm:mb-2 sm:line-clamp-5 sm:text-gray-200">
                {anime.description || "Описание отсутствует"}
              </p>
              
              <div className="flex w-130 items-center justify-center gap-3">
                <button 
                  onClick={() => handleWatchClick(anime.tmdb_id)}
                  className="flex items-center bg-white text-black rounded-full h-12 px-4 hover:scale-95 transition duration-150 ease-in-out"
                >
                  <BsFillPlayFill className="text-[35px]" />
                  <span className="text-[20px] ml-1">Смотреть</span>
                </button>
                
                <button
                  type="button"
                  className="flex justify-center items-center rounded-full w-12 h-12 bg-[#A78BFA] hover:scale-95 transition duration-150 ease-in-out"
                  aria-label="Добавить в закладки"
                >
                  <BsBookmark className="text-[24px]" />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeAnimeSwiper;