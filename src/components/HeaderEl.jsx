import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react"; // Импортируем Swiper
import axios from "axios";

import "../components/hed.css";

function HeaderEl() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);


  const toggleSearch = () => {
    if (isNotificationOpen) setIsNotificationOpen(false);
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleNotifications = () => {
    if (isSearchOpen) setIsSearchOpen(false);
    setIsNotificationOpen(!isNotificationOpen);
  };
//result


// Реальный поиск при вводе текста

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await axios.get("https://shikimori.me/api/animes", {
          params: {
            search: query, // Динамическое значение из input
            limit: 10, // Количество результатов
          },
        });
        setResults(response.data);
      } catch (error) {
        console.error("Ошибка при выполнении поиска:", error);
      }
    };
    
    

    const debounceFetch = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceFetch);
  }, [query]);

  return (
    <header>
      <div className="header-container">
        <div className="left">
          <NavLink
            to={"/"}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Главная
          </NavLink>
          <NavLink
            to={"/categories"}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Категории
          </NavLink>
        </div>
        <div className="right">
          <div className="search-box">
            <button
              type="button"
              onClick={toggleSearch}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <i className="bi bi-search fs-4"></i>
            </button>
          </div>
          <div>
            <button 
            type="button"
            onClick={toggleNotifications}
            style={{ background: "none", border: "none", cursor: "pointer" }}
            >
            <i className="bi bi-bell-slash fs-4"></i>
            </button>
          </div>
          <div className="login">
            <Link className="login" to={"/auth"}>
              Войти
            </Link>
            <Link className="login" to={"/profile"}>
              Зарегистрироватся
            </Link>
          </div>
        </div>
      </div>
      {/* Дропдаун поиск */}
      {isSearchOpen && (
        <div className="search-dropdown">
          <div className="dropdown-input">
            <input type="text" placeholder="Введите текст для поиска..." className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="dropdawn-result">
            {results.length > 0 ? (
              <Swiper 
                spaceBetween={10} 
                slidesPerView="auto"
              > 
                {results.slice(0, 10).map((anime) => (
                  <SwiperSlide key={anime.id} className="card-container">
                    <div className="search-card">
                      <img src={`https://shikimori.me${anime.image.preview}`} alt={anime.name} />
                    </div>
                      <h3>{anime.name}</h3>
                      <p>{anime.russian}</p>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p>Нет результатов</p>
            )}
          </div>
        </div>
      )}
      {/* Дропдаун уведы */}
      {isNotificationOpen && (
        <div className="notification-dropdown">
          <div className="notification-container">
            <p>hello</p>
            <p>good morning</p>
            <p>void</p>
            <p>happy</p>
          </div>
        </div>
      )}
    </header>
  );
}

export default HeaderEl;
