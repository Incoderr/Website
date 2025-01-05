import React, { useEffect, useState } from "react";
import HeaderEl from "../components/HeaderEl";
import FooterEl from "../components/FooterEl";
import { useNavigate } from "react-router-dom";
import "../css/style.scss";

function Profile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => setUser(null)); // Если ошибка, очищаем состояние пользователя
    } else {
      setUser(null); // Если токен отсутствует
    }
  }, []);

  const handleLogout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem("token");
    // Перенаправляем на страницу входа
    navigate("/");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/api/upload-avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setAvatar(data.avatar);
        })
        .catch((error) => console.error("Error uploading avatar:", error));
    }
  };

  return (
    <div>
      <HeaderEl />
      <main className="all-paddding background">
        <div className="main-box">
        <div className="avatar-box">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="avatar-label">
              <div className="avatar-overlay">
              <img 
                className="header-avatar" 
                src={`http://localhost:5000${user?.avatar || "https://i.imgur.com/hepj9ZS.png"}`} 
                alt="Avatar" />
                <i className="bi bi-plus avatar-icon"></i>
              </div>
            </label>
            <h1>{user?.username || "Гость"}</h1>
          </div>
          <div className="profile-buttons">
            <button className="profile-button" type="button">
              Статистика
            </button>
            <button className="profile-button" type="button">
              Закладки
            </button>
            <button className="profile-button" type="button">
              Настройки
            </button>
            <button className="profile-button" type="button" onClick={handleLogout}>
              Выйти
            </button>
          </div>
          <div className="profile-window"></div>
        </div>
      </main>
      <FooterEl />
    </div>
  );
}

export default Profile;
