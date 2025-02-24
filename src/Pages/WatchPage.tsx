import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../assets/config';

interface AnimeData {
  PosterRu: string;
  TitleRu: string;
  TitleEng: string;
  Year: number;
  Status: string;
  IMDbRating: number;
  TMDbRating: number;
  Genres: string[];
  Tags: string[];
  OverviewRu: string;
}

function PlayerPage() {
  const { ttid } = useParams<{ ttid: string }>();
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/${ttid}`)
      .then((response) => {
        setAnimeData(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных аниме:", error);
      })
      .finally(() => setLoading(false));
  }, [ttid]);

  useEffect(() => {
    const scriptId = "kinobox-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://kinobox.tv/kinobox.min.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (containerRef.current && (window as any).kbox) {
          (window as any).kbox(containerRef.current, { search: { query: ttid } });
        }
      };
    } else if (containerRef.current && (window as any).kbox) {
      (window as any).kbox(containerRef.current, { search: { query: ttid } });
    }
  }, [ttid]);

  if (loading) return <div className="p-3 text-white text-lg">Загрузка...</div>;
  if (!animeData) return <div className="p-3 text-white text-lg">Аниме не найдено</div>;

  return (
    <div className="p-3 text-white">
      <button
        onClick={() => navigate("/search")}
        className="mb-5 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 duration-300"
      >
        Назад
      </button>
      <div className="flex justify-center">
        <div className="flex w-320 gap-5">
          <img src={animeData.PosterRu} alt={animeData.TitleRu} className="w-64 h-96 object-cover rounded-md" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{animeData.TitleRu}</h1>
            <p className="text-lg text-gray-300">{animeData.TitleEng}</p>
            <p>Год: {animeData.Year}</p>
            <p>Статус: {animeData.Status}</p>
            <p>Рейтинг imdb: {animeData.IMDbRating}</p>
            <p>Рейтинг tmdb: {animeData.TMDbRating}</p>
            <p>Жанры: {animeData.Genres.join(", ")}</p>
            <p>Теги: {animeData.Tags.join(", ")}</p>
            <h1 className="mt-2 text-lg">Описание:</h1>
            <p>{animeData.OverviewRu}</p>
          </div>
        </div>
      </div>
      <div className="mt-55 mb-30 flex justify-center">
        <div ref={containerRef} className="kinobox_player w-320 h-180 bg-gray-950 rounded-md"></div>
      </div>
    </div>
  );
}

export default PlayerPage;
