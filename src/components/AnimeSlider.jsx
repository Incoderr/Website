import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

function AnimeSlider() {
  const [animeList, setAnimeList] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchAnime = async (criteria = "popularity") => {
      try {
        const response = await fetch(
          `https://shikimori.one/api/animes?limit=20&order=${criteria}`
        );
        const data = await response.json();
        setAnimeList(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchAnime();
  }, []);

  const updateNavigationButtons = (swiper) => {
    const prevButton = document.querySelector(".custom-prev");
    const nextButton = document.querySelector(".custom-next");

    if (swiper.isBeginning) {
      prevButton.classList.add("disabled");
    } else {
      prevButton.classList.remove("disabled");
    }

    if (swiper.isEnd) {
      nextButton.classList.add("disabled");
    } else {
      nextButton.classList.remove("disabled");
    }
  };

  useEffect(() => {
    if (swiperRef.current) {
      updateNavigationButtons(swiperRef.current);
    }
  }, [animeList]);

  return (
    <div className="anime-slider-container">
      <div className="gradient">
        {/* Кастомные кнопки навигации */}
        <button
          className="custom-prev disabled"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <i className="bi bi-chevron-left fs-1"></i>
        </button>
        <button
          className="custom-next disabled"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <i className="bi bi-chevron-right fs-1"></i>
        </button>
      </div>
      <Swiper
        onSlideChange={(swiper) => updateNavigationButtons(swiper)}
        onInit={(swiper) => {
          swiperRef.current = swiper;
          updateNavigationButtons(swiper);
        }}
        spaceBetween={20}
        slidesPerView="auto"
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        modules={[Navigation]}
      >
        {animeList.map((anime) => (
          <SwiperSlide key={anime.id}>
            <div className="anime-container">
              <div className="description-container">
                <Link to={"/player"} className="description">
                  <div className="description-content">
                    <h5>name</h5>
                    <p>
                      Рейтинг:34
                    </p>
                    <p className="description-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas molestias ducimus distinctio asperiores blanditiis fugit, eum rerum harum aliquam minus repudiandae! Hic nisi laudantium ex quis temporibus perspiciatis quasi ducimus!
                    </p>
                  </div>
                </Link>
                <div className="button-container">
                  <Link to={"/player"}>
                    <i className="bi bi-caret-right-fill fs-4"></i>
                    Смотреть
                  </Link>
                  <button className="circle">
                    <i className="bi bi-bookmark fs-5" />
                  </button>
                </div>
              </div>
              <div className="poster-container">
                <img
                  className="poster"
                  src={`https://shikimori.one${anime.image?.original}`}
                  alt={anime.russian || anime.name}
                />
              </div>
              <div className="name-container">
                <h1 className="name">{anime.russian || anime.name}</h1>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default AnimeSlider;
