import React, { useState } from "react";
import '../css/Player-page.css';
import HeaderEl from "../components/HeaderEl";

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


return  (  
  <div>
    <HeaderEl/>
    <main>
        <div className="container">
            <div className="box-content">
                <div className="info">
                    <div className="image-info">
                    <img src="#" alt="Poster"/>
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
                    hi
                </div>
            </div>
        </div>
    </main>
    <footer>

    </footer>
  </div>
  )
  
};

export default PlayerPage;
