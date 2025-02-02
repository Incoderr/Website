// src/PlayerPage.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KinoboxPlayer from "./KinoboxPlayer";

interface LocationState {
  anime: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
  };
}

const PlayerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  // Если данные аниме не переданы, переходим обратно на страницу поиска
  if (!state || !state.anime) {
    navigate("/");
    return null;
  }

  const { anime } = state;

  return (
    <div style={{ padding: "1rem" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Назад
      </button>
      <h1>{anime.title}</h1>
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        style={{ maxWidth: "300px", display: "block", marginBottom: "1rem" }}
      />

      {/* Компонент плеера Kinobox, ищем по названию аниме */}
      <KinoboxPlayer searchQuery={anime.title} />
    </div>
  );
};

export default PlayerPage;
