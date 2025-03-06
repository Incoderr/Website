import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import HeaderEl from "../components/HeaderEl";
import LoadingEl from "../components/ui/Loading";
import { API_URL } from "../assets/config";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [favoritesData, setFavoritesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favorites");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        const favorites = response.data.favorites || [];
        if (favorites.length > 0) {
          const favoritesPromises = favorites.map((imdbID) =>
            axios.get(`${API_URL}/anime/${imdbID}`).catch((error) => {
              console.error(`Ошибка при загрузке аниме ${imdbID}:`, error);
              return null;
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

  const handleNavigate = (imdbID) => {
    navigate(`/player/${imdbID}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.invalidateQueries(["favorites"]);
    navigate("/auth");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("image", avatarFile);

    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY; // Получаем ключ из .env
      if (!apiKey) {
        throw new Error("API ключ imgBB не найден в переменных окружения");
      }

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`, // Передаем ключ в URL
        formData
      );
      const avatarUrl = response.data.data.url;

      const updateResponse = await axios.put(
        `${API_URL}/profile/avatar`,
        { avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(updateResponse.data);
      setAvatarFile(null);
      setAvatarPreview(null);

      localStorage.setItem("user", JSON.stringify({
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        avatar: avatarUrl
      }));

      queryClient.invalidateQueries(["favorites", token]);
      queryClient.setQueryData(["favorites", token], (oldData) => ({
        ...oldData,
        avatar: avatarUrl,
      }));
    } catch (error) {
      console.error("Ошибка при загрузке аватара:", error.response?.data || error.message);
      alert("Не удалось загрузить аватар: " + (error.response?.data?.error?.message || "Неизвестная ошибка"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-5 text-white flex justify-center"><LoadingEl /></div>;

  return (
    <div>
      <HeaderEl />
      <main className="pt-[56px]">
        <div className="p-5 text-white">
          <div className="flex flex-col items-center">
            <img
              src={avatarPreview || userData.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            {userData.role && (
              <p className="text-sm text-gray-400">Роль: {userData.role}</p>
            )}

            <div className="mt-4 flex gap-4">
              <button
                className={`px-4 py-2 ${activeTab === "favorites" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer`}
                onClick={() => setActiveTab("favorites")}
              >
                Избранное
              </button>
              <button
                className={`px-4 py-2 ${activeTab === "settings" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer`}
                onClick={() => setActiveTab("settings")}
              >
                Настройки
              </button>
            </div>

            <div className="mt-6 w-full max-w-md">
              {activeTab === "favorites" && (
                <>
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
                </>
              )}

              {activeTab === "settings" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl mb-2">Смена аватара:</h2>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="mb-2 cursor-pointer"
                    />
                    {avatarPreview && (
                      <button
                        onClick={handleAvatarUpload}
                        className="cursor-pointer bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Сохранить аватар
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;