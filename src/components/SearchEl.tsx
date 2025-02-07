import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const MovieSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Загружаем скрипт только один раз при монтировании компонента
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://kinobox.tv/kinobox.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Kinobox script загружен');
    };
    
    document.body.appendChild(script);

    return () => {
      const scriptElement = document.querySelector('script[src="https://kinobox.tv/kinobox.min.js"]');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  // Обработчик изменения поля ввода
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Обработчик нажатия кнопки поиска
  const handleSearch = () => {
    if (window.kbox && searchQuery) {
      window.kbox('.search_player', {
        search: {
          query: searchQuery
        }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Введите название фильма для поиска..."
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-6">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Найти фильм
        </button>
      </div>

      <div className="aspect-video">
        <div className="search_player w-full h-full"></div>
      </div>
    </div>
  );
};

export default MovieSearchPage;
