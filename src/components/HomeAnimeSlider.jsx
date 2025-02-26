import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Autoplay } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { BsBookmark, BsFillPlayFill } from "react-icons/bs";
import { useQuery } from '@tanstack/react-query';
import  placeholder  from "../assets/image/placeholder.jpg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export const API_URL = "https://serverr-eight.vercel.app/api";

// Получение данных с AniList через сервер
const fetchAnilistData = async ({ queryKey }) => {
  const [, sort, perPage] = queryKey;
  const query = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: $sort) {
          id
          title {
            romaji
            english
            native
          }
          description(asHtml: false)
          coverImage {
            extraLarge
            large
            medium
          }
          averageScore
          episodes
          popularity
        }
      }
    }
  `;
  const variables = { page: 1, perPage, sort: [sort] };

  const response = await fetch(`${API_URL}/anilist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  const json = await response.json();
  return json.data.Page.media;
};

// Получение данных из MongoDB
const fetchMyDatabase = async ({ queryKey }) => {
  const [, options] = queryKey;
  const { genre, search, fields, limit, sort } = options || {};

  let url = `${API_URL}/anime`;
  const params = new URLSearchParams();
  if (genre) params.append("genre", genre);
  if (search) params.append("search", search);
  if (fields) params.append("fields", fields);
  if (limit) params.append("limit", limit);
  if (sort) params.append("sort", sort);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка при запросе к базе: ${response.status}`);
  }

  return await response.json();
};

// Функция использования только данных из MongoDB с опциональным ID из AniList
const filterAndUseMongoData = (anilistData, myDatabase) => {
  console.log('Данные из AniList:', anilistData);
  console.log('Данные из MongoDB:', myDatabase);

  const seenIds = new Set();
  return myDatabase
    .map(dbAnime => {
      const anilistEntry = anilistData.find(anime => 
        (dbAnime.TitleRu && anime.title.romaji && dbAnime.TitleRu.toLowerCase() === anime.title.romaji.toLowerCase()) ||
        (dbAnime.TitleEng && anime.title.english && dbAnime.TitleEng.toLowerCase() === anime.title.english.toLowerCase())
      );
      const uniqueId = anilistEntry?.id || dbAnime.TTID || Date.now() + Math.random();
      if (seenIds.has(uniqueId)) return null;
      seenIds.add(uniqueId);

      return {
        id: uniqueId,
        titleRu: dbAnime.TitleRu || "Название отсутствует",
        titleEng: dbAnime.TitleEng || null,
        episodes: dbAnime.Episodes || "??",
        year: dbAnime.Year || null,
        rating: dbAnime.TMDbRating || dbAnime.IMDbRating || "N/A",
        description: dbAnime.OverviewRu || "Описание отсутствует",
        poster: dbAnime.PosterRu || "https://via.placeholder.com/500x750?text=Нет+постера",
        backdrop: dbAnime.Backdrop || "https://via.placeholder.com/1920x1080?text=Нет+фона",
        ttid: dbAnime.TTID || null,
        genres: dbAnime.Genres || [],
        status: dbAnime.Status || null,
      };
    })
    .filter(Boolean);
};

// Компонент главного свайпера
const MainSwiper = () => {
  const navigate = useNavigate();

  const { data: anilistData = [], isLoading: anilistLoading, error: anilistError } = useQuery({
    queryKey: ["anilist", "TRENDING_DESC", 5],
    queryFn: fetchAnilistData,
  });

  const { data: dbData = [], isLoading: dbLoading, error: dbError } = useQuery({
    queryKey: ["database", { 
      fields: "TitleRu,TitleEng,Episodes,Year,TMDbRating,IMDbRating,OverviewRu,PosterRu,Backdrop,TTID,Genres,Status",
      limit: 5
    }],
    queryFn: fetchMyDatabase,
  });

  const animeList = filterAndUseMongoData(anilistData, dbData).slice(0, 5);
  const loading = anilistLoading || dbLoading;
  const error = anilistError || dbError;

  if (loading) return <div className="flex items-center justify-center h-130 sm:h-190"><p className="text-xl">Загрузка...</p></div>;
  if (error) return <div className="flex items-center justify-center h-130 sm:h-190"><p className="text-xl text-red-500">{error.message}</p></div>;
  if (!animeList.length) return <div className="flex items-center justify-center h-130 sm:h-190"><p className="text-xl">Нет данных для отображения</p></div>;

  const handleWatchClick = (ttid) => {
    if (ttid) navigate(`/player/${ttid}`);
  };

  return (
    <div className="image-box select-none mb-12">
      <Swiper
        spaceBetween={30}
        effect="fade"
        centeredSlides={true}
        autoplay={{ delay: 9000, disableOnInteraction: false }}
        navigation={true}
        loop
        speed={"500"}
        modules={[Navigation, EffectFade, Autoplay]}
        className="h-130 sm:h-200 duration-75"
      >
        {animeList.map((anime) => (
          <SwiperSlide key={anime.id}>
            <div className="w-full h-full">
              <img
                src={anime.backdrop}
                alt={anime.titleRu}
                className="absolute top-0 left-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            </div>
            <div className="absolute left-0 top-17 items-center sm:items-baseline z-10 flex w-full flex-col mb-10 sm:mt-0 sm:mb-0 sm:mr-auto sm:ml-25">
              <div className="w-130 flex flex-col">
                <img className="h-60 sm:h-100 object-contain" src={anime.poster} alt={anime.titleRu} loading="lazy" />
                <h1 className="text-[20px] mb-2 mt-2 font-bold text-white">{anime.titleRu}</h1>
              </div>
              <div className="flex sm:w-130 justify-center sm:justify-normal gap-2 mb-5 flex-wrap">
                <p className="bg-green-600 rounded-full px-3 py-1 text-sm sm:text-base">Рейтинг: {anime.rating}</p>
                <p className="bg-gray-700 rounded-full px-3 py-1 text-sm sm:text-base">Серий: {anime.episodes}</p>
                <p className="bg-gray-700 rounded-full px-3 py-1 text-sm sm:text-base">Год: {anime.year}</p>
                <p className="bg-gray-700 rounded-full px-3 py-1 text-sm sm:text-base">Статус: {anime.status}</p>
              </div>
              <div className="hidden sm:overflow-hidden sm:w-130 sm:mb-2 sm:line-clamp-5 sm:text-gray-200">{anime.description}</div>
              <div className="flex w-130 items-center justify-center gap-3">
                <button onClick={() => handleWatchClick(anime.ttid)} className="flex cursor-pointer items-center bg-white text-black rounded-full h-12 px-4 hover:scale-95 transition duration-150 ease-in-out">
                  <BsFillPlayFill className="text-[35px]" />
                  <span className="text-[20px] ml-1">Смотреть</span>
                </button>
                <button className="flex justify-center items-center rounded-full w-12 h-12 bg-[#A78BFA] hover:scale-95 transition duration-150 ease-in-out">
                  <BsBookmark className="text-[24px]" />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Компонент слайдера категории
const CategorySlider = ({ category }) => {
  const navigate = useNavigate();
  const { data: anilistData = [], isLoading: anilistLoading, error: anilistError } = useQuery({
    queryKey: ["anilist", category.sort, 20],
    queryFn: fetchAnilistData,
  });

  const { data: dbData = [], isLoading: dbLoading, error: dbError } = useQuery({
    queryKey: ["database", { 
      fields: "TitleRu,TitleEng,Episodes,Year,TMDbRating,IMDbRating,OverviewRu,PosterRu,Backdrop,TTID,Genres,Status",
      limit: 20
    }],
    queryFn: fetchMyDatabase,
  });

  const animeList = filterAndUseMongoData(anilistData, dbData).slice(0, 20);
  const loading = anilistLoading || dbLoading;
  const error = anilistError || dbError;

  if (loading) return <div className="w-full h-[400px] flex items-center justify-center"><div className="text-xl text-gray-600">Загрузка...</div></div>;
  if (error) return <div className="w-full h-[400px] flex items-center justify-center"><div className="text-xl text-red-600">{error.message}</div></div>;
  if (!animeList.length) return <div className="w-full h-[400px] flex items-center justify-center"><div className="text-xl">Нет данных для отображения</div></div>;

  const handleWatchClick = (ttid) => {
    if (ttid) navigate(`/player/${ttid}`);
  };

  return (
    <div className="flex flex-col mb-12 p-5">
      <h2 className="text-3xl font-bold mb-6 flex justify-center sm:justify-normal">{category.label}</h2>
      <Swiper spaceBetween={30} slidesPerView="auto" navigation={true} modules={[Navigation]} className="w-full custom-bt-swiper">
        {animeList.map((anime) => (
          <SwiperSlide key={anime.id} className="max-w-[296px]">
            <div className="group select-none w-[296px]">
              <div className="relative h-[400px] w-[296px] rounded-lg overflow-hidden">
                <img
                  className="w-[296px] h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                  src={anime.poster}
                  alt={anime.titleRu}
                />
                <div className="absolute w-[296px] inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 p-4 w-full">
                    <div className="text-gray-300 text-sm line-clamp-3 mb-4">{anime.description}</div>
                    <div onClick={() => handleWatchClick(anime.ttid)} className="flex items-center gap-2 bg-[#A78BFA] hover:bg-[#8771ca] text-white px-4 py-2 rounded transition delay-15 ease-in-out">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z" /></svg>
                      Смотреть
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="mt-2 text-xl font-bold text-gray-50">{anime.titleRu}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Компонент топ-10
const Top10Anime = () => {
  const { data: anilistData = [], isLoading: anilistLoading, error: anilistError } = useQuery({
    queryKey: ["anilist", "SCORE_DESC", 20],
    queryFn: fetchAnilistData,
  });

  const { data: dbData = [], isLoading: dbLoading, error: dbError } = useQuery({
    queryKey: ["database", { 
      fields: "TitleRu,TitleEng,Episodes,Year,TMDbRating,IMDbRating,OverviewRu,PosterRu,Backdrop,TTID,Genres,Status",
      limit: 10,
      sort: "-TMDbRating"
    }],
    queryFn: fetchMyDatabase,
  });

  const animeList = filterAndUseMongoData(anilistData, dbData).slice(0, 10);
  const loading = anilistLoading || dbLoading;
  const error = anilistError || dbError;

  if (loading) return <div className="w-full h-[200px] flex items-center justify-center"><div className="text-xl text-gray-600">Загрузка...</div></div>;
  if (error) return <div className="w-full h-[200px] flex items-center justify-center"><div className="text-xl text-red-600">{error.message}</div></div>;
  if (!animeList.length) return <div className="w-full h-[200px] flex items-center justify-center"><div className="text-xl">Нет данных для отображения</div></div>;

  // Разделяем список на две части
  const leftColumnAnime = animeList.slice(0, 5); // Элементы с 1 по 5
  const rightColumnAnime = animeList.slice(5, 10); // Элементы с 6 по 10

  return (
    <div className="mb-12 p-5">
      <h2 className="text-3xl font-bold mb-6 text-center sm:text-left">Топ 10 аниме</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Левая колонка (1-5) */}
        <div className="flex flex-col gap-4 w-full sm:w-1/2">
          {leftColumnAnime.map((anime, index) => (
            <div key={anime.id} className="flex items-center p-4 bg-gray-800 rounded-lg">
              <div className="w-10">
                <span className=" text-2xl font-bold text-[#A78BFA] text-center">{index + 1}</span>
              </div>
              <img src={anime.poster} alt={anime.titleRu} className="w-26 h-34 object-cover rounded" />
              <div className="">
                <h3 className="text-lg font-semibold text-white">{anime.titleRu}</h3>
                <p className="text-sm text-gray-300">Рейтинг: {anime.rating}</p>
                <p className="text-sm text-gray-400">Серий: {anime.episodes}</p>
                <p className="text-sm text-gray-400">Год: {anime.year}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Правая колонка (6-10) */}
        <div className="flex flex-col gap-4 w-full sm:w-1/2">
          {rightColumnAnime.map((anime, index) => (
            <div key={anime.id} className="flex items-center p-4 bg-gray-800 rounded-lg">
              <div className="w-10">
                <span className=" text-2xl font-bold text-[#A78BFA] text-center">{index + 6}</span>
              </div>
              <img src={anime.poster} alt={anime.titleRu} className="w-26 h-34 object-cover rounded" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-white">{anime.titleRu}</h3>
                <p className="text-sm text-gray-300">Рейтинг: {anime.rating}</p>
                <p className="text-sm text-gray-400">Серий: {anime.episodes}</p>
                <p className="text-sm text-gray-400">Год: {anime.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Главный компонент
const AnimeCombinedComponent = () => {
  const categories = [
    { label: "Популярное", sort: "POPULARITY_DESC" },
    { label: "Трендовое", sort: "TRENDING_DESC" },
    { label: "Новые", sort: "START_DATE_DESC" },
  ];

  return (
    <div className="anime-combined-container">
      <MainSwiper />
      {categories.map(category => (
        <CategorySlider key={category.sort} category={category} />
      ))}
      <Top10Anime />
    </div>
  );
};

export default AnimeCombinedComponent;