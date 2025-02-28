import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderEl from "../components/HeaderEl";
import LoadingEl from "../components/ui/Loading";

const API_URL = "https://serverr-eight.vercel.app"; // Базовый URL сервера

function Profile() {
  const [userData, setUserData] = useState(null);
  const [favoritesData, setFavoritesData] = useState([]); // Данные об избранных аниме
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Получение данных профиля
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);

        // Получение данных об избранных аниме
        const favorites = response.data.favorites || [];
        if (favorites.length > 0) {
          const favoritesPromises = favorites.map((imdbID) =>
            axios.get(`https://serverr-eight.vercel.app/api/anime/${imdbID}`).catch((error) => {
              console.error(`Ошибка при загрузке аниме ${imdbID}:`, error);
              return null; // Возвращаем null для пропуска ошибочных записей
            })
          );
          const favoritesResponses = await Promise.all(favoritesPromises);
          const validFavorites = favoritesResponses
            .filter((res) => res !== null)
            .map((res) => res.data);
          setFavoritesData(validFavorites);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
    else navigate("/auth");
  }, [token, navigate]);

  // Обработчик перехода на страницу просмотра
  const handleNavigate = (imdbID) => {
    navigate(`/player/${imdbID}`);
  };

  if (loading) return <div className="p-5 text-white flex justify-center"><LoadingEl/></div>;

  return (
    <div>
      <HeaderEl />
      <main className="pt-[56px]">
        <div className="p-5 text-white">
          <div className="flex flex-col items-center">
            <img
              src={userData.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            <div className="mt-6 w-full max-w-md">
              <h2 className="text-xl mb-2">Избранное:</h2>
              {favoritesData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoritesData.map((anime) => (
                    <div
                      key={anime.imdbID}
                      onClick={() => handleNavigate(anime.imdbID)}
                      className="flex items-center gap-3 p-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition duration-300"
                    >
                      <img
                        src={anime.Poster}
                        alt={anime.Title}
                        className="w-16 h-24 object-cover rounded-md"
                      />
                      <span className="text-lg">{anime.Title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>У вас пока нет избранного</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;