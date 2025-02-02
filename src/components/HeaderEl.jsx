import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react"; // Импортируем Swiper
import { Mousewheel } from 'swiper/modules';
import axios from "axios";

import "../components/hed.css";

function HeaderEl() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notificationRef = useRef(null);

  const toggleNotifications = () => {
    if (isSearchOpen) setIsSearchOpen(false);
    setIsNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check notification dropdown
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target) && 
        !event.target.closest('.notification-box')
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="header-container">
        <div className="left">
          {/*<NavLink
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
          </NavLink>*/}
          
        </div>
        <div className="right">
          <div className="search-box">
            <Link to={"/search"}>
              <i className="bi bi-search fs-4"></i>
            </Link>
          </div>
          <div className="notification-box">
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
          </div>
        </div>
      </div>
      {/* Дропдаун уведы */}
      {isNotificationOpen && (
        <div ref={notificationRef} className="notification-dropdown">
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
