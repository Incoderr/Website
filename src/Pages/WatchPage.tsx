import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { API_URL } from "../assets/config";
import LoadingEl from "../components/ui/Loading";
import KinoboxPlayer from "../components/Kinobox";
import HeaderEl from "../components/HeaderEl";

interface AnimeData {
  Poster: string;
  Title: string;
  TitleEng: string;
  Year: number;
  Released: string;
  imdbRating: number;
  Backdrop: string;
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
  const [watchStatus, setWatchStatus] = useState<string>("plan_to_watch");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animeResponse = await axios.get(`${API_URL}/anime/${imdbID}`);
        setAnimeData(animeResponse.data);

        if (token) {
          const profileResponse = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userFavorites = profileResponse.data.favorites || [];
          setIsFavorite(userFavorites.includes(imdbID));

          const userWatchStatus = profileResponse.data.watchStatus || [];
          const status = userWatchStatus.find((ws) => ws.imdbID === imdbID);
          setWatchStatus(status ? status.status : "");
        }
      } catch (error) {
        console.error(
          "Ошибка при загрузке данных:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [imdbID, token]);


  const handleToggleFavorite = async () => {
    if (!token) {
      console.log("Требуется авторизация для изменения избранного");
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { imdbID },
        });
        setIsFavorite(false);
      } else {
        await axios.post(
          `${API_URL}/favorites`,
          { imdbID },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(
        "Ошибка при изменении избранного:",
        error.response?.data || error.message
      );
    }
  };

  const handleWatchStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    if (!token) {
      console.log("Требуется авторизация для изменения статуса просмотра");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/watch-status`,
        { imdbID, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchStatus(newStatus);
    } catch (error) {
      console.error(
        "Ошибка при изменении статуса:",
        error.response?.data || error.message
      );
    }
  };

  if (loading)
    return (
      <div className="p-3 min-h-screen text-lg flex items-center justify-center">
        <LoadingEl />
      </div>
    );
  if (!animeData)
    return <div className="p-3 text-white text-lg">Аниме не найдено</div>;

  return (
    <HelmetProvider>
    <div className="text-white">
      <Helmet>
        <title>{`AniCor - ${animeData.Title}`}</title>
      </Helmet>
      <HeaderEl />
      <div className="p-[56px]">
        <div className="flex justify-center">
          <div className="flex w-320 gap-5 flex-col sm:flex-row">
            <div className="flex flex-col items-center ">
              <img
                src={animeData.Poster}
                alt={animeData.Title}
                className="w-64 h-96 object-cover rounded-md z-10"
              />
              <div className="flex w-full absolute top-0 left-0 h-200">
                <div className="w-full">
                  <img
                      src={animeData.Backdrop}
                      alt=""
                      className="object-cover h-200 w-full"
                    />
                    <div className="absolute backdrop-blur-sm bg-black/25 inset-0 bg-gradient-to-t from-black to-transparent"></div>
                </div>
              </div>
            </div>
            <div className="z-10 flex-1 flex flex-col text-center sm:text-left p-3 rounded-2xl">
              <h1 className="text-3xl font-bold break-words whitespace-normal">
                {animeData.Title}
              </h1>
              <p className="text-2xl text-white/80 mb-2">
                {animeData.TitleEng}
              </p>
              <p className="mb-2">Год: {animeData.Year}</p>
              <p className="mb-2">Дата релиза: {animeData.Released}</p>
              <p className="mb-2">Рейтинг <span className="text-blue-400">Shikikmori: </span>{animeData.imdbRating}</p>
              <p className="mb-2">Рейтинг <span className="text-yellow-400">IMDB: </span> </p>
              <p className="mb-2">Жанры: {animeData.Genre}</p>
              <p className="mb-2">Количество серий: {animeData.Episodes}</p>
              <h1 className="mt-2 text-lg">Описание:</h1>
              <p>{animeData.OverviewRu}</p>
              <div className="flex gap-4">
                <div
                  onClick={handleToggleFavorite}
                  className="z-10 ring-white/35 ring-1 mt-4 p-3 h-12 text-lg flex items-center gap-2 backdrop-blur-[3px] bg-black/50 rounded-full cursor-pointer sm:duration-300 sm:hover:scale-105"
                >
                  {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                  {isFavorite ? (
                    <BsBookmarkFill className="text-2xl" />
                  ) : (
                    <BsBookmark className="text-2xl" />
                  )}
                </div>
                <select
                  value={watchStatus}
                  onChange={handleWatchStatusChange}
                  className="z-10 ring-white/35 ring-1 mt-4 text-lg h-12 p-3 backdrop-blur-[3px] bg-black/50 rounded-full text-white outline-0 cursor-pointer sm:duration-300 sm:hover:scale-105"
                  disabled={!token}
                >
                  <option value="">Не выбрано</option>
                  <option value="plan_to_watch">Буду смотреть</option>
                  <option value="watching">Смотрю</option>
                  <option value="completed">Просмотрено</option>
                  <option value="dropped">Брошено</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-55 mb-30 flex justify-center">
          <KinoboxPlayer imdbID={imdbID!} />
        </div>
      </div>
    </div>
    </HelmetProvider>
  );
}

export default WatchPage;
