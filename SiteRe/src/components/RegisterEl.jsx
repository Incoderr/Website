import React, { useState } from "react";
import "./Header-Footer.scss";

function AuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // true = форма входа, false = регистрация
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
  ? "http://localhost:5000/login"
  : "http://localhost:5000/register";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    if (response.ok) {
      const data = await response.json();
      if (isLogin) {
        localStorage.setItem("currentUser", JSON.stringify(data.user)); // Сохранить пользователя в localStorage
        onLogin(data.user); // Передать данные пользователя
        onClose();
      } else {
        alert("Регистрация прошла успешно! Теперь вы можете войти.");
        setIsLogin(true);
      }
    } else {
      alert("Ошибка! Проверьте введенные данные.");
    }
  };
  

  return (
    <div className="auth-modal">
      <div className="modal-content">
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit">{isLogin ? "Войти" : "Зарегистрироваться"}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Еще нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
        </p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}

export default AuthModal;
