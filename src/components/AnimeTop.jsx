import React from 'react';
import { useCachedData } from './Cache';

const TopAnimeList = () => {
  const { data, isLoading, error } = useCachedData(
    'top-anime-graphql',
    async () => {
      try {
        // Сначала получаем токен
        const tokenResponse = await fetch('https://shikimori.one/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: 'YOUR_CLIENT_ID', // Нужно заменить на ваш client_id
            client_secret: 'YOUR_CLIENT_SECRET', // Нужно заменить на ваш client_secret
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Ошибка получения токена');
        }

        const { access_token } = await tokenResponse.json();

        // Теперь делаем запрос к API
        const response = await fetch('https://shikimori.one/api/animes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          params: {
            limit: 10,
            order: 'popularity',
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка получения данных от API');
        }

        const animes = await response.json();
        console.log('Полученные данные:', animes);
        return animes;
      } catch (error) {
        console.error('Ошибка при запросе:', error);
        throw error;
      }
    },
    12 * 60 * 60 * 1000 // кэш на 12 часов
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Ошибка: {error.toString()}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Топ 10 Аниме</h1>
      <div className="flex flex-col gap-6">
        {data?.map((anime) => (
          <div key={anime.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex">
              <img
                src={`https://shikimori.one${anime.image.preview}`}
                alt={anime.name}
                className="w-32 h-44 object-cover"
              />
              <div className="flex-1 p-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">
                    {anime.russian || anime.name}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {anime.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium">Рейтинг:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-100 rounded-full text-sm">
                      {anime.score || 'Нет оценки'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Жанры:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {anime.genres?.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {genre.russian || genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopAnimeList;