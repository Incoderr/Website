import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Убедитесь, что установлено: npm install jwt-decode

const API_URL = "https://serverr-eight.vercel.app";

function AdminPage() {
  const [animeList, setAnimeList] = useState([]);
  const [filteredAnimeList, setFilteredAnimeList] = useState([]); // Для отфильтрованного списка
  const [newAnime, setNewAnime] = useState({
    imdbID: "",
    Title: "",
    TitleEng: "",
    Poster: "",
    Backdrop: "", // Сделали необязательным
    Year: "",
    Released: "",
    imdbRating: "", // Сделали необязательным
    Episodes: "", // Сделали необязательным
    Genre: "", // Строка для ввода жанров через запятую
    Tags: "",
    OverviewRu: "",
  });
  const [editingAnime, setEditingAnime] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Проверка роли на клиенте
  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role !== "admin") {
        setError("Доступ запрещён: требуется роль администратора");
        navigate("/auth");
        return;
      }
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
      setError("Недействительный токен");
      navigate("/auth");
      return;
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchAnime = async () => {
      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/admin/anime`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Убедимся, что данные уникальны по imdbID
        const uniqueAnimeList = Array.from(
          new Map(
            response.data.map((item) => [item.imdbID, item])
          ).values()
        ).map((anime) => ({
          ...anime,
          Genre: anime.Genre ? anime.Genre.join(", ") : "", // По умолчанию пустая строка, если Genre undefined
        }));
        setAnimeList(uniqueAnimeList);
        setFilteredAnimeList(uniqueAnimeList); // Инициализируем отфильтрованный список
        setError(null);
      } catch (error) {
        console.error("Ошибка при загрузке аниме:", error.response?.data || error.message);
        if (error.response?.status === 403) {
          setError("Доступ запрещён: требуется роль администратора");
        } else if (error.response?.status === 401) {
          setError("Неавторизован: требуется вход");
          navigate("/auth");
        } else {
          setError("Произошла ошибка при загрузке данных");
        }
      }
    };

    if (token) fetchAnime();
  }, [token, navigate]);

  // Фильтрация списка по поисковому запросу
  useEffect(() => {
    if (!searchQuery) {
      setFilteredAnimeList(animeList);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = animeList.filter((anime) => {
        const titleMatch = anime.Title?.toLowerCase().includes(lowerCaseQuery) || false;
        const titleEngMatch = anime.TitleEng?.toLowerCase().includes(lowerCaseQuery) || false;
        const imdbIDMatch = anime.imdbID?.toLowerCase().includes(lowerCaseQuery) || false;
        const genreMatch = anime.Genre?.toLowerCase().includes(lowerCaseQuery) || false;
        return titleMatch || titleEngMatch || imdbIDMatch || genreMatch;
      });
      // Убедимся, что отфильтрованный список уникален по imdbID
      const uniqueFiltered = Array.from(
        new Map(
          filtered.map((item) => [item.imdbID, item])
        ).values()
      );
      setFilteredAnimeList(uniqueFiltered);
    }
  }, [searchQuery, animeList]);

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAnime = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Неавторизован: требуется вход");
      navigate("/auth");
      return;
    }

    const animeData = {
      ...newAnime,
      Tags: newAnime.Tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      Episodes: parseInt(newAnime.Episodes) || 0, // Преобразуем в число или 0 по умолчанию
      Genre: newAnime.Genre.split(",").map((genre) => genre.trim()).filter(Boolean), // Преобразуем в массив
    };

    // Валидация обязательных полей
    if (!animeData.imdbID || !animeData.Title || !animeData.TitleEng || !animeData.Poster || !animeData.Year || !animeData.Released || !animeData.Genre.length || !animeData.OverviewRu) {
      setError("Обязательные поля (imdbID, Title, TitleEng, Poster, Year, Released, Genre, OverviewRu) должны быть заполнены");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/admin/anime`, animeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newAnimeItem = { ...response.data, Genre: response.data.Genre?.join(", ") || "" };
      setAnimeList([...animeList, newAnimeItem]);
      setFilteredAnimeList([...filteredAnimeList, newAnimeItem]); // Обновляем отфильтрованный список
      setNewAnime({
        imdbID: "",
        Title: "",
        TitleEng: "",
        Poster: "",
        Backdrop: "",
        Year: "",
        Released: "",
        imdbRating: "",
        Episodes: "",
        Genre: "",
        Tags: "",
        OverviewRu: "",
      });
      setError(null);
    } catch (error) {
      console.error("Ошибка при добавлении аниме:", error.response?.data || error.message);
      setError("Ошибка при добавлении аниме: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEditAnime = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Неавторизован: требуется вход");
      navigate("/auth");
      return;
    }

    const animeData = {
      ...editingAnime,
      Tags: editingAnime.Tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      Episodes: parseInt(editingAnime.Episodes) || 0,
      Genre: editingAnime.Genre.split(",").map((genre) => genre.trim()).filter(Boolean),
    };

    // Валидация обязательных полей
    if (!animeData.imdbID || !animeData.Title || !animeData.TitleEng || !animeData.Poster || !animeData.Year || !animeData.Released || !animeData.Genre.length || !animeData.OverviewRu) {
      setError("Обязательные поля (imdbID, Title, TitleEng, Poster, Year, Released, Genre, OverviewRu) должны быть заполнены");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/admin/anime/${animeData.imdbID}`,
        animeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedAnimeItem = { ...response.data, Genre: response.data.Genre?.join(", ") || "" };
      setAnimeList(animeList.map((anime) => (anime.imdbID === animeData.imdbID ? updatedAnimeItem : anime)));
      setFilteredAnimeList(filteredAnimeList.map((anime) => (anime.imdbID === animeData.imdbID ? updatedAnimeItem : anime))); // Обновляем отфильтрованный список
      setEditingAnime(null);
      setError(null);
    } catch (error) {
      console.error("Ошибка при редактировании аниме:", error.response?.data || error.message);
      setError("Ошибка при редактировании аниме: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteAnime = async (imdbID) => {
    if (!token) {
      setError("Неавторизован: требуется вход");
      navigate("/auth");
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/admin/anime/${imdbID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimeList(animeList.filter((anime) => anime.imdbID !== imdbID));
      setFilteredAnimeList(filteredAnimeList.filter((anime) => anime.imdbID !== imdbID)); // Обновляем отфильтрованный список
      setError(null);
    } catch (error) {
      console.error("Ошибка при удалении аниме:", error.response?.data || error.message);
      setError("Ошибка при удалении аниме: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-5 text-white">
      <h1 className="text-3xl font-bold mb-5">Админ-панель: Управление аниме</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Поле поиска */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по названию, ID или жанрам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 bg-gray-700 rounded w-full max-w-md"
        />
      </div>

      {/* Форма добавления */}
      <div className="mb-8">
        <h2 className="text-xl mb-3">Добавить новое аниме</h2>
        <form onSubmit={handleAddAnime} className="grid grid-cols-2 gap-2">
          <input
            type="text"
            name="imdbID"
            placeholder="imdbID"
            value={newAnime.imdbID}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="Title"
            placeholder="Русское название (Title)"
            value={newAnime.Title}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="TitleEng"
            placeholder="Оригинальное название (TitleEng)"
            value={newAnime.TitleEng}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="Poster"
            placeholder="Постер (Poster URL)"
            value={newAnime.Poster}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="Backdrop"
            placeholder="Бэкдроп (Backdrop URL, необязательно)"
            value={newAnime.Backdrop}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
          />
          <input
            type="text"
            name="Year"
            placeholder="Год (Year)"
            value={newAnime.Year}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="Released"
            placeholder="Дата релиза (Released)"
            value={newAnime.Released}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="imdbRating"
            placeholder="Рейтинг IMDb (imdbRating, необязательно)"
            value={newAnime.imdbRating}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
          />
          <input
            type="number"
            name="Episodes"
            placeholder="Количество серий (Episodes, необязательно)"
            value={newAnime.Episodes}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
          />
          <input
            type="text"
            name="Genre"
            placeholder="Жанры (через запятую, например: Animation, Comedy, Romance)"
            value={newAnime.Genre}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="Tags"
            placeholder="Теги (через запятую, например: тег1, тег2, необязательно)"
            value={newAnime.Tags}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded"
          />
          <textarea
            name="OverviewRu"
            placeholder="Описание (OverviewRu)"
            value={newAnime.OverviewRu}
            onChange={handleInputChange(setNewAnime)}
            className="p-2 bg-gray-700 rounded w-full col-span-2 h-24"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 rounded hover:bg-blue-700 col-span-2"
          >
            Добавить
          </button>
        </form>
      </div>

      {/* Список аниме */}
      <div>
        <h2 className="text-xl mb-3">Список аниме</h2>
        {filteredAnimeList.length > 0 ? (
          <ul className="space-y-4">
            {filteredAnimeList.map((anime) => (
              <li key={anime.imdbID} className="flex items-center gap-4 p-3 bg-gray-700 rounded">
                <img
                  src={anime.Poster || ""} // Заглушка для отсутствующего постера
                  alt={anime.Title}
                  className="w-48 h-64 object-cover rounded"
                  onError={(e) => (e.target.src = "")}
                />
                <div className="flex-1">
                  {editingAnime && editingAnime.imdbID === anime.imdbID ? (
                    <form onSubmit={handleEditAnime} className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="imdbID"
                        placeholder="imdbID"
                        value={editingAnime.imdbID}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                        disabled // imdbID не редактируется
                      />
                      <input
                        type="text"
                        name="Title"
                        placeholder="Русское название (Title)"
                        value={editingAnime.Title}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                        required
                      />
                      <input
                        type="text"
                        name="TitleEng"
                        placeholder="Оригинальное название (TitleEng)"
                        value={editingAnime.TitleEng}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                        required
                      />
                      <input
                        type="text"
                        name="Poster"
                        placeholder="Постер (Poster URL)"
                        value={editingAnime.Poster}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                        required
                      />
                      <input
                        type="text"
                        name="Backdrop"
                        placeholder="Бэкдроп (Backdrop URL, необязательно)"
                        value={editingAnime.Backdrop}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                      />
                      <input
                        type="text"
                        name="Year"
                        placeholder="Год (Year)"
                        value={editingAnime.Year}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                        required
                      />
                      <input
                        type="text"
                        name="Released"
                        placeholder="Дата релиза (Released)"
                        value={editingAnime.Released}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                        required
                      />
                      <input
                        type="text"
                        name="imdbRating"
                        placeholder="Рейтинг IMDb (imdbRating, необязательно)"
                        value={editingAnime.imdbRating}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                      />
                      <input
                        type="number"
                        name="Episodes"
                        placeholder="Количество серий (Episodes, необязательно)"
                        value={editingAnime.Episodes}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                      />
                      <input
                        type="text"
                        name="Genre"
                        placeholder="Жанры (через запятую, например: Animation, Comedy, Romance)"
                        value={editingAnime.Genre}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                        required
                      />
                      <input
                        type="text"
                        name="Tags"
                        placeholder="Теги (через запятую, например: тег1, тег2, необязательно)"
                        value={editingAnime.Tags}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded"
                      />
                      <textarea
                        name="OverviewRu"
                        placeholder="Описание (OverviewRu)"
                        value={editingAnime.OverviewRu}
                        onChange={handleInputChange(setEditingAnime)}
                        className="p-1 bg-gray-600 rounded w-full col-span-2 h-24"
                        required
                      />
                      <button
                        type="submit"
                        className="p-1 bg-green-600 rounded hover:bg-green-700 col-span-2"
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAnime(null)}
                        className="p-1 bg-gray-600 rounded hover:bg-gray-700 col-span-2"
                      >
                        Отмена
                      </button>
                    </form>
                  ) : (
                    <div>
                      <span className="text-lg">{anime.Title}</span>
                      <div className="mt-1">
                        <button
                          onClick={() => setEditingAnime(anime)}
                          className="p-1 bg-yellow-600 rounded hover:bg-yellow-700 mr-2"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDeleteAnime(anime.imdbID)}
                          className="p-1 bg-red-600 rounded hover:bg-red-700"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Список аниме пуст</p>
        )}
      </div>
    </div>
  );
}

export default AdminPage;