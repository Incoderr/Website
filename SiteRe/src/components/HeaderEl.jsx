import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import './Header-Footer.css'
import '../css/media.css'

function HeaderEl() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  // Функция для тестирования уведомлений
  const sendNotification = () => {
    setHasNotification(true);
    setTimeout(() => setHasNotification(false), 5000); // Убирает уведомление через 5 секунд
};

const toggleSearch = () => {
  setSearchVisible(!isSearchVisible);
};

 return  (  
    <header>
      <div className="header-box">
        <nav className="nav-box">
          <ul className="nav-ul">
              <NavLink to={'/'} className={({isActive}) => isActive ? 'active-link' : ''}><li className="li-st">Главная</li></NavLink>
              <NavLink to={'/categories'} className={({isActive}) => isActive ? 'active-link' : ''}><li className="li-st">Категории</li></NavLink>
          </ul>
        </nav>
        <div className="search-box">
          <button className="circle" onClick={toggleSearch}><i class="bi bi-search"></i></button>
            {isSearchVisible && (
              <input
                type="text"
                className="search-input"
                placeholder="Введите запрос"
              />
            )}
        </div>
        <ul className="nav-ul">
          <li className="circle">
            <i
              className={`bi ${hasNotification ? "bi-bell-fill" : "bi-bell-slash"}`}
              style={{ cursor: "pointer", fontSize: "24px" }}
              nClick={sendNotification}>
            </i>
          </li>
          <Link to={'/profile'}><li className="circle"><i class="bi bi-person-fill fs-3"></i></li></Link>
        </ul>
      </div>
    </header>
  )
};

export default HeaderEl;
