import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../css/Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

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
  const handleLoginSubmit = async (data) => {
    try {
      const response = await axios.post("https://test-site-jk7hhk6uy74hg72i4i.netlify.app/api/login", data);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.detail || "Ошибка входа");
    }
  };

  // Handle signup form submit
  const handleSignupSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/api/signup", data);
      alert(response.data.message);
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.detail;
        if (errorMessage.includes("логином")) {
          setError("signupLogin", { message: "Этот логин уже зарегистрирован" });
        }
        if (errorMessage.includes("email")) {
          setError("email", { message: "Этот email уже зарегистрирован" });
        }
      }
    }
  };

  return (
    <div className="bg">
      <div className="form-box">
        <form onSubmit={handleSubmit(isLogin ? handleLoginSubmit : handleSignupSubmit)}>
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
                    {...register("login", { required: "Логин обязателен" })}
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
                    {...register("password", { required: "Пароль обязателен" })}
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
                    {...register("signupLogin", { required: "Логин обязателен" })}
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
                    {...register("email", {
                      required: "Email обязателен",
                      validate: async (value) => {
                        try {
                          const response = await axios.post(
                            "http://localhost:8000/check-email",
                            { email: value }
                          );
                          if (!response.data.available) {
                            return "Этот email уже зарегистрирован";
                          }
                        } catch {
                          return "Ошибка проверки email";
                        }
                      },
                    })}
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
                    {...register("signupPassword", { required: "Пароль обязателен" })}
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
