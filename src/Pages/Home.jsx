import React from "react";
import "../css/style.scss";
import "../css/media.css";
import "../css/Home.css";
import { Link } from "react-router-dom";
/*кампоненты*/
import HeaderEl from "../components/HeaderEl";
import FooterEl from "../components/FooterEl";
import AnimeSlider from "../components/AnimeSlider";
import HomeAnimeSlider from "../components/HomeAnimeSlider";
/*свайпер*/
import "../css/all-paddding.css";

function Home() {
  return (
    <div className="media">
      <HeaderEl />
      <main>
        <HomeAnimeSlider/>
        <div className="home-container">
          <div className="label"><h1>В топе</h1></div>
          <AnimeSlider />
          <div className="label"><h1>Популярно</h1></div>
          <AnimeSlider />
          <div className="label"><h1>Новые серии</h1></div>
          <AnimeSlider />
        </div>
      </main>
      <FooterEl />
    </div>
  );
}
export default Home;
