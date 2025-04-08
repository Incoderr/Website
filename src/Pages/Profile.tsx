import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BsPeopleFill, BsBookmarkFill, BsGearFill, BsBarChartFill, BsCollectionFill } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import HeaderEl from "../components/HeaderEl";
import LoadingEl from "../components/ui/Loading";
import FavoritesTab from "../components/FavoritesTab";
import FriendsTab from "../components/FriendsTab";
import StatsTab from "../components/StatsTab";
import CollectionsTab from "../components/CollectionsTab";
import SettingsTab from "../components/SettingsTab";
import { API_URL } from "../assets/config";

interface UserData {
  _id: string;
  username: string;
  avatar?: string;
  role?: string;
  favoritesData?: any[];
  friends?: any[];
  watchStatus?: { imdbID: string; status: string }[];
}

interface Stats {
  plan_to_watch: number;
  watching: number;
  completed: number;
  dropped: number;
}

const fetchProfileData = async (username: string | undefined, token: string) => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const profileUsername = username || currentUser.username;

  const profileResponse = await axios.get(`${API_URL}/profile/${profileUsername}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = profileResponse.data;
  if (!username || username === currentUser.username) {
    const [friendsResponse, statsResponse] = await Promise.all([
      axios.get(`${API_URL}/friends`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_URL}/watch-status/stats`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    return {
      userData: data,
      favoritesData: data.favoritesData || [],
      friendsData: friendsResponse.data.friends || [],
      pendingRequests: friendsResponse.data.pendingRequests || [],
      stats: statsResponse.data,
    };
  } else {
    return {
      userData: data,
      favoritesData: data.favoritesData || [],
      friendsData: data.friends || [],
      pendingRequests: [],
      stats: {
        plan_to_watch: data.watchStatus?.filter((ws: any) => ws.status === "plan_to_watch").length || 0,
        watching: data.watchStatus?.filter((ws: any) => ws.status === "watching").length || 0,
        completed: data.watchStatus?.filter((ws: any) => ws.status === "completed").length || 0,
        dropped: data.watchStatus?.filter((ws: any) => ws.status === "dropped").length || 0,
      },
    };
  }
};

function Profile() {
  const [activeTab, setActiveTab] = useState("favorites");
  const navigate = useNavigate();
  const { username } = useParams();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", username, token],
    queryFn: () => fetchProfileData(username, token!),
    enabled: !!token, // Запрос выполняется только если есть токен
    staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут
    cacheTime: 10 * 60 * 1000, // Данные хранятся в кэше 10 минут
    onError: (err: any) => {
      if (err.response?.status === 403 || err.response?.status === 404) {
        // Профиль не найден
      } else {
        navigate("/auth");
      }
    },
  });

  const isOwnProfile = !username || username === JSON.parse(localStorage.getItem("user") || "{}").username;

  if (isLoading) return <div className="p-3 min-h-screen text-lg flex items-center justify-center"><LoadingEl /></div>;
  if (error || !data?.userData) return <div className="p-5 text-white flex justify-center">Профиль не найден</div>;

  const { userData, favoritesData, friendsData, pendingRequests, stats } = data;

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{`AniCor - ${userData.username}`}</title>
        </Helmet>
        <HeaderEl />
        <main className="pt-[56px]">
          <div className="p-5 text-white">
            <div className="flex flex-col items-center">
              <img
                src={userData.avatar || "https://i.ibb.co.com/Zyn02g6/avatar-default.webp"}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h1 className="text-2xl font-bold">{userData.username}</h1>
              {userData.role && <p className="text-sm text-gray-400">Роль: {userData.role}</p>}

              <div className="mt-4 flex items-center gap-4 flex-wrap">
                <button
                  className={`px-4 py-2 ${activeTab === "favorites" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer flex gap-2 items-center`}
                  onClick={() => setActiveTab("favorites")}
                >
                  <BsBookmarkFill /> Избранное
                </button>
                {isOwnProfile && (
                  <button
                    className={`px-4 py-2 ${activeTab === "friends" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer flex gap-2 items-center`}
                    onClick={() => setActiveTab("friends")}
                  >
                    <BsPeopleFill /> Друзья
                  </button>
                )}
                <button
                  className={`px-4 py-2 ${activeTab === "stats" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer flex gap-2 items-center`}
                  onClick={() => setActiveTab("stats")}
                >
                  <BsBarChartFill /> Статистика
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "collections" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer flex gap-2 items-center`}
                  onClick={() => setActiveTab("collections")}
                >
                  <BsCollectionFill /> Коллекции
                </button>
                {isOwnProfile && (
                  <button
                    className={`px-4 py-2 ${activeTab === "settings" ? "bg-gray-700" : "bg-gray-800"} rounded cursor-pointer flex gap-2 items-center`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <BsGearFill /> Настройки
                  </button>
                )}
              </div>

              <div className="flex mt-6 flex-col p-10 items-center w-full">
                {activeTab === "favorites" && (
                  <FavoritesTab
                    favoritesData={favoritesData}
                    watchStatus={userData.watchStatus}
                    isOwnProfile={isOwnProfile}
                    onNavigate={navigate}
                    onStatusChange={async (imdbID, status) => {
                      await axios.put(
                        `${API_URL}/watch-status`,
                        { imdbID, status },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      queryClient.invalidateQueries(["profile", username, token]);
                    }}
                  />
                )}
                {activeTab === "friends" && isOwnProfile && (
                  <FriendsTab
                    friendsData={friendsData}
                    pendingRequests={pendingRequests}
                    onNavigate={navigate}
                    onSendFriendRequest={async (friendUsername) => {
                      await axios.post(
                        `${API_URL}/friends/request`,
                        { friendUsername },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      queryClient.invalidateQueries(["profile", username, token]);
                    }}
                    onAcceptFriendRequest={async (friendshipId) => {
                      await axios.put(
                        `${API_URL}/friends/accept/${friendshipId}`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      queryClient.invalidateQueries(["profile", username, token]);
                    }}
                  />
                )}
                {activeTab === "stats" && <StatsTab stats={stats} />}
                {activeTab === "collections" && (
                  <CollectionsTab userId={userData._id} isOwnProfile={isOwnProfile} token={token} />
                )}
                {activeTab === "settings" && isOwnProfile && (
                  <SettingsTab
                    userData={userData}
                    token={token}
                    onUpdateUserData={(updatedData) => {
                      queryClient.setQueryData(["profile", username, token], (oldData: any) => ({
                        ...oldData,
                        userData: updatedData,
                      }));
                    }}
                    onLogout={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      queryClient.invalidateQueries(["profile"]);
                      navigate("/auth");
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </HelmetProvider>
  );
}

export default Profile;