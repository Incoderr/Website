import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import "../css/media.css";
import { Header, HeaderBox, NavBox, NavUl, NavBut, Circle, SearchBox, NotificationContainer, SpanSt, SignBut } from "../css/HeaderStyle"

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
    <Header>
      <HeaderBox>
        <NavBox>
          <NavUl>
            <NavLink
              to={"/"}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <SpanSt>Главная</SpanSt>
            </NavLink>
            <NavLink
              to={"/categories"}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <SpanSt>Категории</SpanSt>
            </NavLink>
          </NavUl>
        </NavBox>
        <NavBut>
          <SearchBox>
            <button type="button" className="search-button">
              <i className="bi bi-search fs-4"></i>
            </button>
            <input className="search-input" type="text" placeholder="Введите название" />        
          </SearchBox>
          <NotificationContainer ref={notificationRef}>
            <button
              className="circle notification-btn"
              onClick={toggleNotifications}
              aria-label="Уведомления"
            >в
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
          </NotificationContainer>
          {/* регистрация */}
          <Circle>
            <SignBut type="button" className="login">Войти</SignBut>
            <SignBut type="button" className="signup">Зарегистрироватся</SignBut>
          </Circle>
        </NavBut>
      </HeaderBox>
    </Header>
  );
}

export default HeaderEl;

