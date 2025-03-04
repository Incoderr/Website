import React, { useState, useCallback, useEffect } from "react";
import { BsFilter, BsSearch } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import genresData from "../assets/json/available_genres.json";
import { API_URL } from "../assets/config";
import LoadingEl from "../components/ui/Loading";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

function SearchEl() {
  const [anime, setAnime] = useState([]);
  const [visibleAnime, setVisibleAnime] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12); // Установлено 12 по умолчанию
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGenres, setShowGenres] = useState(true);
  const navigate = useNavigate();

  // Маппинг русских жанров в английские для запросов к серверу
  const genreMapping = {
    Экшен: "Action",
    Приключения: "Adventure",
    Комедия: "Comedy",
    Драма: "Drama",
    Этти: "Ecchi",
    Фэнтези: "Fantasy",
    Хоррор: "Horror",
    Меха: "Mecha",
    Музыка: "Music",
    Детектив: "Mystery",
    Психологическое: "Psychological",
    Романтика: "Romance",
    Научная_фантастика: "Sci-Fi",
    Повседневность: "Slice of Life",
    Спорт: "Sports",
    Сверхъестественное: "Supernatural",
    Триллер: "Thriller",
    // Добавьте другие маппинги по необходимости
  };

  // Загружаем аниме с сервера
  const loadAnime = useCallback(
    (params, reset = false) => {
      setLoading(true);
      axios
        .get(`${API_URL}/anime`, {
          params: {
            genre: params.genre ? genreMapping[params.genre] || params.genre : "",
            search: params.search || "",
          },
        })
        .then((response) => {
          // Убираем дубликаты по _id
          const uniqueAnime = Array.from(
            new Map(response.data.map((item) => [item._id, item])).values()
          ).map((item) => ({
            ...item,
            Genre: Array.isArray(item.Genre)
              ? item.Genre.map((g) => {
                  // Преобразуем английские жанры в русские для отображения
                  const russianGenre = Object.entries(genreMapping).find(
                    ([_, eng]) => eng === g
                  )?.[0];
                  return russianGenre || g; // Возвращаем русский жанр или английский, если маппинга нет
                })
              : [],
          }));
          console.log("📌 Ответ от сервера:", uniqueAnime);
          setAnime(uniqueAnime);
          setVisibleAnime(uniqueAnime.slice(0, reset ? 12 : visibleCount));
          setLoading(false);
        })
        .catch((error) => {
          console.error("❌ Ошибка при загрузке данных:", error);
          setLoading(false);
        });
    },
    [visibleCount]
  );

  // Фильтрация по жанру
  const filterByGenre = useCallback(
    (genreValue) => {
      setSelectedGenre(genreValue);
      setSearchQuery("");
      setVisibleCount(12);
      setShowGenres(false);
      loadAnime({ genre: genreValue }, true); // Передаём русский жанр, сервер преобразует в английский
    },
    [loadAnime]
  );

  // Задержанный поиск
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        setShowGenres(false);
        loadAnime({ search: query }, true);
      } else {
        setShowGenres(true);
        setAnime([]);
        setVisibleAnime([]);
      }
    }, 1000),
    [loadAnime]
  );

  // Обработчик поиска
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedGenre(null);
    setVisibleCount(12);
    debouncedSearch(query);
  };

  // Возврат к жанрам
  const handleBackToGenres = () => {
    setShowGenres(true);
    setSelectedGenre(null);
    setSearchQuery("");
    setAnime([]);
    setVisibleAnime([]);
    setVisibleCount(12);
  };

  // Загрузка большего количества аниме
  const handleLoadMore = () => {
    if (visibleCount < anime.length) {
      const newCount = visibleCount + 12;
      setVisibleCount(newCount);
      setVisibleAnime(anime.slice(0, newCount));
    }
  };

  // Переход к странице плеера
  const handleCardClick = (imdbID) => {
    navigate(`/player/${imdbID}`);
  };

  return (
    <div className="p-3">
      <div className="flex flex-row justify-center mt-15 mb-5 sm:mb-8 gap-2">
        <div className="relative flex items-center sm:duration-300 hover:scale-101">
          <BsSearch className="absolute ml-3 text-2xl" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="bg-gray-700 w-full sm:w-120 h-11 text-white text-lg pl-11 outline-none focus:ring-blue-600 focus:ring-1 focus:shadow-lg focus:shadow-blue-600/30 rounded-md"
            placeholder="Поиск аниме..."
          />
        </div>
        <div className="h-11 w-11 rounded-md flex items-center justify-center bg-gray-700 sm:duration-300 hover:scale-105">
          <BsFilter className="text-3xl" />
        </div>
      </div>

      {showGenres ? (
        <div className="flex gap-2 sm:gap-3 justify-center max-w-500 sm:max-w-500 flex-wrap">
          {Object.entries(genresData).map(([key, value]) => (
            <div
              key={key}
              onClick={() => filterByGenre(value)}
              className="bg-gray-700 w-47 h-20 sm:w-73 sm:h-30 duration-300 cursor-pointer hover:scale-105 flex justify-center items-center p-2 rounded-md text-white text-lg font-bold"
            >
              {value}
            </div>
          ))}
        </div>
      ) : (
        <>
          <button
            onClick={handleBackToGenres}
            className="mb-5 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 duration-300"
          >
            Назад к жанрам
          </button>

          <div className="flex gap-5 justify-center max-w-500 sm:max-w-500 flex-wrap mt-5">
            {loading ? (
              <LoadingEl />
            ) : visibleAnime.length > 0 ? (
              visibleAnime.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleCardClick(item.imdbID)}
                  className="bg-transparent w-64 h-auto duration-300 cursor-pointer hover:scale-105 flex flex-col justify-center items-center rounded-md"
                >
                  <img
                    src={
                      item.Poster || "https://dummyimage.com/500x750/gray/white?text=Нет+постера"
                    }
                    alt={item.Title}
                    className="w-64 h-96 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src =
                        "https://dummyimage.com/500x750/gray/white?text=Нет+постера";
                      e.target.onerror = null; // Предотвращаем бесконечные ошибки
                    }}
                  />
                  <span className="h-15 w-auto flex justify-center m-4 text-white text-lg font-bold">
                    {item.Title || "Без названия"}
                  </span>
                  {/* Отображение жанров как списка на русском для фильтрации */}
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
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Показать ещё"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchEl;