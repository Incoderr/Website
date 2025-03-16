import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Autoplay } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { BsBookmark, BsBookmarkFill, BsFillPlayFill } from "react-icons/bs";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { API_URL } from '../assets/config';

// Функция для добавления в избранное
const addToFavorites = async (imdbID, token) => {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Предполагается, что токен хранится где-то в состоянии
    },
    body: JSON.stringify({ imdbID }),
  });

  if (!response.ok) throw new Error("Ошибка при добавлении в избранное");
  return response.json();
};

// Функция для удаления из избранного
const removeFromFavorites = async (imdbID, token) => {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ imdbID }),
  });

  if (!response.ok) throw new Error("Ошибка при удалении из избранного");
  return response.json();
};

// Функция для получения профиля с избранным
const fetchUserProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Ошибка при получении профиля");
  return response.json();
};

// Получение данных с AniList через сервер
const fetchAnilistData = async ({ queryKey }) => {
  const [, sort, perPage, search] = queryKey; // Добавляем search для поиска по названию
  const query = `
    query ($page: Int, $perPage: Int, $sort: [MediaSort], $search: String) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: $sort, search: $search) {
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
          trending
        }
      }
    }
  `;
  const variables = { page: 1, perPage, sort: [sort], search: search || null };

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
  console.log('Данные из AniList (с сервера):', anilistData);
  console.log('Данные из MongoDB (локальные):', myDatabase);

  const seenIds = new Set();
  return anilistData.map(anime => {
    const uniqueId = anime.imdbID || anime.id || Date.now() + Math.random();
    if (seenIds.has(uniqueId)) return null;
    seenIds.add(uniqueId);

    return {
      id: uniqueId,
      title: anime.title.ru || "Название отсутствует",
      titleEng: anime.title.english || null,
      episodes: anime.episodes || "??",
      year: anime.year || null,
      rating: anime.rating || "N/A",
      description: anime.description || "Описание отсутствует",
      poster: anime.poster || "нет постера",
      backdrop: anime.backdrop || "нет бекдропа",
      imdbID: anime.imdbID || null,
      genres: anime.genres || [],
      status: anime.status || null,
      popularity: anime.popularity || 0,
      trendingScore: anime.trending || 0,
    };
  }).filter(Boolean)
    .sort((a, b) => b.trendingScore - a.trendingScore || b.popularity - a.popularity);
};

// Компонент MainSwiper с закладками
const MainSwiper = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Предполагаем, что токен хранится в localStorage или контексте
  const token = localStorage.getItem("token"); // Замените на ваш способ получения токена

  // Получение данных AniList
  const { data: anilistData = [], isLoading: anilistLoading, error: anilistError } = useQuery({
    queryKey: ["anilist", "TRENDING_DESC", 5],
    queryFn: fetchAnilistData,
  });

  // Получение данных MongoDB
  const { data: dbData = [], isLoading: dbLoading, error: dbError } = useQuery({
    queryKey: ["database", { 
      fields: "Title,TitleEng,Episodes,Year,TMDbRating,imdbRating,OverviewRu,Poster,Backdrop,imdbID,Genre,Status",
      limit: 50,
    }],
    queryFn: fetchMyDatabase,
  });

  // Получение профиля пользователя с избранным
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(token),
    enabled: !!token, // Выполняется только если токен есть
  });

  const favorites = userProfile?.favorites || []; // Список избранного из профиля

  const animeList = filterAndUseMongoData(anilistData, dbData).slice(0, 5);
  const loading = anilistLoading || dbLoading || profileLoading;
  const error = anilistError || dbError;

  // Мутации для добавления и удаления из избранного
  const addFavoriteMutation = useMutation({
    mutationFn: (imdbID) => addToFavorites(imdbID, token),
    onSuccess: () => queryClient.invalidateQueries(["userProfile"]),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (imdbID) => removeFromFavorites(imdbID, token),
    onSuccess: () => queryClient.invalidateQueries(["userProfile"]),
  });

  const handleWatchClick = (imdbID) => {
    if (imdbID) navigate(`/player/${imdbID}`);
  };

  const toggleFavorite = (imdbID) => {
    if (!token) {
      alert("Пожалуйста, войдите в аккаунт, чтобы добавить в избранное");
      return;
    }
    if (favorites.includes(imdbID)) {
      removeFavoriteMutation.mutate(imdbID);
    } else {
      addFavoriteMutation.mutate(imdbID);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-130 sm:h-190"><p className="text-xl">Загрузка...</p></div>;
  if (error) return <div className="flex items-center justify-center h-130 sm:h-190"><p className="text-xl text-red-500">{error.message}</p></div>;
  if (!animeList.length) return <div className="flex items-center justify-center h-130 sm:h-190"><p className="text-xl">Нет данных для отображения</p></div>;

  return (
    <div className="image-box mb-12">
      <Swiper
        spaceBetween={30}
        effect="fade"
        centeredSlides={true}
        autoplay={{ delay: 9000, disableOnInteraction: false }}
        navigation={true}
        loop
        speed={"800"}
        modules={[Navigation, EffectFade, Autoplay]}
        className="h-130 sm:h-200 duration-75"
      >
        {animeList.map((anime) => (
          <SwiperSlide key={anime.id}>
            <div className="w-full h-full">
              <img
                src={anime.backdrop}
                alt={anime.title}
                className="absolute top-0 left-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            </div>
            <div className="absolute left-0 top-17 items-center sm:items-baseline z-10 flex w-full flex-col mb-10 sm:mt-0 sm:mb-0 sm:mr-auto sm:ml-25">
              <div className="w-130 flex flex-col">
                <img className="h-60 sm:h-100 object-contain" src={anime.poster} alt={anime.title} loading="lazy" />
                <h1 className="text-[20px] mb-2 mt-2 font-bold text-white">{anime.title}</h1>
              </div>
              {anime.imdbID ? (
                <>
                  <div className="flex sm:w-130 justify-center gap-2 mb-5 flex-wrap">
                    <p className="bg-gradient-to-r from-green-500 to-green-800 rounded-full px-3 py-1 text-sm sm:text-base">Рейтинг: {anime.rating}</p>
                    <p className="bg-gray-700 rounded-full px-3 py-1 text-sm sm:text-base">Серий: {anime.episodes}</p>
                    <p className="bg-gray-700 rounded-full px-3 py-1 text-sm sm:text-base">Год: {anime.year || "N/A"}</p>
                  </div>
                  <div className="hidden sm:overflow-hidden sm:w-130 sm:mb-2 sm:line-clamp-4 sm:text-gray-200">{anime.description}</div>
                  <div className="flex w-130 items-center justify-center gap-3">
                    <button onClick={() => handleWatchClick(anime.imdbID)} className="flex cursor-pointer items-center bg-white text-black rounded-full h-12 px-4 hover:scale-95 transition duration-150 ease-in-out">
                      <BsFillPlayFill className="text-[35px]" />
                      <span className="text-[20px] ml-1">Смотреть</span>
                    </button>
                    <button
                      onClick={() => toggleFavorite(anime.imdbID)}
                      className="flex cursor-pointer justify-center items-center rounded-full w-12 h-12 bg-[#A78BFA] hover:scale-95 transition duration-150 ease-in-out"
                    >
                      {favorites.includes(anime.imdbID) ? (
                        <BsBookmarkFill className="text-[24px]" />
                      ) : (
                        <BsBookmark className="text-[24px]" />
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-400 mt-2">Нет в базе</p>
              )}
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
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const { data: anilistData = [], isLoading: anilistLoading, error: anilistError } = useQuery({
    queryKey: ["anilist", category.sort, 20],
    queryFn: fetchAnilistData,
  });

  const { data: dbData = [], isLoading: dbLoading, error: dbError } = useQuery({
    queryKey: ["database", { 
      fields: "Title,TitleEng,Episodes,Year,TMDbRating,IMDbRating,OverviewRu,Poster,Backdrop,imdbID,Genre,Status",
      limit: 20,
    }],
    queryFn: fetchMyDatabase,
  });

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(token),
    enabled: !!token,
  });

  const favorites = userProfile?.favorites || [];

  const animeList = filterAndUseMongoData(anilistData, dbData).slice(0, 20);
  const loading = anilistLoading || dbLoading || profileLoading;
  const error = anilistError || dbError;

  const addFavoriteMutation = useMutation({
    mutationFn: (imdbID) => addToFavorites(imdbID, token),
    onSuccess: () => queryClient.invalidateQueries(["userProfile"]),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (imdbID) => removeFromFavorites(imdbID, token),
    onSuccess: () => queryClient.invalidateQueries(["userProfile"]),
  });

  const handleWatchClick = (imdbID) => {
    if (imdbID) navigate(`/player/${imdbID}`);
  };

  const toggleFavorite = (imdbID) => {
    if (!token) {
      alert("Пожалуйста, войдите в аккаунт, чтобы добавить в избранное");
      return;
    }
    if (favorites.includes(imdbID)) {
      removeFavoriteMutation.mutate(imdbID);
    } else {
      addFavoriteMutation.mutate(imdbID);
    }
  };

  if (loading) return <div className="w-full h-[400px] flex items-center justify-center"><div className="text-xl text-gray-600">Загрузка...</div></div>;
  if (error) return <div className="w-full h-[400px] flex items-center justify-center"><div className="text-xl text-red-600">{error.message}</div></div>;
  if (!animeList.length) return <div className="w-full h-[400px] flex items-center justify-center"><div className="text-xl">Нет данных для отображения</div></div>;

  return (
    <div className="flex flex-col mb-12 p-5">
      <h2 className="text-3xl font-bold mb-6 flex justify-center sm:justify-normal">{category.label}</h2>
      <Swiper spaceBetween={30} slidesPerView="auto" navigation={true} modules={[Navigation]} className="w-full custom-bt-swiper">
        {animeList.map((anime) => (
          <SwiperSlide key={anime.id} className="max-w-[296px]">
            <div className="group select-none w-[296px]">
              <div className="relative h-[420px] w-[296px] rounded-lg overflow-hidden">
                <span className="absolute bg-gradient-to-r from-green-500 to-green-800 rounded-full px-3 text-lg right-4 top-4 z-10">{anime.rating}</span>
                <img
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  src={anime.poster}
                  alt={anime.title}
                  loading="lazy"
                />
                {anime.imdbID && (
                  <div className="absolute w-[296px] inset-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 p-4 w-full">
                      <div className="text-gray-300 text-sm line-clamp-10 mb-4">{anime.description}</div>
                      <div className="flex items-center gap-2">
                        <div onClick={() => handleWatchClick(anime.imdbID)} className="flex cursor-pointer items-center gap-2 bg-white hover:scale-104 h-10 w-full text-black p-2 rounded transition delay-15 ease-in-out">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6V4z" /></svg>
                          Смотреть
                        </div>
                        <div
                          onClick={() => toggleFavorite(anime.imdbID)}
                          className="cursor-pointer p-2 h-10 w-10 bg-[#A78BFA] hover:scale-104 flex justify-center items-center rounded-md"
                        >
                          {favorites.includes(anime.imdbID) ? (
                            <BsBookmarkFill className="text-2xl" />
                          ) : (
                            <BsBookmark className="text-2xl" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex text-center justify-center mt-3 "> 
                <h3 className="text-xl font-bold text-gray-50">{anime.title}</h3>
              </div>
              {!anime.imdbID && <p className="text-sm text-gray-400">Только название из AniList</p>}
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
      fields: "Title,TitleEng,Episodes,Year,TMDbRating,IMDbRating,OverviewRu,Poster,Backdrop,imdbID,Genre,Status",
      limit: 10,
      sort: "-IMDbRating" // Сортировка по рейтингу из MongoDB
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
              <img src={anime.poster} alt={anime.title} className="w-26 h-34 object-cover rounded" loading="lazy" />
              <div className="ml-5">
                <h3 className="text-lg font-semibold text-white">{anime.title}</h3>
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
              <img src={anime.poster} alt={anime.title} className="w-26 h-34 object-cover rounded" loading="lazy"/>
              <div className="ml-5">
                <h3 className="text-lg font-semibold text-white">{anime.title}</h3>
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