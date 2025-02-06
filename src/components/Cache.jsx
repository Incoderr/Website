// Cache.js
import { useState, useEffect } from "react";

/**
 * useCachedData – пользовательский хук для получения данных с кэшированием в localStorage.
 *
 * @param {string} cacheKey - Ключ для хранения данных в localStorage.
 * @param {Function} fetcher - Функция, которая возвращает Promise с данными.
 * @param {number} cacheDuration - Время жизни кэша в миллисекундах (по умолчанию 24 часа).
 * @returns {{ data: any, isLoading: boolean, error: string|null, refetch: Function }}
 */
export const useCachedData = (cacheKey, fetcher, cacheDuration = 24 * 60 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      localStorage.setItem(cacheKey, JSON.stringify(result));
      localStorage.setItem(cacheKey + "_timestamp", Date.now().toString());
      setData(result);
    } catch (err) {
      console.error("Ошибка получения данных:", err);
      setError(err.message || "Ошибка получения данных");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheKey + "_timestamp");
    const now = Date.now();
    if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp, 10) < cacheDuration) {
      setData(JSON.parse(cachedData));
      setIsLoading(false);
    } else {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return { data, isLoading, error, refetch: fetchData };
};
