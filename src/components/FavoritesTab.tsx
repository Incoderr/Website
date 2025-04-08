import React from "react";
import { useNavigate } from "react-router-dom";

interface FavoritesTabProps {
  favoritesData: any[];
  watchStatus?: { imdbID: string; status: string }[];
  isOwnProfile: boolean;
  onNavigate: (path: string) => void;
  onStatusChange: (imdbID: string, status: string) => Promise<void>;
}

const FavoritesTab: React.FC<FavoritesTabProps> = ({
  favoritesData,
  watchStatus,
  isOwnProfile,
  onNavigate,
  onStatusChange,
}) => {
  const statusText = {
    "": "Не выбрано",
    plan_to_watch: "Буду смотреть",
    watching: "Смотрю",
    completed: "Просмотрено",
    dropped: "Брошено",
  };

  return (
    <>
      <h2 className="text-xl mb-2">Избранное</h2>
      <br />
      {favoritesData.length > 0 ? (
        <div className="flex gap-5 flex-wrap items-center justify-center">
          {favoritesData.map((anime) => {
            const status = watchStatus?.find((ws) => ws.imdbID === anime.imdbID)?.status || "";
            return (
              <div
                key={anime.imdbID}
                onClick={() => onNavigate(`/player/${anime.imdbID}`)}
                className="flex w-64 h-100 group"
              >
                <div className="relative rounded-md overflow-hidden">
                  <img
                    src={anime.Poster}
                    alt={anime.Title}
                    className="w-full h-full object-cover rounded-md duration-300 group-hover:scale-105 z-5"
                  />
                  <div className="absolute inset-0 backdrop-blur-[3px] bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-4 flex justify-center flex-col">
                      <span className="text-2xl">{anime.Title}</span>
                      {isOwnProfile ? (
                        <select
                          value={status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onStatusChange(anime.imdbID, e.target.value)}
                          className="mt-2 h-10 w-full cursor-pointer bg-gray-700 text-white p-1 rounded"
                        >
                          <option value="">Не выбрано</option>
                          <option value="plan_to_watch">Буду смотреть</option>
                          <option value="watching">Смотрю</option>
                          <option value="completed">Просмотрено</option>
                          <option value="dropped">Брошено</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-400">Статус: {statusText[status]}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>У вас пока нет избранного</p>
      )}
    </>
  );
};

export default FavoritesTab;