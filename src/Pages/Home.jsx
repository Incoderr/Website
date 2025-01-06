import React from "react";
import "../css/style.scss";
import "../css/media.css";
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
            autoplay={{
              delay: 9000,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination, EffectFade]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="Slide-container">
                <h1>Info</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Nostrum a eveniet atque tempore tenetur earum rem doloremque?
                  Nobis quod quia ullam mollitia adipisci? Accusamus,
                  consequuntur nulla debitis dicta est quaerat?
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
                src="https://images.wallpaperscraft.com/image/single/night_city_aerial_view_lights_city_134887_1920x1080.jpg" 
                alt="poster1" />
            </SwiperSlide>
            <SwiperSlide>
            <div className="Slide-container">
                <h1>Info</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Nostrum a eveniet atque tempore tenetur earum rem doloremque?
                  Nobis quod quia ullam mollitia adipisci? Accusamus,
                  consequuntur nulla debitis dicta est quaerat?
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
                src="https://images.wallpaperscraft.com/image/single/city_night_panorama_117682_1920x1080.jpg" 
                alt="poster3" />
            </SwiperSlide>
            <SwiperSlide>
            <div className="Slide-container">
                <h1>Info</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Nostrum a eveniet atque tempore tenetur earum rem doloremque?
                  Nobis quod quia ullam mollitia adipisci? Accusamus,
                  consequuntur nulla debitis dicta est quaerat?
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
                src="https://images.wallpaperscraft.com/image/single/tokyo_night_city_skyscrapers_121628_1920x1080.jpg" 
                alt="poster3"
              />
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
