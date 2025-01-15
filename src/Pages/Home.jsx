import React from "react";
import "../css/style.scss";
import "../css/media.css";
import "../css/Home.css";
import { Link } from "react-router-dom";
/*кампоненты*/
import HeaderEl from "../components/HeaderEl";
import FooterEl from "../components/FooterEl";
import AnimeSlider from "../components/AnimeSlider";
/*свайпер*/
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, EffectFade, } from "swiper/modules";
import "../css/all-paddding.css";

function Home() {
  return (
    <div className="media">
      <HeaderEl />
      <main>
        <div className="image-box">
          <Swiper
            spaceBetween={30} /*высота*/
            effect={"fade"}
            centeredSlides={true}
            loop={true}
            /*autoplay={{
              delay: 9000,
            }}*/
            pagination={{
              clickable: true,
            }}
            modules={[ Pagination, EffectFade]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="Slide-container">
                <img className="anime-logo" src="https://i.pinimg.com/originals/a8/41/05/a841058b5aa02f75349bb083652f2658.png" alt="" />
                <p>
                  
                </p>
                <div className="play-button-container">
                  <Link to={"/player"} >
                    <div className="play-button">
                      <i className="bi bi-play fs-1"></i>
                      <h1>Смотреть</h1>
                    </div>
                  </Link>
                </div>
              </div>
              <img
                className="Swiper-image" 
                src="https://images.wallpaperscraft.com/image/single/night_city_aerial_view_lights_city_134887_1920x1080.jpg" 
                alt="poster1" />
            </SwiperSlide>
            <SwiperSlide>
              <div className="Slide-container">
                <img className="anime-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Naruto_logo.svg/2560px-Naruto_logo.svg.png" alt="" />
                <p>
                  
                </p>
                <div className="play-button-container">
                  <Link to={"/player"} >
                    <div className="play-button">
                      <i className="bi bi-play fs-1"></i>
                      <h1>Смотреть</h1>
                    </div>
                  </Link>
                </div>
              </div>
              <img
                className="Swiper-image" 
                src="https://images.wallpaperscraft.com/image/single/night_city_aerial_view_lights_city_134887_1920x1080.jpg" 
                alt="poster1" />
            </SwiperSlide>
            <SwiperSlide>
              <div className="Slide-container">
                <img className="anime-logo" src="https://logos-world.net/wp-content/uploads/2021/09/One-Piece-Logo.png" alt="" />
                <p>
                  
                </p>
                <div className="play-button-container">
                  <Link to={"/player"} >
                    <div className="play-button">
                      <i className="bi bi-play fs-1"></i>
                      <h1>Смотреть</h1>
                    </div>
                  </Link>
                </div>
              </div>
              <img
                className="Swiper-image" 
                src="https://images.wallpaperscraft.com/image/single/night_city_aerial_view_lights_city_134887_1920x1080.jpg" 
                alt="poster1" />
            </SwiperSlide>
          </Swiper>
        </div>
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
