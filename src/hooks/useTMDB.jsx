import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Время жизни кеша (1 час)
const CACHE_TIME = 60 * 60 * 1000;

const useTMDB = (endpoint, params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

    // Проверяем, есть ли кеш и не устарел ли он
    if (cachedData && cachedTimestamp && Date.now() - cachedTimestamp < CACHE_TIME) {
      setData(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const queryString = new URLSearchParams({ api_key: API_KEY, ...params }).toString();
      const url = `${BASE_URL}/${endpoint}?${queryString}`;

      try {
        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
          setData(result.results || []);
          localStorage.setItem(cacheKey, JSON.stringify(result.results));
          localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        } else {
          setError(result.status_message || "Ошибка загрузки данных");
        }
      } catch (err) {
        setError("Ошибка загрузки данных");
      }

      setLoading(false);
    };

    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
};

export default useTMDB;
