import React, { useState, useEffect } from 'react';

export const MoviePlayerPage = () => {
  useEffect(() => {
    // Get movie ID from URL
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    // Load Kinobox script
    const script = document.createElement('script');
    script.src = 'https://kinobox.tv/kinobox.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.kbox) {
        window.kbox('.kinobox_player', {
          search: {
            query: id
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
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="aspect-video">
        <div className="kinobox_player w-full h-full"></div>
      </div>
    </div>
  );
};

export default MoviePlayerPage;