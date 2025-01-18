import React, { useEffect, useState } from "react";
import HeaderEl from "../components/HeaderEl";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";
import "../css/all-paddding.css";

function Profile() {
  const [setting, setSetting] = useState("");

  const handleSetting = (text) => {
    setSetting(text);
  };



  return (
    <div>
      <HeaderEl />
      <div className="all-padding Background">
        <div className="Main-Box">
        <div className="Avatar-Box">
            <input
              type="file"
              style={{ display: "none" }}
              id="avatar-upload"
            />
            <div className="Avatar-Label" htmlFor="avatar-upload">
              <div className="Avatar-Overlay">
              <img 
                className="header-avatar" 
                src="https://i.imgur.com/hepj9ZS.png" 
                alt="Avatar" />
                <i className="bi bi-plus avatar-icon"></i>
              </div>
            </div>
            <h1>w</h1>
          </div>
          <div className="Profile-Buttons">
            <button className="Profile-Button" type="button">
              Статистика
            </button>
            <button className="Profile-Button" type="button">
              Закладки
            </button>
            <button className="Profile-Button" type="button" onClick={() => handleSetting("чел....")}>
              Настройки
            </button>
          </div>
          <div className="Profile-Window">
            <div className="Window-Content">
              {setting ? (
                <div className="Setting-Content">
                  <ul>
                    <li>Изменить аватар:<input type="file" name="" id="" /></li>
                    <li>Изменить пароль</li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                  <div className="setting-button">
                    <button className="save" type="button">Сохранить</button>
                    <button className="exit" type="button">Выйти</button>
                  </div>
                </div>
              ) : (
                <p>пусто</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;