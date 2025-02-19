// MovieSearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const MovieSearchPage = () => {
  const { tmdbId } = useParams();
  const [movieTitle, setMovieTitle] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://kinobox.tv/kinobox.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Kinobox script загружен');
      if (window.kbox && tmdbId) {
        window.kbox('.player', {
          search: {
            tmdb: tmdbId
          },
          onChange: (data) => {
            if (data && data.title) {
              setMovieTitle(data.title);
            }
          }
        });
      }
    };
    
    document.body.appendChild(script);

    return () => {
      const scriptElement = document.querySelector('script[src="https://kinobox.tv/kinobox.min.js"]');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [tmdbId]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {movieTitle && (
        <div className="mb-6 text-xl font-bold">
          Сейчас смотрите: {movieTitle}
        </div>
      )}

      <div className="aspect-video">
        <div className="player w-full h-full"></div>
      </div>
    </div>
  );
};

export default MovieSearchPage;