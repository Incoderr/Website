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
      <HeaderEl />
      <main className="">
        <div className="">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            loop
            autoplay={{ delay: 5500 }}
            navigation
            className="h-auto"
          >
            {movies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <div className="flex flex-col">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="flex w-full h-full"
                  />
                  <div className="absolute bottom-5 left-10">
                    <h3 className="flex text-3xl text-white">
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
