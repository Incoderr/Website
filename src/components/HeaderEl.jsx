import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { BsSearch, BsBellSlash } from "react-icons/bs";

function HeaderEl() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const notificationRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const toggleNotifications = () => {
    if (isSearchOpen) setIsSearchOpen(false);
    setIsNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target) && !event.target.closest('.notification-box')) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="z-30 backdrop-blur-[4px] w-full h-14 flex justify-center items-center fixed">
      <div className="flex w-full ml-8 mr-8 justify-between lg:mr-23 lg:ml-23">
        <div className="flex gap-5 text-lg">
          <NavLink to={"/"} className={({ isActive }) => (isActive ? "active-link" : "")}>Аниме</NavLink>
          <NavLink to={"/film"} className={({ isActive }) => (isActive ? "active-link" : "")}>Фильмы</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <Link to={"/search"} className="hover:scale-95 transition delay-15 ease-in-out"><BsSearch className="text-[23px]" /></Link>
          <button type="button" onClick={toggleNotifications} style={{ background: "none", border: "none", cursor: "pointer" }} className="hover:scale-95 transition delay-15 ease-in-out">
            <BsBellSlash className="text-[23px]" />
          </button>
          {user.username ? (
            <div className="flex items-center gap-2">
              <Link to="/profile">
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              </Link>
              <button onClick={handleLogout} className="text-lg">Выйти</button>
            </div>
          ) : (
            <Link className="text-lg" to={"/auth"}>Войти</Link>
          )}
        </div>
      </div>
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