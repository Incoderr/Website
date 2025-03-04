import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { BsSearch, BsBookmark } from "react-icons/bs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API_URL } from '../assets/config';

// Функция для получения данных профиля с избранным
const fetchFavorites = async (token) => {
  if (!token) throw new Error("Токен отсутствует");
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Ошибка при загрузке избранного");
  const data = await response.json();
  return data.favoritesData || [];
};

function HeaderEl() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const favoritesRef = useRef(null);
  const bookmarkRef = useRef(null);
  const queryClient = useQueryClient();

  // Используем useQuery для получения избранного
  const { data: favoritesData = [], isLoading, error } = useQuery({
    queryKey: ["favorites", token], // Уникальный ключ с токеном
    queryFn: () => fetchFavorites(token),
    enabled: !!token, // Запрос выполняется только если есть токен
    staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут
    cacheTime: 10 * 60 * 1000, // Данные хранятся в кэше 10 минут
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.invalidateQueries(["favorites"]); // Очищаем кэш избранного
    window.location.reload();
  };

  const toggleFavorites = (e) => {
    e.stopPropagation();
    if (isSearchOpen) setIsSearchOpen(false);
    setIsFavoritesOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        favoritesRef.current &&
        !favoritesRef.current.contains(event.target) &&
        !bookmarkRef.current.contains(event.target)
      ) {
        setIsFavoritesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="z-1000 backdrop-blur-[4px] w-full h-14 flex justify-center items-center fixed">
      <div className="flex w-full ml-8 mr-8 justify-between lg:mr-23 lg:ml-23">
        <div className="flex gap-5 text-lg">
          <NavLink to={"/"} className={({ isActive }) => (isActive ? "active-link" : "")}>
            Главная
          </NavLink>
        </div>
        <div className="flex items-center gap-4">
          <Link to={"/search"} className="">
            <BsSearch className="text-[23px]" />
          </Link>
          <button
            ref={bookmarkRef}
            type="button"
            onClick={toggleFavorites}
            style={{ background: "none", border: "none", cursor: "pointer" }}
            className="relative"
          >
            <BsBookmark className="text-[23px]" />
          </button>
          {user.username ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              </Link>
              <button onClick={handleLogout} className="text-lg cursor-pointer">
                Выйти
              </button>
            </div>
          ) : (
            <Link className="text-lg" to={"/auth"}>
              Войти
            </Link>
          )}
        </div>
      </div>
      {isFavoritesOpen && (
        <div
          ref={favoritesRef}
          className="absolute  right-0 mr-5 lg:mr-19 flex gap-3 flex-col top-20 z-100 bg-gray-700 p-2 rounded-md max-w-100 max-h-100 overflow-y-auto shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <p className="text-sm w-64">Загрузка избранного...</p>
          ) : error ? (
            <p className="text-sm w-64 text-red-500">Ошибка загрузки избранного</p>
          ) : token && favoritesData.length > 0 ? (
            favoritesData.map((anime) => (
              <Link
                key={anime.imdbID}
                to={`/player/${anime.imdbID}`}
                className="flex items-center gap-2 p-2 bg-gray-800 rounded-md h-30 hover:scale-104 duration-300"
                onClick={() => setIsFavoritesOpen(false)}
              >
                <div className="flex">
                  <div>
                    <img
                      src={anime.Poster}
                      alt={anime.Title}
                      className="w-18 h-23 object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-4 w-55">
                    <span className="text-lg break-after-all">{anime.Title}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : token ? (
            <p className="text-sm w-64">У вас пока нет избранного</p>
          ) : (
            <p className="text-sm w-64">Войдите, чтобы увидеть избранное</p>
          )}
        </div>
      )}
    </header>
  );
}

export default HeaderEl;