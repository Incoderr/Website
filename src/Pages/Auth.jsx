import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Auth.scss";

const Auth = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signUpData, setSignUpData] = useState({ username: "", email: "", password: "" });
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [signUpPasswordVisible, setSignUpPasswordVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const toggleView = () => {
    setIsSignUp(!isSignUp);
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignUpData({ ...signUpData, [name]: value });
    }
  };

  const toggleLoginPasswordVisibility = () => {
    setLoginPasswordVisible(!loginPasswordVisible);
  };

  const toggleSignUpPasswordVisibility = () => {
    setSignUpPasswordVisible(!signUpPasswordVisible);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      });      
      if (response.ok) {
        navigate("/profile");
      } else {
        const errorData = await response.json();
        console.error("Registration failed", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        navigate("/profile");
      } else {
        const errorData = await response.json();
        console.error("Login failed", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <div className={`modal-container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="modal-window">
        {/* Left side */}
        <div className="left-box">
          <div className="form-container-lf">
            <h2>Login</h2>
            <form>
              <div className="input-box">
                <label>Никнейм</label>
                <div className="span-cont">
                  <span className="span-el"><i className="bi bi-person-fill"></i></span>
                  <input
                    className="auth-input"
                    type="text"
                    name="username"
                    value={loginData.username}
                    placeholder="Введите никнейм или email"
                    onChange={(e) => handleInputChange(e, "login")}
                  />
                </div>
              </div>
              <div className="input-box">
                <label>Пароль</label>
                <div className="span-cont">
                  <span className="span-el"><i className="bi bi-lock-fill"></i></span>
                  <button type="button" className="pass-but1" onClick={toggleLoginPasswordVisibility}>
                    {loginPasswordVisible ? (
                      <i className="bi bi-eye-fill"></i>
                    ) : (
                      <i className="bi bi-eye-slash-fill"></i>
                    )}
                  </button>
                  <input
                    className="password auth-input"
                    type={loginPasswordVisible ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    placeholder="Введите пароль"
                    onChange={(e) => handleInputChange(e, "login")}
                  />
                </div>
              </div>
              <div className="forgot-password">
                <button type="button">Забыли пароль?</button>
              </div>
              <hr />
              <p className="p-cont">
                Не зарегистрированы?
                <button className="col-but" type="button" onClick={toggleView}>
                  Зарегистрироваться
                </button>
              </p>
              <button type="button" className="button-st" onClick={handleLogin}>Войти</button>
            </form>
          </div>
        </div>
        {/* Right side */}
        <div className="right-box">
          <div className="form-container-rg">
            <h2>Регистрация</h2>
            <form>
              <div className="input-box">
                <label>Никнейм</label>
                <div className="span-cont">
                  <span className="span-el"><i className="bi bi-person-fill"></i></span>
                  <input
                    className="auth-input"
                    type="text"
                    name="username"
                    value={signUpData.username}
                    placeholder="Придумайте никнейм"
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                </div>
              </div>
              <div className="input-box">
                <label>Почта</label>
                <div className="span-cont">
                  <span className="span-el"><i className="bi bi-at"></i></span>
                  <input
                    className="auth-input"
                    type="email"
                    name="email"
                    value={signUpData.email}
                    placeholder="Введите email"
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                </div>
              </div>
              <div className="input-box">
                <label>Пароль</label>
                <div className="span-cont">
                  <span className="span-el"><i className="bi bi-lock-fill"></i></span>
                  <button type="button" className="pass-but" onClick={toggleSignUpPasswordVisibility}>
                    {signUpPasswordVisible ? (
                      <i className="bi bi-eye-fill"></i>
                    ) : (
                      <i className="bi bi-eye-slash-fill"></i>
                    )}
                  </button>
                  <input
                    className="password auth-input"
                    type={signUpPasswordVisible ? "text" : "password"}
                    name="password"
                    value={signUpData.password}
                    placeholder="Придумайте пароль"
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                </div>
              </div>
              <hr />
              <p className="p-cont">
                Уже есть аккаунт?
                <button className="col-but" type="button" onClick={toggleView}>
                  Войти
                </button>
              </p>
              <button type="button" className="button-st" onClick={handleSignUp}>Зарегистрироваться</button>
            </form>
          </div>
        </div>
        {/* Close Button */}
        <button className="close-btn" type="button" onClick={handleClose}>Закрыть</button>
        {/* Overlay */}
        <div className="overlay"></div>
      </div>
    </div>
  );
};

export default Auth;
