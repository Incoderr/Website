import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthModal from "./AuthModal";
import "./Header-Footer.scss";
import "../css/media.css";

function HeaderEl() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);
  //rega

    
  // Открыть/закрыть список уведомлений
  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  // Закрыть список уведомлений при клике вне области
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setIsNotificationOpen(false);
    }
  };

  // Используем моковые данные вместо запроса на сервер
  useEffect(() => {
    const mockData = [
      { id: 1, message: "Новое сообщение" },
      { id: 2, message: "У вас есть новое уведомление" },
      { id: 3, message: "Запрос подтвержден" },
    ];

    // Эмулируем задержку, как если бы данные пришли с сервера
    const fetchMockData = () => {
      setTimeout(() => {
        setNotifications(mockData);
      }, 0); // 1 секунда задержки
    };

    fetchMockData();
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="header-box">
        <nav className="nav-box">
          <ul className="nav-ul">
            <NavLink
              to={"/"}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <span className="span-st">Главная</span>
            </NavLink>
            <NavLink
              to={"/categories"}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <span className="span-st">Категории</span>
            </NavLink>
          </ul>
        </nav>
        <nav className="nav-but">
          <div className="search-box">
            <div className="jst-search">
              <input
                type="text"
                className="search-input"
                placeholder="Введите название"
              />
            </div>
            <li className="circle search-but">
              <i className="bi bi-search fs-4"></i>
            </li>
          </div>
          <div className="notification-container" ref={notificationRef}>
            <button
              className="circle notification-btn"
              onClick={toggleNotifications}
              aria-label="Уведомления"
            >
              <i
                className={`bi ${
                  notifications.length > 0 ? "bi-bell-fill" : "bi-bell-slash"
                }`}
                style={{ fontSize: "24px" }}
              ></i>
            </button>

            {/* Список уведомлений */}
            <ul
              className={`notification-list ${
                isNotificationOpen ? "open" : ""
              }`}
            >
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li className="notification-item" key={index}>
                    {notification.message}
                  </li>
                ))
              ) : (
                <li className="notification-item">Нет новых уведомлений</li>
              )}
            </ul>
          </div>
          {/* регистрация */}
          <div className="circle">
            <button>Войти</button>
            <AuthModal/>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default HeaderEl;
