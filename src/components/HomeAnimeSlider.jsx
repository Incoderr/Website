import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { BsBookmark, BsFillPlayFill } from "react-icons/bs";
import useAnimeData from "../hooks/useTMDB";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const HomeAnimeSwiper = () => {
  const { animeList, loading, error } = useAnimeData();

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

  return (
    <div className="image-box select-none">
      <Swiper
        spaceBetween={30}
        effect="fade"
        centeredSlides
        navigation
        loop
        /*autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}*/
        modules={[Navigation, EffectFade, Autoplay]}
        className="h-130 sm:h-190"
      >
        {animeList.map((anime) => (
          <SwiperSlide key={anime.id}>
            {anime.backdrop && (
              <div className=" w-full h-full">
                <img
                  src={anime.backdrop}
                  alt={anime.russian}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              </div>
            )}
            
            <div className="absolute left-0 z-10 flex w-full flex-col mt-10 mb-10 sm:mt-0 sm:mb-0 sm:mr-auto sm:ml-25">
              <div className="w-130 flex flex-col">
                <img
                  className="anime-logo h-100 object-contain"
                  src={anime.poster}
                  alt={anime.russian}
                  loading="lazy"
                />
                <h1 className="text-[20px] mb-2 mt-2 font-bold text-white">
                  {anime.russian}
                </h1>
              </div>
              
              <div className="flex w-130 gap-2 mb-5 flex-wrap">
                <p className="bg-green-600 rounded-full px-3 py-1 text-base">
                  Рейтинг:⭐ {anime.score}
                </p>
                <p className="bg-gray-700 rounded-full px-3 py-1 text-base">
                  Серий: {anime.episodes ?? "?"}
                </p>
                <p className="bg-gray-700 rounded-full px-3 py-1 text-base">
                  Статус: {anime.status}
                </p>
                <p className="bg-gray-700 rounded-full px-3 py-1 text-base">
                  Год: {anime.aired_on?.split("-")[0]}
                </p>
              </div>
              
              <p className="overflow-hidden w-130 mb-2 line-clamp-5 text-gray-200">
                {anime.description || "Описание отсутствует"}
              </p>
              
              <div className="flex w-130 items-center justify-center gap-3">
                <Link 
                  to="/search"
                  className="flex items-center bg-white text-black rounded-full h-12 px-4 hover:scale-95 transition duration-150 ease-in-out"
                >
                  <BsFillPlayFill className="text-[35px]" />
                  <span className="text-[20px] ml-1">Смотреть</span>
                </Link>
                
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