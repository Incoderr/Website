import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";
import HeaderEl from "../components/HeaderEl";
import LoadingEl from "../components/ui/Loading";
import { API_URL } from "../assets/config";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [favoritesData, setFavoritesData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favorites");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [friendUsername, setFriendUsername] = useState("");
  const navigate = useNavigate();
  const { userId } = useParams(); // Получаем userId из URL
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Определяем ID пользователя: из URL (если есть) или из токена
        const profileId = userId || JSON.parse(localStorage.getItem("user") || "{}").id;

        const profileResponse = await axios.get(`${API_URL}/users/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(profileResponse.data);

        const favorites = profileResponse.data.favorites || [];
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

        setFriendsData(profileResponse.data.friends || []);
        setPendingRequests(profileResponse.data.pendingRequests || []);
      } catch (error) {
        console.error("Profile fetch error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
    else navigate("/auth");
  }, [token, navigate, userId]);

  const handleNavigate = (imdbID) => {
    navigate(`/player/${imdbID}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.invalidateQueries(["favorites"]);
    navigate("/auth");
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер: 5 МБ.");
        return;
      }
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
        });
        setAvatarFile(compressedFile);
        setAvatarPreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Ошибка сжатия изображения:", error);
        alert("Не удалось обработать изображение");
      }
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("image", avatarFile);

    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error("API ключ imgBB не найден в переменных окружения");
      }

      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        }
      );
      const avatarUrl = imgbbResponse.data.data.url;

      const updateResponse = await axios.put(
        `${API_URL}/profile/avatar`,
        { avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(updateResponse.data);
      setAvatarFile(null);
      setAvatarPreview(null);
      setUploadProgress(0);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user") || "{}"),
          avatar: avatarUrl,
        })
      );

      queryClient.invalidateQueries(["favorites", token]);
      queryClient.setQueryData(["favorites", token], (oldData) => ({
        ...oldData,
        avatar: avatarUrl,
      }));
    } catch (error) {
      console.error("Ошибка при загрузке аватара:", error.response?.data || error.message);
      alert("Не удалось загрузить аватар: " + (error.response?.data?.error?.message || error.message));
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      const userResponse = await axios.get(`${API_URL}/users/search?username=${friendUsername}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const friendId = userResponse.data._id;

      await axios.post(
        `${API_URL}/friends/request`,
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Запрос на дружбу отправлен");
      setFriendUsername("");
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error.response?.data || error.message);
      alert("Не удалось отправить запрос: " + (error.response?.data?.message || error.message));
    }
  };

  const handleAcceptFriendRequest = async (friendshipId) => {
    try {
      await axios.put(
        `${API_URL}/friends/accept/${friendshipId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const friendsResponse = await axios.get(`${API_URL}/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendsData(friendsResponse.data.friends);
      setPendingRequests(friendsResponse.data.pendingRequests);
      alert("Друг добавлен");
    } catch (error) {
      console.error("Ошибка при принятии запроса:", error.response?.data || error.message);
      alert("Не удалось принять запрос: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  if (loading) return <div className="p-5 text-white flex justify-center"><LoadingEl /></div>;
  if (!userData) return <div className="p-5 text-white flex justify-center">Профиль не найден</div>;

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
                className={`px-4 py-2 ${activeTab === "friends" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer`}
                onClick={() => setActiveTab("friends")}
              >
                Друзья
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
                      {favoritesData.map((anime) => {
                        const status = userData.watchStatus?.find((ws) => ws.imdbID === anime.imdbID)?.status || "plan_to_watch";
                        const statusText = {
                          plan_to_watch: "Буду смотреть",
                          watching: "Смотрю",
                          completed: "Просмотрено",
                          dropped: "Брошено",
                        }[status];

                        return (
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
                            <div>
                              <span className="text-lg">{anime.Title}</span>
                              <p className="text-sm text-gray-400">Статус: {statusText}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>У вас пока нет избранного</p>
                  )}
                </>
              )}

              {activeTab === "friends" && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl mb-2">Друзья:</h2>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={friendUsername}
                      onChange={(e) => setFriendUsername(e.target.value)}
                      placeholder="Введите имя пользователя"
                      className="p-2 rounded bg-gray-800 text-white w-full mb-2"
                    />
                    <button
                      onClick={handleSendFriendRequest}
                      className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Отправить запрос
                    </button>
                  </div>

                  <h3 className="text-lg">Ваши друзья:</h3>
                  {friendsData.length > 0 ? (
                    <ul className="space-y-2">
                      {friendsData.map((friend) => (
                        <li key={friend._id} className="flex items-center gap-2">
                          <img
                            src={friend.avatar}
                            alt={friend.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span
                            onClick={() => navigate(`/profile/${friend._id}`)}
                            className="cursor-pointer hover:underline"
                          >
                            {friend.username}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>У вас пока нет друзей</p>
                  )}

                  <h3 className="text-lg mt-4">Ожидающие запросы:</h3>
                  {pendingRequests.length > 0 ? (
                    <ul className="space-y-2">
                      {pendingRequests.map((request) => (
                        <li key={request._id} className="flex items-center gap-2">
                          <img
                            src={request.userId.avatar}
                            alt={request.userId.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span>{request.userId.username}</span>
                          <button
                            onClick={() => handleAcceptFriendRequest(request._id)}
                            className="bg-green-500 px-2 py-1 rounded hover:bg-green-600"
                          >
                            Принять
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Нет ожидающих запросов</p>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl mb-2">Смена аватара:</h2>
                    <label className="inline-block mb-2">
                      <span className="bg-blue-500 px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                        Выбрать аватар
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>

                    {avatarPreview && (
                      <div className="mb-4">
                        <h3 className="text-lg mb-2">Превью аватара:</h3>
                        <div className="flex gap-4 items-center">
                          <div>
                            <p className="text-sm mb-1">В профиле (128x128):</p>
                            <img
                              src={avatarPreview}
                              alt="Profile Preview"
                              className="w-32 h-32 rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm mb-1">В хедере (32x32):</p>
                            <img
                              src={avatarPreview}
                              alt="Header Preview"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}

                    {avatarPreview && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleAvatarUpload}
                          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                          disabled={loading}
                        >
                          {loading ? "Загрузка..." : "Сохранить"}
                        </button>
                        <button
                          onClick={handleCancelAvatar}
                          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                          disabled={loading}
                        >
                          Отмена
                        </button>
                      </div>
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