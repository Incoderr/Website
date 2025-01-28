import React from "react";
import "../css/style.scss";
import "../css/Home.scss";
import { Link } from "react-router-dom";
/*кампоненты*/
import HeaderEl from "../components/HeaderEl";
import FooterEl from "../components/FooterEl";
import AnimeSlider from "../components/AnimeSlider";
import HomeAnimeSlider from "../components/HomeAnimeSlider";
import AnimeTop from "../components/AnimeTop";
/*свайпер*/
import "../css/all-paddding.css";

function Home() {
  return (
    <div>
      <HeaderEl />
      <main>
        <HomeAnimeSlider />
        <div className="home-container">
          <div className="label">
            <h1>В топе</h1>
          </div>
          <AnimeSlider />
          <div className="label">
            <h1>Популярно</h1>
          </div>
  
          <div className="label">
            <h1>Топ-20</h1>
          </div>
          <AnimeTop/>
        </div>
      </main>
      <FooterEl />
    </div>
  );
}
export default Home;
