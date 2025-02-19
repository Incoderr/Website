import axios from 'axios';

const SHIKIMORI_URL = 'https://shikimori.one/api/animes';
const TMDB_URL = 'https://api.themoviedb.org/3/search/tv';
const ANILIBRIA_URL = 'https://api.anilibria.tv/v2/title/search'; // Возможно, не работает

const TMDB_API_KEY = 'e547e17d4e91f3e62a571655cd1ccaff'; // Укажи API-ключ TMDB

// Функция поиска аниме
export const searchAnime = async (query) => {
  try {
    console.log(`🔍 Ищем аниме: ${query}`);

    // 🟢 1. Поиск в Shikimori
    const shikimoriResponse = await axios.get(SHIKIMORI_URL, {
      params: { search: query },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (shikimoriResponse.data.length) {
      console.log('✅ Найдено в Shikimori:', shikimoriResponse.data);
      return shikimoriResponse.data.map((anime) => ({
        id: anime.id,
        title: anime.russian || anime.name,
        poster: `https://shikimori.one${anime.image.original}`,
      }));
    }

    // 🟡 2. Поиск в TMDB
    const tmdbResponse = await axios.get(TMDB_URL, {
      params: { query, api_key: TMDB_API_KEY, language: 'ru-RU' },
    });

    if (tmdbResponse.data.results.length) {
      console.log('✅ Найдено в TMDB:', tmdbResponse.data.results);
      return tmdbResponse.data.results.map((anime) => ({
        id: anime.id,
        title: anime.name || anime.original_name,
        poster: `https://image.tmdb.org/t/p/w500${anime.poster_path}`,
      }));
    }

    // 🔴 3. Anilibria (если URL работает)
    try {
      const anilibriaResponse = await axios.get(ANILIBRIA_URL, {
        params: { search: query },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      if (anilibriaResponse.data.length) {
        console.log('✅ Найдено в Anilibria:', anilibriaResponse.data);
        return anilibriaResponse.data.map((anime) => ({
          id: anime.id,
          title: anime.names.ru || anime.names.en,
          poster: anime.posters.medium.url,
        }));
      }
    } catch (err) {
      console.warn('⚠ Anilibria API не работает:', err.message);
    }

    return [];
  } catch (error) {
    console.error('❌ Ошибка при поиске аниме:', error);
    return [];
  }
};
