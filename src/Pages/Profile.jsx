import React, { useEffect, useState } from "react";
import HeaderEl from "../components/HeaderEl";
import { useNavigate } from "react-router-dom";
import { MainBox, AvatarBox, ProfileButtons, Background, ProfileButton, ProfileWindow, AvatarOverlay, AvatarLabel, WindowContent, SettingContent} from "../css/ProfileStyle";

function Profile() {
  const [setting, setSetting] = useState("");

  const handleSetting = (text) => {
    setSetting(text);
  };



  return (
    <div>
      <HeaderEl />
      <Background className="all-paddding">
        <MainBox>
        <AvatarBox>
            <input
              type="file"
              style={{ display: "none" }}
              id="avatar-upload"
            />
            <AvatarLabel htmlFor="avatar-upload">
              <AvatarOverlay>
              <img 
                className="header-avatar" 
                src="https://i.imgur.com/hepj9ZS.png" 
                alt="Avatar" />
                <i className="bi bi-plus avatar-icon"></i>
              </AvatarOverlay>
            </AvatarLabel>
            <h1>w</h1>
          </AvatarBox>
          <ProfileButtons>
            <ProfileButton type="button">
              Статистика
            </ProfileButton>
            <ProfileButton type="button">
              Закладки
            </ProfileButton>
            <ProfileButton type="button" onClick={() => handleSetting("чел....")}>
              Настройки
            </ProfileButton>
          </ProfileButtons>
          <ProfileWindow>
            <WindowContent>
              {setting ? (
                <SettingContent>
                  <p>Изменить аватар</p>
                  <p>Изменить пароль</p>
                  <button type="button">Сохранить</button>
                </SettingContent>
              ) : (
                <p>пусто</p>
              )}
            </WindowContent>
          </ProfileWindow>
        </MainBox>
      </Background>
    </div>
  );
}

export default Profile;