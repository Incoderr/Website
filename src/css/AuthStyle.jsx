import styled from "styled-components";

export const ModalContainer = styled.div`
  background: rgb(43, 45, 55);
  background: radial-gradient(
    circle,
    rgb(33, 33, 63) 0%,
    rgb(18, 18, 27) 50%,
    rgba(0, 0, 0, 1) 100%
  );
  width: 100%;
  height: 100%;
  position: absolute;

  &.sign-up-mode {
    .overlay {
      transform: translateX(0);
    }
    .left-box {
      transform: translateX(100%);
    }
    .right-box {
      transform: translateX(0);
    }
  }
`;

export const ModalWindow = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const FormContainerLf = styled.div`
  background-color: #000000;
  padding: 20px;
  outline: solid 1px #ffffff9f;
  display: block;
  justify-items: center;
  flex-direction: column;
  border-radius: 10px;
`;

export const FormContainerRg = styled.div`
  background-color: #000000;
  padding: 20px;
  outline: solid 1px #ffffff9f;
  display: block;
  justify-items: center;
  flex-direction: column;
  border-radius: 10px;
`;

export const Form = styled.form`
  flex-direction: column;
  display: flex;
  gap: 20px;

  hr {
    margin: 0;
  }
`;

export const ButtonSt = styled.button`
  background-color: #ffffff;
  color: #000000;
  border-radius: 5px;
  height: 38px;
`;

export const LeftBox = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
`;

export const RightBox = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
`;

export const Overlay = styled.div`
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  z-index: 2;
  transition: transform 0.5s ease-in-out;
  transform: translateX(100%);
`;

export const SpanCont = styled.div`
  display: flex;
  align-items: center;
`;

export const SpanEl = styled.span`
  position: absolute;
  margin-left: 5px;
`;

export const ColBut = styled.button`
  color: #4d68ff;
`;

export const PassBut = styled.button`
  position: absolute;
  margin-left: 223px;
`;

export const PassBut1 = styled.button`
  position: absolute;
  margin-left: 300px;
`;

export const PCont = styled.p`
  text-align: center;

  button{
    background-color: rgba(0, 0, 0, 0);
  }
`;

export const InputBox = styled.div`
  label {
    margin-bottom: 5px;
  }
  .auth-input {
    height: 38px;
    color: #ffffff;
    background-color: black;
    outline: solid 1px #ffffff;
    border-radius: 5px;
    padding-left: 22px;
    border-color: #00000000;
    transition: ease-in-out 0.2s;
    width: 100%;
  }
  .auth-input:focus {
    outline: solid 1px #4d68ff;
  }
  .password {
    padding-right: 25px;
  }

  button{
    background-color: rgba(0, 0, 0, 0);
  }
`;

export const CloseBtn = styled.button`
  background-color: #ffffff;
  color: #000000;
  border-radius: 5px;
  height: 38px;
  margin: 20px;
  z-index: 1;
  padding: 3px;
`;

export const ForgotPassword = styled.div`
  margin-left: auto;

  button{
    background-color: rgba(0, 0, 0, 0);
  }
`;
