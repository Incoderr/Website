import React, { useState, useEffect } from 'react';


const TopAnimeList = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  useEffect(() => {
    const fetchTopAnime = async () => {
      const query = `
        query {
          Page(page: 1, perPage: 10) {
            media(type: ANIME, sort: SCORE_DESC) {
              id
              title {
                romaji
                native
              }
              coverImage {
                large
                medium
              }
              averageScore
              popularity
            }
          }
        }
      `;

      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ query })
        });

        const result = await response.json();
        const animeList = result.data.Page.media;

        // Запрашиваем русские названия с Shikimori
        const updatedAnimeList = await Promise.all(
          animeList.map(async (anime) => {
            const ruTitle = await fetchShikimoriTitle(anime.title.romaji);
            return { ...anime, title: { ...anime.title, russian: ruTitle || anime.title.romaji } };
          })
        );

        setTopAnime(updatedAnimeList);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить аниме');
        setLoading(false);
      }
    };

    fetchTopAnime();
  }, []);

  // Функция поиска названия в Shikimori
  const fetchShikimoriTitle = async (romajiTitle) => {
    try {
      const response = await fetch(`https://shikimori.one/api/animes?search=${encodeURIComponent(romajiTitle)}`);
      const data = await response.json();
      if (data.length > 0) {
        return data[0].russian; // Берем первое совпадение
      }
    } catch (error) {
      console.error(`Ошибка при запросе Shikimori для ${romajiTitle}:`, error);
    }
    return null;
  };

  if (loading) return <div className="text-center p-4">Загрузка...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4 text-center">Топ-10 Аниме</h2>
      <div className="space-y-4">
        {topAnime.map((anime, index) => (
          <div 
            key={anime.id} 
            className="flex items-center shadow-md rounded-lg overflow-hidden"
          >
            <h1 className='text-2xl w-12'>#{index + 1}</h1>
            <img 
              src={anime.coverImage.large} 
              alt={anime.title.romaji} 
              className="w-24 h-36 object-cover"
            />
            <div className="ml-4 flex-grow">
              <h3 className="text-lg font-semibold">
                {anime.title.russian} {/* Показываем русское название */}
              </h3>
              <div className="text-gray-300">
                Рейтинг: <span className="text-yellow-500 font-bold">
                  ★ {(anime.averageScore / 10).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopAnimeList;
