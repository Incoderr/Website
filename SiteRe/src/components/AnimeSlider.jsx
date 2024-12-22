import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";



function AnimeSlider() {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch("https://shikimori.one/api/animes?limit=20" );
        const data = await response.json();
        console.log(data);
        // Убедитесь, что data - массив, или извлеките массив из объекта
        setAnimeList(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };
    fetchAnime();
  }, []);



  return (
    <div>
      <Swiper
        spaceBetween={20}
        slidesPerView={8.3}
        navigation={true}
        modules={[Navigation]}
        className="anime-slider"
      >
        {animeList.map((anime) => (
        <SwiperSlide key={anime.id}>
          <div className="anime-container">
              <span className="rating">{anime.score || "N/A"}</span>
              <p className="description">{anime.description || anime.synopsis || "Описание недоступно"}</p>
              <div className="poster-container">
                <img 
                    className="poster"
                    src={`https://shikimori.one${anime.image?.original}`}
                    alt={anime.russian || anime.name} />
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
