// PlayerPage.js
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const PlayerPage = () => {
  const { id } = useParams();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://kinobox.tv/kinobox.min.js";
    script.async = true;
    script.onload = () => {
      if (window.kbox) {
        window.kbox(".kinobox_player", { search: { query: id } });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Просмотр аниме</h1>
      <div className="kinobox_player"></div>
    </div>
  );
};

export default PlayerPage;
