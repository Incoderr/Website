import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { useCachedData } from "./Cache";

// Компонент слайдера для одной категории
const CategorySlider = ({ category }) => {
  // Формируем уникальный ключ кэша для данной категории
  const cacheKey = `anilistData_${category.sort}`;

  // Функция для получения данных с AniList API для выбранной категории
  const fetcher = async () => {
    // GraphQL‑запрос для AniList API
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
          }
        }
      }
    `;
    const variables = {
      page: 1,
      perPage: 20,
      sort: [category.sort],
    };

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`AniList API responded with status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json)
    if (json.errors) {
      throw new Error("AniList API errors: " + JSON.stringify(json.errors));
    }
    const media = json.data.Page.media;
    // Обработка и преобразование данных
    const enhancedAnimeList = media.map((anime) => ({
      id: anime.id,
      titleRomaji: anime.title.romaji || "Название отсутствует",
      titleEnglish: anime.title.english || anime.title.romaji || "No title",
      description: anime.description
        ? anime.description.replace(/<[^>]+>/g, "")
        : "Описание отсутствует",
      coverImage:
        anime.coverImage.extraLarge ||
        anime.coverImage.large ||
        anime.coverImage.medium ||
        "/placeholder-anime.jpg",
      averageScore: anime.averageScore || "N/A",
      episodes: anime.episodes || "??",
    }));

    return enhancedAnimeList;
  };

  // Используем хук useCachedData для получения данных с кэшированием
  const { data: animeList, isLoading, error } = useCachedData(cacheKey, fetcher);

  return (
    <div className="flex flex-col mb-12 custom-bt-swiper">
      {/* Заголовок категории */}
      <h2 className="text-3xl font-bold mb-6 flex justify-center sm:justify-normal">{category.label}</h2>

      {/* Состояния загрузки и ошибки */}
      {isLoading ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <div className="text-xl text-gray-600">Загрузка...</div>
        </div>
      ) : error ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      ) : (
        <Swiper
          spaceBetween={30}
          slidesPerView="auto"
          navigation={true}
          modules={[Navigation]}
          className=" w-full"
        >
          {animeList &&
            animeList.map((anime) => (
              <SwiperSlide key={anime.id} className="max-w-[296px]">
                <div className="group select-none w-[296px]" >
                  <div className="relative h-[400px] w-[296px] rounded-lg overflow-hidden">
                    <img
                      className="w-[296px] h-[400px] sm:w-[296px] sm:h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                      src={anime.coverImage}
                      alt={anime.titleRomaji}
                      onError={(e) => {
                        e.target.src = "/placeholder-anime.jpg";
                      }}
                    />
                    {/* Оверлей с описанием и кнопкой "Смотреть" */}
                    <div className="absolute w-[296px] inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 p-4 w-full">
                        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                          {anime.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/search`}
                            className="flex items-center gap-2 bg-[#A78BFA] hover:bg-[#8771ca] text-white px-4 py-2 rounded"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4l12 6-12 6V4z" />
                            </svg>
                            Смотреть
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Заголовок карточки */}
                  <div className="mt-2">
                    <h3 className="text-xl font-bold text-gray-50">{anime.titleRomaji}</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </div>
  );
};

// Массив категорий с параметрами сортировки для AniList API
const categories = [
  { label: "Популярное", sort: "POPULARITY_DESC" },
  { label: "Трендовое", sort: "TRENDING_DESC" },
  { label: "Новые", sort: "START_DATE_DESC" },
];

// Главный компонент, который выводит категории (сверху вниз)
const AnimeSliders = () => {
  return (
    <div className="">
      {categories.map((category) => (
        <CategorySlider  key={category.sort} category={category} />
      ))}
    </div>
  );
};

export default AnimeSliders;
