import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "../css/Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);

  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    login: "",
    email: "",
    password: "",
  });

  const {
    register,
    formState: { errors },
  } = useForm();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibilityLogin = () => {
    setShowPasswordLogin(!showPasswordLogin);
  };

  const togglePasswordVisibilitySignup = () => {
    setShowPasswordSignup(!showPasswordSignup);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg">
      <Link className="close" to={"/"}>Выйти</Link>
      <div className="form-box">
        <form>
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
                  />
                </div>
                {errors.login && <p className="error">{errors.login.message}</p>}
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
                    className="password-input"
                  />
                </div>
                {errors.password && <p className="error">{errors.password.message}</p>}
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
                    name="login"
                    value={signupData.login}
                    onChange={handleSignupChange}
                    placeholder="Придумайте никнейм"
                  />
                </div>
                {errors.signupLogin && <p className="error">{errors.signupLogin.message}</p>}
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
                  />
                </div>
                {errors.email && <p className="error">{errors.email.message}</p>}
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
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    placeholder="Придумайте пароль"
                    className="password-input"
                  />
                </div>
                {errors.signupPassword && (
                  <p className="error">{errors.signupPassword.message}</p>
                )}
              </label>
              <p className="no-account" onClick={toggleForm}>
                Уже есть аккаунт?
              </p>
              <button className="form-but" type="submit">
                Зарегистрироваться
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
