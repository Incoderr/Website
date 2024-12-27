import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

function AnimeSlider() {
  const [animeList, setAnimeList] = useState([]);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return; // Если данные уже были загружены, пропускаем
    dataFetchedRef.current = true; // Устанавливаем флаг

    const fetchAnime = async (criteria = "popularity") => {
      //или ranked — по рейтингу.popularity — по популярности.new — новинки.aired_on — по дате выхода.random — случайные.
      try {
        const response = await fetch(
          `https://shikimori.one/api/animes?limit=20&order=${criteria}`
        );
        const data = await response.json();
        console.log(data);
        setAnimeList(Array.isArray(data) ? data : data.data || []); // Проверяем, является ли data массивом
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchAnime();
  }, []);
  // Состояния для иконок
  const [isBookmarked, setIsBookmarked] = useState(false);
  // Обработчики кликов
  const toggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };
  // кароче кастом управление лентой
  const swiperRef = useRef(null);

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

  return (
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
        className="anime-slider"
      >
        <div className="gradient">
          <div
            className="custom-prev"
            onClick={() => swiperRef.current.slidePrev()}
          >
            <i className="bi bi-chevron-left fs-1"></i>
          </div>
          <div
            className="custom-next"
            onClick={() => swiperRef.current.slideNext()}
          >
            <i className="bi bi-chevron-right fs-1"></i>
          </div>
        </div>
        {animeList.map((anime) => (
          <SwiperSlide key={anime.id}>
            <div className="anime-container">
              <span className="rating">{anime.score || "N/A"}</span>
              <div className="description-container">
                <Link to={"/player"} className="description">
                  <p className="description">
                    {anime.description ||
                      anime.synopsis ||
                      "Описание недоступно"}
                  </p>
                </Link>
                <div className="button-container">
                  <Link to={"/player"}>
                    <i className="bi bi-caret-right-fill fs-4"></i>
                    Смотреть
                  </Link>
                  <button className="circle" onClick={toggleBookmark}>
                    <i
                      className={`bi ${
                        isBookmarked
                          ? "bi-bookmark-fill fs-5"
                          : "bi-bookmark fs-5  "
                      }`}
                    />
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
  );
}

export default AnimeSlider;
