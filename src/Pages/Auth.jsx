import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../css/Auth.css";
import "../css/media.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
    reset();
  };

  return (
    <div className="bg">
      <div className="form-box">
        <form onSubmit={handleSubmit(onSubmit)}>
          {isLogin ? (
            <div className="login-container">
              <h1>Войти</h1>
              <label>
                <h6>Логин или почта:</h6>
                <input
                  {...register("Name", {
                    required: "Обязательно к заполнению",
                    minLength: {
                      value: 3,
                      message: "Не менее 3 символов",
                    },
                  })}
                  type="text"
                />
              </label>
              <label>
                <h6>Пароль:</h6>
                <input
                  {...register("Name", {
                    required: "Обязательно к заполнению!",
                    minLength: {
                      value: 3,
                      message: "Не менее 3 символов",
                    },
                  })}
                  type="text"
                />
              </label>
              <div>
                {errors?.Name && <p>{errors?.Name?.message || "Ошибка"}</p>}
              </div>
              <button className="no-account" type="button" onClick={toggleForm}>
                Нет аккаунта?
              </button>
              <button className="form-but" type="submit" disabled={!isValid}>
                Войти
              </button>
            </div>
          ) : (
            <div className="signup-container">
              <h1>Регистрация</h1>
              <label>
                <h6>Логин:</h6>
                <input
                  {...register("Name", {
                    required: "Обязательно к заполнению",
                    minLength: {
                      value: 3,
                      message: "Не менее 3 символов",
                    },
                  })}
                  type="text"
                />
              </label>
              <label>
                <h6>Email:</h6>
                <input
                  {...register("Email", {
                    required: "Обязательно к заполнению",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Некорректный формат email",
                    },
                  })}
                  type="text"
                />
              </label>
              <label>
                <h6>Пароль:</h6>
                <input
                  {...register("Name", {
                    required: "Обязательно к заполнению!",
                    minLength: {
                      value: 3,
                      message: "Не менее 3 символов",
                    },
                  })}
                  type="text"
                />
              </label>
              <div>
                {errors?.Email && <p>{errors?.Email?.message || "Ошибка"}</p>}
              </div>
              <button className="no-account" type="button" onClick={toggleForm}>
                Уже есть аккаунт?
              </button>
              <button className="form-but" type="submit" disabled={!isValid}>
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
