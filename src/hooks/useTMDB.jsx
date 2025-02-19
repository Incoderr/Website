// useAnimeData.js
import { useState, useEffect } from "react";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_BASE_URLS = {
  tmdb: "https://api.themoviedb.org/3",
  shikimori: "https://shikimori.one/api",
};

const CACHE_KEY = "animeListCache";
const CACHE_TIME = 60 * 60 * 1000; // 1 час

const useAnimeData = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_TIME) {
            setAnimeList(data);
            setLoading(false);
            return;
          }
        }

        setLoading(true);

        const shikimoriRes = await fetch(
          `${API_BASE_URLS.shikimori}/animes?order=ranked_shiki&limit=7`,
          {
            headers: {
              "User-Agent": "AniHome/1.0.0",
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
          }
        );

        if (!shikimoriRes.ok) {
          throw new Error(`Shikimori API error: ${shikimoriRes.status}`);
        }

        const shikimoriAnime = await shikimoriRes.json();

        const detailedAnimeList = await Promise.all(
          shikimoriAnime.map(async (anime) => {
            try {
              const detailsRes = await fetch(
                `${API_BASE_URLS.shikimori}/animes/${anime.id}`,
                {
                  headers: {
                    "User-Agent": "AniHome/1.0.0",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  },
                }
              );

              if (!detailsRes.ok) {
                throw new Error(`Anime details error: ${detailsRes.status}`);
              }

              const details = await detailsRes.json();

              // Логируем название аниме перед поиском в TMDB
              console.log(`Searching TMDB for anime: ${anime.russian || anime.name}`);

              const tmdbRes = await fetch(
                `${API_BASE_URLS.tmdb}/search/tv?api_key=${TMDB_API_KEY}&query=${
                  encodeURIComponent(anime.russian || anime.name)
                }&language=ru-RU`
              );

              if (!tmdbRes.ok) {
                throw new Error(`TMDB API error: ${tmdbRes.status}`);
              }

              const tmdbData = await tmdbRes.json();
              
              // Логируем результаты поиска TMDB
              console.log('TMDB search results:', tmdbData.results);
              
              const tmdbAnime = tmdbData.results?.[0] || {};
              
              // Логируем найденный ID
              console.log('Found TMDB ID:', tmdbAnime.id);

              const animeData = {
                ...anime,
                ...details,
                tmdb_id: tmdbAnime.id || null,
                description: tmdbAnime.overview || details.description,
                backdrop: tmdbAnime.backdrop_path
                  ? `https://image.tmdb.org/t/p/original${tmdbAnime.backdrop_path}`
                  : null,
                poster: tmdbAnime.poster_path
                  ? `https://image.tmdb.org/t/p/w500${tmdbAnime.poster_path}`
                  : `https://shikimori.one${anime.image.original}`,
                rating: details.score,
                episodes: details.episodes,
                status: details.status,
                aired_on: details.aired_on,
              };

              // Логируем финальный объект аниме
              console.log('Final anime object:', animeData);

              return animeData;
            } catch (err) {
              console.error(`Error processing anime ${anime.id}:`, err);
              return null;
            }
          })
        );

        const filteredAnimeList = detailedAnimeList.filter(Boolean);
        
        // Логируем финальный список аниме
        console.log('Final anime list:', filteredAnimeList);
        
        setAnimeList(filteredAnimeList);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: filteredAnimeList,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setError(err.message || "Ошибка загрузки данных.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  return { animeList, loading, error };
};

export default useAnimeData;