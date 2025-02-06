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
        <div className="anime-slide p-5">
          <AnimeSlider />
          <AnimeTop/>
        </div>
      </main>
      <FooterEl />
    </div>
  );
}
export default Home;
