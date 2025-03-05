import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { API_URL } from '../assets/config';
import LoadingEl from '../components/ui/Loading';
import KinoboxPlayer from '../components/Kinobox';
import HeaderEl from '../components/HeaderEl';

interface AnimeData {
  Poster: string;
  Title: string;
  TitleEng: string;
  Year: number;
  Status: string;
  imdbRating: number;
  TMDbRating: number;
  Episodes: number;
  Genre: string;
  Tags: string[];
  OverviewRu: string;
}


function WatchPage() {
  const { imdbID } = useParams<{ imdbID: string }>();
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animeResponse = await axios.get(`${API_URL}/anime/${imdbID}`);
        setAnimeData(animeResponse.data);

        if (token) {
          const profileResponse = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userFavorites = profileResponse.data.favorites || [];
          setIsFavorite(userFavorites.includes(imdbID));
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [imdbID, token]);

  const handleToggleFavorite = async () => {
    if (!token) {
      console.log('Требуется авторизация для изменения избранного');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { imdbID }
        });
        setIsFavorite(false);
      } else {
        await axios.post(`${API_URL}/favorites`, 
          { imdbID },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Ошибка при изменении избранного:', error.response?.data || error.message);
    }
  };

  if (loading) return <div className="p-3 h-full text-lg flex items-center justify-center"><LoadingEl/></div>;
  if (!animeData) return <div className="p-3 text-white text-lg">Аниме не найдено</div>;
    

  return (
    <div className="text-white">
      <HeaderEl/>
      <div className="p-[56px]">
      <button
        onClick={() => navigate("/search")}
        className="hidden mb-5 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 duration-300"
      >
        Назад
      </button>
      <div className="flex justify-center">
        <div className="flex w-320 gap-5 flex-col sm:flex-row">
          <div className="flex flex-col items-center">
            <img
              src={animeData.Poster}
              alt={animeData.Title}
              className="w-64 h-96 object-cover rounded-md"
            />
            <div 
              onClick={handleToggleFavorite} 
              className="mt-4 p-3 text-lg flex items-center gap-2 bg-gray-700 rounded-full cursor-pointer sm:duration-300 sm:hover:scale-105"
            >
              {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
              {isFavorite ? <BsBookmarkFill className="text-2xl" /> : <BsBookmark className="text-2xl" />}
            </div>
          </div>
          <div className="flex-1 flex flex-col text-center sm:text-left">
            <h1 className="text-3xl font-bold break-words whitespace-normal">{animeData.Title}</h1>
            <p className="text-lg text-gray-300">{animeData.TitleEng}</p>
            <p>Год: {animeData.Year}</p>
            <p>Статус: {animeData.Status}</p>
            <p>Серий: {animeData.Episodes}</p>
            <p>Рейтинг IMDb: {animeData.imdbRating}</p>
            <p>Рейтинг TMDb: {animeData.TMDbRating}</p>
            <p>Жанры: {animeData.Genre}</p>
            <p>Теги: {animeData.Tags.join(", ")}</p>
            <h1 className="mt-2 text-lg">Описание:</h1>
            <p>{animeData.OverviewRu}</p>
          </div>
        </div>
      </div>
        <div className="mt-55 mb-30 flex justify-center">
          <KinoboxPlayer imdbID={imdbID!} />
        </div>
      </div>
    </div>
  );
}

export default WatchPage;