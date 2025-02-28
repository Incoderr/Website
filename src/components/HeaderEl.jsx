import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { BsSearch, BsBookmark } from "react-icons/bs";
import axios from "axios";

const API_URL = "https://serverr-eight.vercel.app";

function HeaderEl() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favoritesData, setFavoritesData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const favoritesRef = useRef(null);
  const bookmarkRef = useRef(null); // Ref для иконки закладок

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoritesData(response.data.favoritesData || []);
      } catch (error) {
        console.error("Ошибка при загрузке избранного:", error);
      }
    };
    fetchFavorites();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const toggleFavorites = (e) => {
    e.stopPropagation(); // Предотвращаем просачивание события
    if (isSearchOpen) setIsSearchOpen(false);
    setIsFavoritesOpen((prev) => !prev); // Используем функциональное обновление
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        favoritesRef.current &&
        !favoritesRef.current.contains(event.target) &&
        !bookmarkRef.current.contains(event.target) // Исключаем клик по иконке
      ) {
        setIsFavoritesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="z-30 backdrop-blur-[4px] w-full h-14 flex justify-center items-center fixed">
      <div className="flex w-full ml-8 mr-8 justify-between lg:mr-23 lg:ml-23">
        <div className="flex gap-5 text-lg">
          <NavLink to={"/"} className={({ isActive }) => (isActive ? "active-link" : "")}>
            Аниме
          </NavLink>
          <NavLink to={"/film"} className={({ isActive }) => (isActive ? "active-link" : "")}>
            Фильмы
          </NavLink>
        </div>
        <div className="flex items-center gap-4">
          <Link to={"/search"} className="">
            <BsSearch className="text-[23px]" />
          </Link>
          <button
            ref={bookmarkRef} // Привязываем ref к кнопке
            type="button"
            onClick={toggleFavorites}
            style={{ background: "none", border: "none", cursor: "pointer" }}
            className="  relative"
          >
            <BsBookmark className="text-[23px]" />
          </button>
          {user.username ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              </Link>
              <button onClick={handleLogout} className="text-lg">
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
          className="absolute right-0 mr-5 lg:mr-19 flex gap-3 flex-col top-20 z-10 bg-gray-700 p-2 rounded-md max-h-64 overflow-y-auto shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {token && favoritesData.length > 0 ? (
            favoritesData.map((anime) => (
              <Link
                key={anime.imdbID}
                to={`/player/${anime.imdbID}`}
                className="flex items-center gap-2 p-2 bg-gray-800 rounded-md w-64 hover:scale-104 duration-300"
                onClick={
                  () => setIsFavoritesOpen(false)}
              >
                <img
                  src={anime.Poster}
                  alt={anime.Title}
                  className="w-10 h-14 object-cover rounded-md"
                />
                <span className="text-sm truncate">{anime.Title}</span>
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