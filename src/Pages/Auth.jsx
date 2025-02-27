import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Auth.css";

const API_URL = 'https://serverr-eight.vercel.app'; // Указываем URL сервера

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ login: "", password: "" });
  const [signupData, setSignupData] = useState({ login: "", email: "", password: "" });
  const { register, formState: { errors } } = useForm();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Login data:', loginData); // Логируем данные для отладки
      const response = await axios.post(`${API_URL}/api/login`, loginData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Проверка на пустые поля
      if (!signupData.login || !signupData.email || !signupData.password) {
        console.error('Signup error: Все поля должны быть заполнены');
        return;
      }
      console.log('Signup data:', signupData); // Логируем данные для отладки
      const response = await axios.post(`${API_URL}/api/register`, signupData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/profile');
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
    }
  };

  const toggleForm = () => setIsLogin(!isLogin);
  const togglePasswordVisibilityLogin = () => setShowPasswordLogin(!showPasswordLogin);
  const togglePasswordVisibilitySignup = () => setShowPasswordSignup(!showPasswordSignup);
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });


  return (
    <div className="bg">
      <Link className="absolute top-10 left-10 bg-[#A78BFA] rounded-md p-1" to={"/"}>Выйти</Link>
      <div className="form-box">
        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {isLogin ? (
            <div className="flex gap-3 flex-col items-center">
              <h1 className="text-2xl">Войти</h1>
              <label>
                <h6 className="mb-2">Логин или почта:</h6>
                <div className="span-icon">
                  <span><i className="bi bi-person-fill fs-5 icon"></i></span>
                  <input type="text" name="login" value={loginData.login} onChange={handleLoginChange} placeholder="Введите логин или почту" />
                </div>
              </label>
              <label>
                <h6 className="mb-2">Пароль:</h6>
                <div className="form-icon">
                  <span><i className="bi bi-lock-fill fs-5 icon"></i></span>
                  <span onClick={togglePasswordVisibilityLogin}>
                    <i className={`bi ${showPasswordLogin ? "bi-eye-fill" : "bi-eye-slash-fill"} fs-5 icon password`}></i>
                  </span>
                  <input type={showPasswordLogin ? "text" : "password"} name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Введите пароль" className="password-input" />
                </div>
              </label>
              <p onClick={toggleForm}>Нет аккаунта?</p>
              <p>Забыли пароль?</p>
              <button className="form-but" type="submit">Войти</button>
            </div>
          ) : (
            <div className="signup-container">
            <h1>Регистрация</h1>
            <label>
              <h6>Логин:</h6>
              <div className="form-icon">
                <span><i className="bi bi-person-fill fs-5 icon"></i></span>
                <input type="text" name="login" value={signupData.login} onChange={handleSignupChange} placeholder="Придумайте никнейм" />
              </div>
            </label>
            <label>
              <h6>Email:</h6>
              <div className="form-icon">
                <span><i className="bi bi-at fs-5 icon"></i></span>
                <input type="email" name="email" value={signupData.email} onChange={handleSignupChange} placeholder="Введите почту" />
              </div>
            </label>
            <label>
              <h6>Пароль:</h6>
              <div className="form-icon">
                <span><i className="bi bi-lock-fill fs-5 icon"></i></span>
                <span onClick={togglePasswordVisibilitySignup}>
                  <i className={`bi ${showPasswordSignup ? "bi-eye-fill" : "bi-eye-slash-fill"} fs-5 icon password`}></i>
                </span>
                <input type={showPasswordSignup ? "text" : "password"} name="password" value={signupData.password} onChange={handleSignupChange} placeholder="Придумайте пароль" className="password-input" />
              </div>
            </label>
            <p className="no-account" onClick={toggleForm}>Уже есть аккаунт?</p>
            <button className="form-but" type="submit">Зарегистрироваться</button>
          </div>
        )}
      </form>
    </div>
  </div>
);
};

export default Auth;
