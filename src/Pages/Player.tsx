import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const MovieSearchPage = () => {
  const { tmdbId } = useParams();
  const [movieTitle, setMovieTitle] = useState("");

  useEffect(() => {
    const initializePlayer = (searchParams) => {
      if (window.kbox) {
        console.log("Инициализация поиска с параметрами:", searchParams);
        window.kbox(".player", {
          search: searchParams,
          onChange: (data) => {
            if (data?.title) {
              setMovieTitle(data.title);
            } else {
              console.log("Контент не найден");
              setMovieTitle("Контент не найден");
            }
          },
        });
      }
    };

    const loadPlayer = () => {
      if (document.querySelector('script[src="https://kinobox.tv/kinobox.min.js"]')) {
        console.log("Kinobox уже загружен");
        startSearch();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://kinobox.tv/kinobox.min.js";
      script.async = true;

      script.onload = () => {
        console.log("Kinobox загружен");
        startSearch();
      };

      document.body.appendChild(script);
    };

    const startSearch = () => {
      const cachedData = localStorage.getItem("animeListCache");
      if (!cachedData) {
        console.log("Кэш аниме отсутствует");
        return;
      }

      const { data } = JSON.parse(cachedData);
      const currentAnime = data.find((anime) => anime.tmdb_id === Number(tmdbId));

      if (!currentAnime) {
        console.log("Аниме не найдено в кэше");
        return;
      }

      // Формируем параметры поиска
      const searchParams = {
        tmdb: currentAnime.tmdb_id || null,
        kinopoisk: currentAnime.kinopoisk_id || null,
        imdb: currentAnime.imdb_id || null,
        title: currentAnime.name || currentAnime.name_en || currentAnime.russian || null,
      };

      // Удаляем пустые поля
      Object.keys(searchParams).forEach((key) => {
        if (!searchParams[key]) delete searchParams[key];
      });

      if (Object.keys(searchParams).length > 0) {
        initializePlayer(searchParams);
      } else {
        console.log("Нет данных для поиска");
        setMovieTitle("Контент не найден");
      }
    };

    loadPlayer();
  }, [tmdbId]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {movieTitle && (
        <div className="mb-6 text-xl font-bold">
          {movieTitle === "Контент не найден"
            ? "К сожалению, контент не найден"
            : `Сейчас смотрите: ${movieTitle}`}
        </div>
      )}

      <div className="aspect-video">
        <div className="player w-full h-full"></div>
      </div>
    </div>
  );
};

export default MovieSearchPage;
