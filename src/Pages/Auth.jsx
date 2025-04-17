import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IoPerson,
  IoLockClosed,
  IoAtOutline,
  IoEye,
  IoEyeOff,
  IoExitOutline,
} from "react-icons/io5";
import { API_URL } from "../assets/config";

const Auth = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPasswordLogin, setShowPasswordLogin] = React.useState(false);
  const [showPasswordSignup, setShowPasswordSignup] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onLoginSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/login`, data); // Отправляем только data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      reset();
      navigate('/profile');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Неверный логин или пароль';
      setErrorMessage(errorMsg);
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  const onSignupSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      reset();
      navigate('/profile');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Ошибка регистрации';
      if (error.response?.status === 409) {
        setErrorMessage('Аккаунт с таким email уже существует');
      } else {
        setErrorMessage(errorMsg);
      }
      console.error('Signup error:', error.response?.data || error.message);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
    reset();
  };

  const togglePasswordVisibilityLogin = () => setShowPasswordLogin(!showPasswordLogin);
  const togglePasswordVisibilitySignup = () => setShowPasswordSignup(!showPasswordSignup);

  return (
    <div className="bg-[#161a22]">
      <Link
        className="absolute top-10 left-10 bg-gray-600 rounded-md pl-2 pr-2 p-1 text-lg flex items-center gap-2"
        to={"/"}
      >
        Выйти
        <IoExitOutline className="text-2xl"/>
      </Link>
      <div className=" flex min-h-screen justify-center items-center sm:items-baseline">
        <div className="rounded-md sm:mt-40">
          <form onSubmit={handleSubmit(isLogin ? onLoginSubmit : onSignupSubmit)}>
            {isLogin ? (
              <div className="p-5 w-79 h-auto gap-2 items-center flex-col flex">
                <h1 className="text-2xl mb-6">Авторизация</h1>
                {errorMessage && (
                  <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
                )}
                <label className="w-full flex flex-col">
                  <h6 className="mb-2">Логин или почта:</h6>
                  <div className="flex items-center">
                    <IoPerson className="absolute ml-2 text-lg" />
                    <input
                      {...register("login", { required: "Поле обязательно" })}
                      type="text"
                      placeholder="Введите логин или почту"
                      className="w-full h-10 rounded-md pl-8 pr-2 bg-gray-800 outline-none focus:ring-blue-600 focus:ring-1"
                    />
                  </div>
                  {errors.login && <p className="text-red-500 text-sm mt-1">{errors.login.message}</p>}
                </label>
                <label className="flex w-full flex-col">
                  <h6 className="mb-2">Пароль:</h6>
                  <div className="flex items-center">
                    <IoLockClosed className="absolute ml-2 text-lg" />
                    <input
                      {...register("password", { required: "Поле обязательно" })}
                      type={showPasswordLogin ? "text" : "password"}
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
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </label>
                <div className="flex gap-5 mt-4 text-center">
                  <p onClick={toggleForm} className="cursor-pointer select-none">
                    Нет аккаунта?
                  </p>
                  
                  {/*<p className="cursor-pointer select-none">Забыли пароль?</p>*/}
                </div>
                <button
                  className="select-none bg-white mt-auto cursor-pointer sm:hover:scale-102 duration-300 text-black p-2 w-full rounded-md text-lg"
                  type="submit"
                >
                  Войти
                </button>
              </div>
            ) : (
              <div className="p-5 bg- w-79 h-auto gap-2 items-center flex-col flex rounded-md">
                <h1 className="text-2xl mb-6">Регистрация</h1>
                {errorMessage && (
                  <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
                )}
                <label className="flex w-full flex-col">
                  <h6 className="mb-2">Логин:</h6>
                  <div className="flex items-center">
                    <IoPerson className="absolute ml-2 text-lg" />
                    <input
                      {...register("login", {
                        required: "Поле обязательно",
                        minLength: {
                          value: 3,
                          message: "Минимум 3 символа",
                        },
                      })}
                      type="text"
                      placeholder="Придумайте никнейм"
                      className="outline-1 w-full h-10 rounded-md pl-8 pr-2 bg-gray-800 outline-none focus:ring-blue-600 focus:ring-1"
                    />
                  </div>
                  {errors.login && <p className="text-red-500 text-sm mt-1">{errors.login.message}</p>}
                </label>
                <label className="flex w-full flex-col">
                  <h6 className="mb-2">Email:</h6>
                  <div className="flex items-center">
                    <IoAtOutline className="absolute ml-2 text-2xl" />
                    <input
                      {...register("email", {
                        required: "Поле обязательно",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Неверный формат email",
                        },
                      })}
                      type="email"
                      placeholder="Введите почту"
                      className="outline-1 w-full h-10 rounded-md pl-9 pr-2 bg-gray-800 outline-none focus:ring-blue-600 focus:ring-1"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </label>
                <label className="flex w-full flex-col">
                  <h1 className="mb-2">Пароль:</h1>
                  <div className="flex items-center">
                    <IoLockClosed className="absolute ml-2 text-lg" />
                    <input
                      {...register("password", {
                        required: "Поле обязательно",
                        minLength: {
                          value: 8,
                          message: "Минимум 8 символов",
                        },
                      })}
                      type={showPasswordSignup ? "text" : "password"}
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
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
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