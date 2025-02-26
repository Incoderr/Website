import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsBookmark } from "react-icons/bs";
import { API_URL } from '../assets/config';
import LoadingEl from '../components/ui/Loading';
import KinoboxPlayer from '../components/Kinobox'; // Импортируем новый компонент

interface AnimeData {
  PosterRu: string;
  TitleRu: string;
  TitleEng: string;
  Year: number;
  Status: string;
  IMDbRating: number;
  TMDbRating: number;
  Episodes: number;
  Genres: string[];
  Tags: string[];
  OverviewRu: string;
}

function PlayerPage() {
  const { ttid } = useParams<{ ttid: string }>();
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  if (loading) return <div className="p-3 h-full  text-lg flex items-center justify-center"><LoadingEl/></div>;
  if (!animeData) return <div className="p-3 text-white text-lg">Аниме не найдено</div>;

  return (
    <div className="p-3 text-white">
      <button
        onClick={() => navigate("/search")}
        className="mb-5 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 duration-300"
      >
        Назад
      </button>
      <div className="flex justify-center ">
        <div className="flex w-320 gap-5 flex-col sm:flex-row">
          <div className="flex flex-col items-center">
            <img
              src={animeData.PosterRu}
              alt={animeData.TitleRu}
              className="w-64 h-96 object-cover rounded-md"
            />
            <div className="mt-4 p-3 text-lg flex items-center gap-2 bg-gray-700 rounded-full cursor-pointer sm:duration-300 sm:hover:scale-105">
              Добавить в избранное
              <BsBookmark className="text-2xl" />
            </div>
          </div>
          <div className="flex-1 flex flex-col text-center sm:text-left">
            <h1 className="text-3xl font-bold break-words whitespace-normal">{animeData.TitleRu}</h1>
            <p className="text-lg text-gray-300">{animeData.TitleEng}</p>
            <p>Год: {animeData.Year}</p>
            <p>Статус: {animeData.Status}</p>
            <p>Серий: {animeData.Episodes}</p>
            <p>Рейтинг IMDb: {animeData.IMDbRating}</p>
            <p>Рейтинг TMDb: {animeData.TMDbRating}</p>
            <p>Жанры: {animeData.Genres.join(", ")}</p>
            <p>Теги: {animeData.Tags.join(", ")}</p>
            <h1 className="mt-2 text-lg">Описание:</h1>
            <p>{animeData.OverviewRu}</p>
          </div>
        </div>
      </div>
      <div className="mt-55 mb-30 flex justify-center">
        <KinoboxPlayer ttid={ttid!} />
      </div>
    </div>
  );
}

export default PlayerPage;