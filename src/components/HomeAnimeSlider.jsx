import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, EffectFade, } from "swiper/modules";
import { Link } from "react-router-dom";

const HomeAnimeSwiper = () => {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    // Функция для получения данных о конкретных аниме
    const fetchAnime = async () => {
      try {
        const animeIds = [1, 20, 21]; // IDs: Акира, Наруто, Ван Пис (примерные ID для Shikimori)
        const promises = animeIds.map((id) =>
          fetch(`https://shikimori.one/api/animes/${id}`).then((res) => res.json())
        );
        const data = await Promise.all(promises);
        setAnimeList(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };

    fetchAnime();
  }, []);

  return (
    <div className="image-box">
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        centeredSlides={true}
        loop={true}
        pagination={{ clickable: true }}
        modules={[Pagination, EffectFade]}
        className="mySwiper"
      >
        {animeList.map((anime) => (
          <SwiperSlide key={anime.id}>
            <div className="Slide-container">
              <img
                className="anime-logo"
                src={anime.image.original}
                alt={anime.name}
              />
              <h1>{anime.russian}</h1>
              <div className="anime-info">
                <p className="score">{anime.score}</p>
                <p>Серий:{anime.episodes}</p>
                <p>{anime.released_on}</p>
              </div>
              <div className="Slider-description">
                <p>{anime.description || "Описание недоступно"}</p>
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
                            <i class="bi bi-bookmark fs-3"></i>
                        </button>
                    </div>
                  </div>
              </div>
            </div>
            <iframe 
                
            >
            </iframe>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeAnimeSwiper;
