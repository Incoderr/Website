import React from "react";
import { Link } from "react-router-dom";
import HeaderEl from "../components/HeaderEl";
import FooterEl from "../components/FooterEl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useTMDB from "../hooks/useTMDB";

const PopularMoviesSwiper = () => {
  // Загружаем популярные фильмы
  const {
    data: movies,
    loading,
    error,
  } = useTMDB("movie/popular", {
    language: "ru-RU", // Русская локализация
    page: 1, // Первая страница популярных фильмов
  });

  if (loading) return <p className="text-center text-white">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <HeaderEl/>
      <main className="pt-[56px]">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            Популярные фильмы
          </h2>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            loop
            autoplay={{ delay: 5000 }}
            navigation
            className="rounded-lg overflow-hidden"
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <div className="relative w-full h-64 sm:h-80 md:h-96">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {movie.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>
    </div>
  );
};

export default PopularMoviesSwiper;
