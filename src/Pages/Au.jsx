import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IoPerson,
  IoLockClosed,
  IoAtOutline,
  IoEye,
  IoEyeOff,
} from "react-icons/io5";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ login: "", password: "" });
  const [signupData, setSignupData] = useState({
    login: "",
    email: "",
    password: "",
  });
  const {
    register,
    formState: { errors },
  } = useForm();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Login data:", loginData); // Логируем данные для отладки
      const response = await axios.post(`${API_URL}/api/login`, loginData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Проверка на пустые поля
      if (!signupData.login || !signupData.email || !signupData.password) {
        console.error("Signup error: Все поля должны быть заполнены");
        return;
      }
      console.log("Signup data:", signupData); // Логируем данные для отладки
      const response = await axios.post(`${API_URL}/api/register`, signupData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/profile");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  const toggleForm = () => setIsLogin(!isLogin);
  const togglePasswordVisibilityLogin = () =>
    setShowPasswordLogin(!showPasswordLogin);
  const togglePasswordVisibilitySignup = () =>
    setShowPasswordSignup(!showPasswordSignup);
  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e) =>
    setSignupData({ ...signupData, [e.target.name]: e.target.value });

  return (
    <div>
      <div className="flex min-h-screen justify-center items-center ">
        <div className="">
          <form onSubmit={isLogin ? handleLogin : handleSignup}>
            {isLogin ? (
              <div className="p-5 bg- w-79 h-100 gap-2 items-center flex-col flex outline-white/70 outline-1 rounded-md">
                <h1 className="text-2xl">Войти</h1>
                <label className="w-full flex flex-col">
                  <h6 className="mb-2">Логин или почта:</h6>
                  <div className="flex items-center">
                    <IoPerson className="absolute ml-2 text-lg" />
                    <input
                      type="text"
                      name="login"
                      value={loginData.login}
                      onChange={handleLoginChange}
                      placeholder="Введите логин или почту"
                      className="w-full h-10 rounded-md pl-8 pr-2 bg-gray-800 outline-none focus:ring-blue-600 focus:ring-1"
                    />
                  </div>
                </label>
                <label className="flex w-full flex-col">
                  <h6 className="mb-2">Пароль:</h6>
                  <div className="flex items-center">
                    <IoLockClosed className="absolute ml-2 text-lg" />
                    <input
                      type={showPasswordLogin ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Введите пароль"
                      className="outline-1 w-full h-10 rounded-md pl-8 pr-8 bg-gray-800 outline-none focus:ring-blue-600 focus:ring-1"
                    />
                    <div className="flex items-center relative">
                      {showPasswordLogin ? (
                        <IoEye
                          onClick={togglePasswordVisibilityLogin}
                          className="cursor-pointer absolute mr-2 right-0 text-lg"
                        />
                      ) : (
                        <IoEyeOff
                          onClick={togglePasswordVisibilityLogin}
                          className="cursor-pointer absolute mr-2 right-0 text-lg"
                        />
                      )}
                    </div>
                  </div>
                </label>
                <div className="flex gap-5 mt-4 text-center flex-col">
                  <p onClick={toggleForm} className="cursor-pointer select-none">
                    Нет аккаунта?
                  </p>
                  <p className="cursor-pointer">Забыли пароль?</p>
                </div>
                <button
                  className="select-none bg-white mt-auto cursor-pointer sm:hover:scale-102 duration-300 text-black p-2 w-full rounded-md text-lg"
                  type="submit"
                >
                  Войти
                </button>
              </div>
            ) : (
              <div className="p-5 bg- w-79 h-100 gap-2 items-center flex-col flex outline-white/70 outline-1 rounded-md">
                <h1 className="text-2xl">Регистрация</h1>
                <label className="flex w-full flex-col">
                  <h6 className="mb-2">Логин:</h6>
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="login"
                      value={signupData.login}
                      onChange={handleSignupChange}
                      placeholder="Придумайте никнейм"
                      className="outline-1 w-full h-10 rounded-md pl-8 pr-2 bg-gray-800 outline-none focus:ring-blue-600 focus:ring-1"
                    />
                    <IoPerson className="absolute ml-2 text-lg" />
                  </div>
                </label>
                <label className="flex w-full flex-col">
                  <h6 className="mb-2">Email:</h6>
                  <div className="flex items-center">
                    <IoAtOutline className="absolute ml-2 text-2xl" />
                    <input
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder="Введите почту"
                      className="outline-1 w-full h-10 rounded-md pl-9 pr-2 bg-gray-800 outline-none focus:ring-blue-600 focus:ring-1"
                    />
                  </div>
                </label>
                <label className="flex w-full flex-col">
                  <h6 className="mb-2">Пароль:</h6>
                  <div className="flex items-center">
                    <IoLockClosed className="absolute ml-2 text-lg" />
                    <input
                      type={showPasswordSignup ? "text" : "password"}
                      name="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Придумайте пароль"
                      className="outline-1 w-full h-10 rounded-md pl-8 pr-8 bg-gray-800 outline-none focus:ring-blue-600 focus:ring-1"
                    />
                    <div className="flex items-center relative">
                      {showPasswordSignup ? (
                        <IoEye
                          onClick={togglePasswordVisibilitySignup}
                          className="cursor-pointer absolute mr-2 right-0 text-lg"
                        />
                      ) : (
                        <IoEyeOff
                          onClick={togglePasswordVisibilitySignup}
                          className="cursor-pointer absolute mr-2 right-0 text-lg"
                        />
                      )}
                    </div>
                  </div>
                </label>
                <p className="cursor-pointer select-none" onClick={toggleForm}>
                  Уже есть аккаунт?
                </p>
                <button
                  className="select-none bg-white mt-auto cursor-pointer sm:hover:scale-102 duration-300 text-black p-2 w-full rounded-md text-lg"
                  type="submit"
                >
                  Зарегистрироваться
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
