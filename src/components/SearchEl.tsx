import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import genresData from "../assets/json/available_genres.json";
import LoadingEl from "./ui/Loading";
import { useAnimeSearch } from "../hooks/useAnimeSearch";
// Объект с изображениями для жанров (пути к файлам или URL)
const genreImages = {
  Экшен: "https://i.ibb.co.com/HDkcqcKj/Action.jpg",
  Приключения: "https://i.ibb.co.com/HTssxpkD/Adventure.jpg",
  Комедия: "https://i.ibb.co.com/21Z3jfjZ/Comedy.jpg",
  Драма: "https://i.ibb.co.com/qYykV9nL/Drama.jpg",
  Этти: "https://i.ibb.co.com/TxTBjKVf/Ecchi.jpg",
  Фэнтези: "https://i.ibb.co.com/yn7P9m6G/Fantasy.jpg",
  Хоррор: "https://i.ibb.co.com/HL6G71fZ/Horror.jpg",
  Меха: "https://i.ibb.co.com/Y4zd5qgh/Mecha.jpg",
  Музыка: "https://i.ibb.co.com/JwrJ9fQS/Music.jpg",
  Детектив: "https://i.ibb.co.com/cKJcTW4N/Mystery.jpg",
  Психологическое: "https://i.ibb.co.com/wZfDzmHr/Psychological.jpg",
  Романтика: "https://i.ibb.co.com/0RVB8M9n/Romance.jpg",
  "Научная фантастика": "https://i.ibb.co.com/35hpLQVF/Sci-Fi.jpg",
  Повседневность: "https://i.ibb.co.com/TxPfYccB/Slice-of-Life.jpg",
  Спорт: "https://i.ibb.co.com/S4w4ySmD/Sports.jpg",
  Сверхъестественное: "https://i.ibb.co.com/WpMXYSRJ/Supernatural.jpg",
  Триллер: "https://i.ibb.co.com/v67vvZfw/Thriller.jpg",
};

const SearchEl: React.FC = () => {
  const {
    anime,
    searchQuery,
    selectedGenre,
    isLoading,
    handleSearch,
    filterByGenre,
    clearSearch,
  } = useAnimeSearch();
  const [visibleCount, setVisibleCount] = useState(12);
  const navigate = useNavigate();

  const visibleAnime = anime.slice(0, visibleCount);
  const showGenres = !searchQuery && !selectedGenre;

  const handleLoadMore = () => {
    if (visibleCount < anime.length) {
      setVisibleCount((prev) => prev + 12);
    }
  };

  const handleCardClick = (imdbID: string) => {
    navigate(`/player/${imdbID}`);
  };

  return (
    <div className="p-3">
      <div className="flex flex-row justify-center mt-15 mb-5 sm:mb-8 gap-2">
        <div className="relative flex w-full sm:w-auto items-center sm:duration-300 hover:scale-101">
          <LuSearch className="absolute ml-3 text-2xl" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="bg-gray-700 w-full sm:w-120 h-11 text-white text-lg pl-11 outline-none focus:ring-blue-600 focus:ring-1 focus:shadow-lg focus:shadow-blue-600/30 rounded-md"
            placeholder="Поиск..."
          />
        </div>
      </div>

      {showGenres ? (
        <div className="flex gap-4 sm:gap-3 justify-center max-w-500 sm:max-w-500 flex-wrap">
          {Object.entries(genresData).map(([key, value]) => (
            <div
              key={key}
              onClick={() => filterByGenre(value as string)}
              className="relative w-90 h-40 sm:w-85 sm:h-40 duration-300 cursor-pointer hover:scale-105 rounded-md overflow-hidden flex justify-center items-center"
            >
              <div className="absolute bg-black/35 z-10 w-90 h-40 sm:w-85 sm:h-40"></div>
              <img
                src={genreImages[value as keyof typeof genreImages]}
                alt={value as string}
                className="w-full h-full object-cover blur-[1px]"
              />
              <div className="absolute flex justify-center items-center">
                <span className="text-white text-2xl font-bold text-center z-10">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <button
            onClick={clearSearch}
            className="mb-5 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 duration-300"
          >
            Назад к жанрам
          </button>

          <div className="flex gap-5 justify-center max-w-500 sm:max-w-500 flex-wrap mt-5">
            {isLoading ? (
              <LoadingEl />
            ) : visibleAnime.length > 0 ? (
              visibleAnime.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleCardClick(item.imdbID)}
                  className="bg-transparent w-64 h-auto duration-300 cursor-pointer hover:scale-105 flex flex-col justify-center items-center rounded-md"
                >
                  <img
                    src={item.Poster}
                    alt={item.Title}
                    className="w-64 h-96 object-cover rounded-md" 
                  />
                  <div className="text-center line-clamp-3 p-2 h-24">
                    <span className=" text-white text-lg font-bold">
                      {item.Title || "Без названия"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-lg">
                {searchQuery
                  ? `Аниме по запросу "${searchQuery}" не найдено`
                  : `Аниме по жанру "${selectedGenre}" не найдено`}
              </p>
            )}
          </div>

          {visibleAnime.length > 0 && visibleCount < anime.length && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Загрузка..." : "Показать ещё"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchEl;