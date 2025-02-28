import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://serverr-eight.vercel.app";

function AdminPage() {
  const [animeList, setAnimeList] = useState([]);
  const [newAnime, setNewAnime] = useState({
    imdbID: "",
    Title: "",
    Poster: "",
    TitleEng: "",
    Year: "",
    Status: "",
    IMDbRating: "",
    TMDbRating: "",
    Episodes: "",
    Genre: "",
    Tags: [],
    OverviewRu: "",
  });
  const [editingAnime, setEditingAnime] = useState(null);
  const [error, setError] = useState(null); // Добавляем состояние для ошибки
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/anime`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnimeList(response.data);
        setError(null); // Сбрасываем ошибку при успехе
      } catch (error) {
        console.error("Ошибка при загрузке аниме:", error);
        if (error.response?.status === 403) {
          setError("Доступ запрещён: требуется роль администратора");
        } else if (error.response?.status === 401) {
          navigate("/auth");
        } else {
          setError("Произошла ошибка при загрузке данных");
        }
      }
    };
    if (token) fetchAnime();
    else navigate("/auth");
  }, [token, navigate]);

  const handleAddAnime = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/admin/anime`, newAnime, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimeList([...animeList, response.data]);
      setNewAnime({
        imdbID: "",
        Title: "",
        Poster: "",
        TitleEng: "",
        Year: "",
        Status: "",
        IMDbRating: "",
        TMDbRating: "",
        Episodes: "",
        Genre: "",
        Tags: [],
        OverviewRu: "",
      });
    } catch (error) {
      console.error("Ошибка при добавлении аниме:", error);
    }
  };

  const handleEditAnime = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/anime/${editingAnime.imdbID}`,
        editingAnime,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnimeList(animeList.map((anime) =>
        anime.imdbID === editingAnime.imdbID ? response.data : anime
      ));
      setEditingAnime(null);
    } catch (error) {
      console.error("Ошибка при редактировании аниме:", error);
    }
  };

  const handleDeleteAnime = async (imdbID) => {
    try {
      await axios.delete(`${API_URL}/api/admin/anime/${imdbID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimeList(animeList.filter((anime) => anime.imdbID !== imdbID));
    } catch (error) {
      console.error("Ошибка при удалении аниме:", error);
    }
  };

  return (
    <div className="p-5 text-white">
      <h1 className="text-3xl font-bold mb-5">Админ-панель: Управление аниме</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Отображение ошибки */}

      {/* Форма добавления */}
      <div className="mb-8">
        <h2 className="text-xl mb-3">Добавить новое аниме</h2>
        <form onSubmit={handleAddAnime} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="imdbID"
            value={newAnime.imdbID}
            onChange={(e) => setNewAnime({ ...newAnime, imdbID: e.target.value })}
            className="p-2 bg-gray-700 rounded"
          />
          <input
            type="text"
            placeholder="Название"
            value={newAnime.Title}
            onChange={(e) => setNewAnime({ ...newAnime, Title: e.target.value })}
            className="p-2 bg-gray-700 rounded"
          />
          <input
            type="text"
            placeholder="Постер (URL)"
            value={newAnime.Poster}
            onChange={(e) => setNewAnime({ ...newAnime, Poster: e.target.value })}
            className="p-2 bg-gray-700 rounded"
          />
          <input
            type="text"
            placeholder="Год"
            value={newAnime.Year}
            onChange={(e) => setNewAnime({ ...newAnime, Year: e.target.value })}
            className="p-2 bg-gray-700 rounded"
          />
          <button type="submit" className="p-2 bg-blue-600 rounded hover:bg-blue-700">
            Добавить
          </button>
        </form>
      </div>

      {/* Список аниме */}
      <div>
        <h2 className="text-xl mb-3">Список аниме</h2>
        {animeList.length > 0 ? (
          <ul className="space-y-4">
            {animeList.map((anime) => (
              <li key={anime.imdbID} className="flex items-center gap-4 p-2 bg-gray-700 rounded">
                <img
                  src={anime.Poster}
                  alt={anime.Title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  {editingAnime && editingAnime.imdbID === anime.imdbID ? (
                    <form onSubmit={handleEditAnime} className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editingAnime.Title}
                        onChange={(e) => setEditingAnime({ ...editingAnime, Title: e.target.value })}
                        className="p-1 bg-gray-600 rounded"
                      />
                      <input
                        type="text"
                        value={editingAnime.Poster}
                        onChange={(e) => setEditingAnime({ ...editingAnime, Poster: e.target.value })}
                        className="p-1 bg-gray-600 rounded"
                      />
                      <button type="submit" className="p-1 bg-green-600 rounded hover:bg-green-700">
                        Сохранить
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAnime(null)}
                        className="p-1 bg-gray-600 rounded hover:bg-gray-700"
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