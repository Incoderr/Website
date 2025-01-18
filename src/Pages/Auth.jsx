import React, { useState } from "react";
import "../css/Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);

  // State for login form
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  // State for signup form
  const [signupData, setSignupData] = useState({
    signupLogin: "",
    email: "",
    signupPassword: "",
  });

  // Handle login form input change
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle signup form input change
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // Toggle password visibility
  const togglePasswordVisibilityLogin = () => {
    setShowPasswordLogin(!showPasswordLogin);
  };

  const togglePasswordVisibilitySignup = () => {
    setShowPasswordSignup(!showPasswordSignup);
  };

  // Handle login form submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(loginData));
  };

  // Handle signup form submit
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(signupData));
  };

  return (
    <div className="bg">
      <div className="form-box">
        <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}>
          {isLogin ? (
            <div className="login-container">
              <h1>Войти</h1>
              <label>
                <h6>Логин или почта:</h6>
                <div className="span-icon">
                  <span>
                    <i className="bi bi-person-fill fs-5 icon"></i>
                  </span>
                  <input
                    type="text"
                    name="login"
                    value={loginData.login}
                    onChange={handleLoginChange}
                    placeholder="Введите логин или почту"
                    required
                  />
                </div>
              </label>
              <label>
                <h6>Пароль:</h6>
                <div className="form-icon">
                  <span>
                    <i className="bi bi-lock-fill fs-5 icon"></i>
                  </span>
                  <span onClick={togglePasswordVisibilityLogin}>
                    <i
                      className={`bi ${
                        showPasswordLogin ? "bi-eye-fill" : "bi-eye-slash-fill"
                      } fs-5 icon password`}
                    ></i>
                  </span>
                  <input
                    type={showPasswordLogin ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Введите пароль"
                    required
                    className="password-input"
                  />
                </div>
              </label>
              <p className="no-account" onClick={toggleForm}>
                Нет аккаунта?
              </p>
              <button className="form-but" type="submit">
                Войти
              </button>
            </div>
          ) : (
            <div className="signup-container">
              <h1>Регистрация</h1>
              <label>
                <h6>Логин:</h6>
                <div className="form-icon">
                  <span>
                    <i className="bi bi-person-fill fs-5 icon"></i>
                  </span>
                  <input
                    type="text"
                    name="signupLogin"
                    value={signupData.signupLogin}
                    onChange={handleSignupChange}
                    placeholder="Придумайте никнейм"
                    required
                  />
                </div>
              </label>
              <label>
                <h6>Email:</h6>
                <div className="form-icon">
                  <span>
                    <i className="bi bi-at fs-5 icon"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    placeholder="Введите почту"
                    required
                  />
                </div>
              </label>
              <label>
                <h6>Пароль:</h6>
                <div className="form-icon">
                  <span>
                    <i className="bi bi-lock-fill fs-5 icon"></i>
                  </span>
                  <span onClick={togglePasswordVisibilitySignup}>
                    <i
                      className={`bi ${
                        showPasswordSignup ? "bi-eye-fill" : "bi-eye-slash-fill"
                      } fs-5 icon password`}
                    ></i>
                  </span>
                  <input
                    type={showPasswordSignup ? "text" : "password"}
                    name="signupPassword"
                    value={signupData.signupPassword}
                    onChange={handleSignupChange}
                    placeholder="Придумайте пароль"
                    required
                    className="password-input"
                  />
                </div>
              </label>
              <p className="no-account" onClick={toggleForm}>
                Уже есть аккаунт?
              </p>
              <button className="form-but" type="submit">
                Зарегистрироватся
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
