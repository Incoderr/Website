import React, { useState } from "react";
import HeaderEl from "../components/HeaderEl";

function Profile({ user }) {
  const [avatar, setAvatar] = useState(user?.avatar || "../assets/image/default-avatar.jpg");
  const [file, setFile] = useState(null);

  const handleAvatarChange = async (e) => {
    e.preventDefault();

    if (!user) return; // Проверка на наличие пользователя

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("username", user.username);

    const response = await fetch("/update-avatar", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setAvatar(data.avatar); // Обновление аватара в интерфейсе
    } else {
      alert("Ошибка загрузки аватара");
    }
  };

  // Если пользователь не авторизован
  if (!user) {
    return <div>Пожалуйста, войдите в систему.</div>;
  }

  return (
    <div>
      <HeaderEl />
      <div className="profile">
        <h1>Профиль</h1>
        <img src={avatar} alt="Аватар" className="profile-avatar" />
        <p>Имя пользователя: {user.username}</p>

        <form onSubmit={handleAvatarChange}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit">Загрузить новый аватар</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
