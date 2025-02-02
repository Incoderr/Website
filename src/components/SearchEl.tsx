// src/SearchPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Пример запроса к Jikan API для поиска аниме
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error("Ошибка поиска:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnime = (anime: Anime) => {
    // Переход на страницу плеера с передачей данных выбранного аниме
    navigate("/player", { state: { anime } });
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Поиск аниме</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Введите название аниме"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
          Искать
        </button>
      </form>

      {loading && <p>Загрузка...</p>}

      <div style={{ marginTop: "1rem" }}>
        {results.map((anime) => (
          <div
            key={anime.mal_id}
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ddd",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              cursor: "pointer",
            }}
            onClick={() => handleSelectAnime(anime)}
          >
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              style={{ width: "50px", height: "70px", objectFit: "cover", marginRight: "1rem" }}
            />
            <span>{anime.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
