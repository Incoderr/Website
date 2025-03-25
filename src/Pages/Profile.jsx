import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { BsPeopleFill, BsBookmarkFill, BsGearFill, BsBarChartFill  } from "react-icons/bs";
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
  const [stats, setStats] = useState({
    plan_to_watch: 0,
    watching: 0,
    completed: 0,
    dropped: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favorites");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [friendUsername, setFriendUsername] = useState("");
  const navigate = useNavigate();
  const { username } = useParams();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const profileUsername = username || currentUser.username;

        const profileResponse = await axios.get(`${API_URL}/profile/${profileUsername}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(profileResponse.data);
        setFavoritesData(profileResponse.data.favoritesData || []);

        if (!username || username === currentUser.username) {
          const friendsResponse = await axios.get(`${API_URL}/friends`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Friends response:", friendsResponse.data);
          setFriendsData(friendsResponse.data.friends || []);
          setPendingRequests(friendsResponse.data.pendingRequests || []);

          const statsResponse = await axios.get(`${API_URL}/watch-status/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStats(statsResponse.data);
        } else {
          setFriendsData(profileResponse.data.friends || []);
          setPendingRequests([]);
          setStats({
            plan_to_watch: profileResponse.data.watchStatus?.filter(ws => ws.status === "plan_to_watch").length || 0,
            watching: profileResponse.data.watchStatus?.filter(ws => ws.status === "watching").length || 0,
            completed: profileResponse.data.watchStatus?.filter(ws => ws.status === "completed").length || 0,
            dropped: profileResponse.data.watchStatus?.filter(ws => ws.status === "dropped").length || 0,
          });
        }
      } catch (error) {
        console.error("Profile fetch error:", error.response?.data || error.message);
        if (error.response?.status === 403 || error.response?.status === 404) {
          setUserData(null);
        } else {
          navigate("/auth");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
    else navigate("/auth");
  }, [token, navigate, username]);

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
      await axios.post(
        `${API_URL}/friends/request`,
        { friendUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const friendsResponse = await axios.get(`${API_URL}/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests(friendsResponse.data.pendingRequests || []);
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
      setFriendsData(friendsResponse.data.friends || []);
      setPendingRequests(friendsResponse.data.pendingRequests || []);
      alert("Друг добавлен");
    } catch (error) {
      console.error("Ошибка при принятии запроса:", error.response?.data || error.message);
      alert("Не удалось принять запрос: " + (error.response?.data?.message || error.message));
    }
  };

  const handleStatusChange = async (imdbID, newStatus) => {
    try {
      const response = await axios.put(
        `${API_URL}/watch-status`,
        { imdbID, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({
        ...prev,
        watchStatus: response.data.watchStatus,
      }));
      const statsResponse = await axios.get(`${API_URL}/watch-status/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error.response?.data || error.message);
      alert("Не удалось обновить статус: " + (error.response?.data?.message || error.message));
    }
  };

  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  if (loading) return <div className="p-5 text-white flex justify-center"><LoadingEl /></div>;
  if (!userData) return <div className="p-5 text-white flex justify-center">Профиль не найден</div>;

  const isOwnProfile = !username || username === JSON.parse(localStorage.getItem("user") || "{}").username;

  return (
    <div>
      <Helmet>
        <title>{`AniCor | ${userData.username}`}</title>
      </Helmet>
      <HeaderEl />
      <main className="pt-[56px]">
        <div className="p-5 text-white">
          <div className="flex flex-col items-center">
            <img
              src={avatarPreview || userData.avatar || "https://i.ibb.co.com/Zyn02g6/avatar-default.webp"}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            {userData.role && (
              <p className="text-sm text-gray-400">Роль: {userData.role}</p>
            )}

            <div className="mt-4 flex items-center gap-4 flex-wrap">
              <button
                className={`px-4 py-2 ${activeTab === "favorites" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer flex gap-2 items-center`}
                onClick={() => setActiveTab("favorites")}
              >
                <BsBookmarkFill/>
                Избранное
              </button>
              {isOwnProfile && (
                <button
                  className={`px-4 py-2 ${activeTab === "friends" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer flex gap-2 items-center`}
                  onClick={() => setActiveTab("friends")}
                >
                  <BsPeopleFill/>
                  Друзья
                </button>
              )}
              <button
                className={`px-4 py-2 ${activeTab === "stats" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer flex gap-2 items-center`}
                onClick={() => setActiveTab("stats")}
              >
                <BsBarChartFill/>
                Статистика
              </button>
              {isOwnProfile && (
                <button
                  className={`px-4 py-2 ${activeTab === "settings" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer flex gap-2 items-center`}
                  onClick={() => setActiveTab("settings")}
                >
                  <BsGearFill/>
                  Настройки
                </button>
              )}
            </div>

            <div className="flex mt-6 flex-col p-10 items-center">
              {activeTab === "favorites" && (
                <>
                  <h2 className="text-xl mb-2">Избранное</h2>
                  <br />
                  {favoritesData.length > 0 ? (
                    <div className="flex gap-5 flex-wrap items-center justify-center">
                      {favoritesData.map((anime) => {
                        const status = userData.watchStatus?.find((ws) => ws.imdbID === anime.imdbID)?.status || "";
                        const statusText = {
                          "": "Не выбрано",
                          plan_to_watch: "Буду смотреть",
                          watching: "Смотрю",
                          completed: "Просмотрено",
                          dropped: "Брошено",
                        }[status];

                        return (
                          <div
                            key={anime.imdbID}
                            onClick={() => handleNavigate(anime.imdbID)}
                            className="flex w-64 h-100 group "
                          >
                            <div className="relative rounded-md overflow-hidden">
                              <img
                                src={anime.Poster}
                                alt={anime.Title}
                                className="w-full h-full object-cover rounded-md duration-300 group-hover:scale-105 z-5"
                              />
                              <div className="absolute inset-0 backdrop-blur-[3px] bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="p-4 flex justify-center flex-col">
                                  <span className="text-2xl ">{anime.Title}</span>
                                    {isOwnProfile ? (
                                  <select
                                    value={status}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleStatusChange(anime.imdbID, e.target.value)}
                                    className="mt-2 h-10 w-full cursor-pointer bg-gray-700 text-white p-1 rounded"
                                  >
                                    <option value="">Не выбрано</option>
                                    <option value="plan_to_watch">Буду смотреть</option>
                                    <option value="watching">Смотрю</option>
                                    <option value="completed">Просмотрено</option>
                                    <option value="dropped">Брошено</option>
                                  </select>
                                ) : (
                                  <p className="text-sm text-gray-400">Статус: {statusText}</p>
                                )}
                                </div>
                              </div>
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

              {activeTab === "friends" && isOwnProfile && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl mb-2">Друзья:</h2>
                  {isOwnProfile && (
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
                  )}

                  <h3 className="text-lg">Друзья:</h3>
                  {friendsData.length > 0 ? (
                    <ul className="space-y-2">
                      {friendsData.map((friend) => (
                        <li key={friend._id} className="flex items-center gap-2">
                          <img
                            src={friend.avatar || "https://i.ibb.co.com/Zyn02g6/avatar-default.webp"}
                            alt={friend.username || "Без имени"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span
                            onClick={() => navigate(`/profile/${friend.username}`)}
                            className="cursor-pointer hover:underline"
                          >
                            {friend.username || "Без имени"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>У вас пока нет друзей</p>
                  )}

                  {isOwnProfile && (
                    <>
                      <h3 className="text-lg mt-4">Ожидающие запросы:</h3>
                      {pendingRequests.length > 0 ? (
                        <ul className="space-y-2">
                          {pendingRequests.map((request) => (
                            <li key={request._id} className="flex items-center gap-2">
                              <img
                                src={request.userId.avatar || "https://i.ibb.co.com/Zyn02g6/avatar-default.webp"}
                                alt={request.userId.username || "Без имени"}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <span>{request.userId.username || "Без имени"}</span>
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
                    </>
                  )}
                </div>
              )}

              {activeTab === "stats" && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl mb-2">Статистика просмотра:</h2>
                  <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Просмотрено: {stats.completed}</span>
                        <span className="text-sm w-16 text-right">{stats.completed}</span>
                      </div>
                      <div className="w-full bg-gray-700 h-8 rounded-md overflow-hidden">
                        <div
                          className="h-full bg-green-600"
                          style={{ width: `${(stats.completed / (stats.plan_to_watch + stats.watching + stats.completed + stats.dropped || 1)) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Смотрю: {stats.watching}</span>
                        <span className="text-sm w-16 text-right">{stats.watching}</span>
                      </div>
                      <div className="w-full bg-gray-700 h-8 rounded-md overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${(stats.watching / (stats.plan_to_watch + stats.watching + stats.completed + stats.dropped || 1)) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Буду смотреть: {stats.plan_to_watch}</span>
                        <span className="text-sm w-16 text-right">{stats.plan_to_watch}</span>
                      </div>
                      <div className="w-full bg-gray-700 h-8 rounded-md overflow-hidden">
                        <div
                          className="h-full bg-yellow-600"
                          style={{ width: `${(stats.plan_to_watch / (stats.plan_to_watch + stats.watching + stats.completed + stats.dropped || 1)) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Заброшено: {stats.dropped}</span>
                        <span className="text-sm w-16 text-right">{stats.dropped}</span>
                      </div>
                      <div className="w-full bg-gray-700 h-8 rounded-md overflow-hidden">
                        <div
                          className="h-full bg-red-600"
                          style={{ width: `${(stats.dropped / (stats.plan_to_watch + stats.watching + stats.completed + stats.dropped || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-4">
                      Всего: {stats.plan_to_watch + stats.watching + stats.completed + stats.dropped}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Показаны данные за последние 6 месяцев</p>
                  </div>
                </div>
              )}

              {activeTab === "settings" && isOwnProfile && (
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