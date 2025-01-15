import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalContainer, ModalWindow, FormContainerLf, FormContainerRg, Form, ButtonSt, LeftBox, RightBox, Overlay, SpanCont, SpanEl, ColBut, PassBut, PassBut1, PCont, InputBox, CloseBtn, ForgotPassword} from "../css/AuthStyle";

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
  
  return (
    <ModalContainer className={isSignUp ? "sign-up-mode" : ""}>
      <ModalWindow>
        {/* Left side */}
        <LeftBox>
          <FormContainerLf>
            <h2>Login</h2>
            <Form>
              <InputBox>
                <label>Никнейм</label>
                <SpanCont>
                  <SpanEl><i className="bi bi-person-fill"></i></SpanEl>
                  <input
                    className="auth-input"
                    type="text"
                    name="username"
                    value={loginData.username}
                    placeholder="Введите никнейм или email"
                    onChange={(e) => handleInputChange(e, "login")}
                  />
                </SpanCont>
              </InputBox>
              <InputBox>
                <label>Пароль</label>
                <SpanCont>
                  <SpanEl><i className="bi bi-lock-fill"></i></SpanEl>
                  <PassBut1 type="button" onClick={toggleLoginPasswordVisibility}>
                    {loginPasswordVisible ? (
                      <i className="bi bi-eye-fill"></i>
                    ) : (
                      <i className="bi bi-eye-slash-fill"></i>
                    )}
                  </PassBut1>
                  <input
                    className="password auth-input"
                    type={loginPasswordVisible ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    placeholder="Введите пароль"
                    onChange={(e) => handleInputChange(e, "login")}
                  />
                </SpanCont>
              </InputBox>
              <ForgotPassword>
                <button type="button">Забыли пароль?</button>
              </ForgotPassword>
              <hr />
              <PCont>
                Не зарегистрированы?
                <ColBut type="button" onClick={toggleView}>
                  Зарегистрироваться
                </ColBut>
              </PCont>
              <ButtonSt type="button">Войти</ButtonSt>
            </Form>
          </FormContainerLf>
        </LeftBox>
        {/* Right side */}
        <RightBox>
          <FormContainerRg>
            <h2>Регистрация</h2>
            <Form>
              <InputBox>
                <label>Никнейм</label>
                <SpanCont>
                  <SpanEl><i className="bi bi-person-fill"></i></SpanEl>
                  <input
                    className="auth-input"
                    type="text"
                    name="username"
                    value={signUpData.username}
                    placeholder="Придумайте никнейм"
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                </SpanCont>
              </InputBox>
              <InputBox>
                <label>Почта</label>
                <SpanCont>
                  <SpanEl><i className="bi bi-at"></i></SpanEl>
                  <input
                    className="auth-input"
                    type="email"
                    name="email"
                    value={signUpData.email}
                    placeholder="Введите email"
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                </SpanCont>
              </InputBox>
              <InputBox>
                <label>Пароль</label>
                <SpanCont>
                  <SpanEl><i className="bi bi-lock-fill"></i></SpanEl>
                  <PassBut type="button" onClick={toggleSignUpPasswordVisibility}>
                    {signUpPasswordVisible ? (
                      <i className="bi bi-eye-fill"></i>
                    ) : (
                      <i className="bi bi-eye-slash-fill"></i>
                    )}
                  </PassBut>
                  <input
                    className="password auth-input"
                    type={signUpPasswordVisible ? "text" : "password"}
                    name="password"
                    value={signUpData.password}
                    placeholder="Придумайте пароль"
                    onChange={(e) => handleInputChange(e, "signUp")}
                  />
                </SpanCont>
              </InputBox>
              <hr />
              <PCont>
                Уже есть аккаунт?
                <ColBut type="button" onClick={toggleView}>
                  Войти
                </ColBut>
              </PCont>
              <ButtonSt type="button">Зарегистрироваться</ButtonSt>
            </Form>
          </FormContainerRg>
        </RightBox>
        {/* Close Button */}
        <CloseBtn type="button" onClick={handleClose}>Закрыть</CloseBtn>
        {/* Overlay */}
        <Overlay className="overlay"/>
      </ModalWindow>
    </ModalContainer>
  );
};

export default Auth;