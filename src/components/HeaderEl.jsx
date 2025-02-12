import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react"; // Импортируем Swiper
import { Mousewheel } from 'swiper/modules';
import { BsSearch,BsBellSlash, } from "react-icons/bs";
import axios from "axios";



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
    <header className="z-30 backdrop-blur-[4px] w-full h-14 flex justify-center items-center fixed">
      <div className="flex w-full ml-8 mr-8 justify-between lg:mr-23 lg:ml-23">
        <div className="flex gap-5 text-lg">
          <NavLink
            to={"/"}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Аниме
          </NavLink>
          <NavLink
            to={"/film"}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Фильмы
          </NavLink>
          
        </div>
        <div className="flex items-center gap-4">
          <div className="hover:scale-95 transition delay-15 ease-in-out">
            <Link to={"/search"}>
              <BsSearch className="text-[23px]" />
            </Link>
          </div>
          <div className="hover:scale-95 transition delay-15 ease-in-out">
            <button
              type="button"
              onClick={toggleNotifications}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <BsBellSlash className="text-[23px]" />
            </button>
          </div>
          <div className="text-lg">
            <Link className="" to={"/auth"}>
              Войти
            </Link>
          </div>
        </div>
      </div>
      {/* Дропдаун уведы */}
      {isNotificationOpen && (
        <div ref={notificationRef} className="absolute top-14 right-22 z-10">
          <div className="bg-gray-500 p-5 rounded-md">
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
