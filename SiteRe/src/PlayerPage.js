import React, { useState } from "react";
import './Player-page.css';


function PlayerPage() {
// Состояния для иконок
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isTracked, setIsTracked] = useState(false);
// Обработчики кликов
  const toggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
};
  const toggleTrack = () => {
    setIsTracked((prev) => !prev);
};


//Плеер
    const src = "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd";
  
 return (  
  <div>
    <header>
        <div className="logo">
            <i className="bi bi-camera-reels-fill fs-2"></i>
            <h2>Label</h2>
        </div>
        <div className="search-box">
            <input type="text" name="Поиск" id="" placeholder="Поиск"/>
        </div>
        <div className="nav-bar">
            <nav className="nav-box">
                <ul>
                    <li>Главная</li>
                    <li>Категории</li>
                    <li>Профиль</li>
                </ul>
            </nav>
        </div>
    </header>
    <main>
        <div className="container">
            <div className="box-content">
                <div className="info">
                    <div className="image-info">
                        <img src="55.jpg" alt="Poster"/>
                        <button className="bookmark" onClick={toggleBookmark}>
                            <i className={`bi ${isBookmarked ? "bi-bookmark-fill fs-5" : "bi-bookmark fs-5  "}`} />Буду смотреть</button>
                        <button className="bookmark track" onClick={toggleTrack}>
                            <i className={`bi ${isTracked ? "bi-bell-fill fs-5" : "bi-bell fs-5"}`} />Отслеживать</button>
                    </div>
                    <div className="more-info">
                        <h2>Название</h2>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati, optio accusamus est fugit sit quia labore quod rem, modi autem delectus eaque natus a perferendis ipsum doloremque vel voluptatibus beatae?
                        </p>
                        <h2 className="inf">Год выпуска:<a href="">2020</a></h2>
                        <h2 className="inf">Жанр:<a href="">Комедия,Хоррор,Детектив</a></h2>
                    </div>
                </div>
                <div className="video-box">
                   <div className="player">
                       
                   </div>
                </div>
                <div className="test">

                </div>
            </div>
        </div>
    </main>
    <footer>

    </footer>
  </div>
  );
}

export default PlayerPage;
