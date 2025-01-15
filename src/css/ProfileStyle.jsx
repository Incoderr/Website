import styled from "styled-components";

export const MainBox = styled.div`
  padding-top: 20px;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
`;

export const AvatarBox = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;

  img {
    border-radius: 50%;
    width: 128px;
    height: 128px;
  }
`;

export const ProfileButtons = styled.div`
  gap: 20px;
  display: flex;
  margin-bottom: 20px;
`;

export const ProfileButton = styled.button`
  background-color: #262b36;
  padding: 3px;
  border-radius: 10px;
  font-size: 22px;
`;

export const Background = styled.main`
  background-image: url("https://i.imgur.com/Rs4pQwI.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  flex-direction: column;
`;

export const ProfileWindow = styled.div`
  width: 80%;
  height: 550px;
  border-radius: 20px;
  background-color: #262b3663;
  outline: solid 1px #ffffff57;
  backdrop-filter: blur(10px);
`;

export const AvatarLabel = styled.label`
  cursor: pointer;
  position: relative;
  display: inline-block;

  .avatar-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .avatar-label:hover .header-avatar {
    opacity: 0.4;
  }
  .avatar-label:hover .avatar-icon {
    opacity: 1;
  }
`;

export const AvatarOverlay = styled.div`
  position: relative;
  display: inline-block;
`;

export const WindowContent = styled.div`
  padding: 25px;

  button{
    background-color: rgba(0,0,0,0);
  }
`;

export const SettingContent = styled.div`
  ul {
    padding: 0;
    margin: 0;
    display: flex;
    gap: 12px;
    flex-direction: column;
  }
  li {
    border-radius: 10px;
    list-style: none;
    height: 40px;
    width: 100%;
    background-color: #141c26;
    align-items: center;
    display: flex;
  }
`;
