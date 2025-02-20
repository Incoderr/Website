import React, { useEffect } from 'react';

interface KinoboxProps {
  search: {
    query: string;
  }
}

declare global {
  interface Window {
    kbox: (selector: string, options: KinoboxProps) => void;
  }
}

interface VideoPlayerProps {
  query: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ query }) => {
  useEffect(() => {
    // Create script element for Kinobox
    const script = document.createElement('script');
    script.src = 'https://kinobox.tv/kinobox.min.js';
    script.async = true;
    
    // Add script to document
    document.body.appendChild(script);

    // Initialize player after script loads
    script.onload = () => {
      if (window.kbox) {
        window.kbox('.kinobox_player', {
          search: { query }
        });
      }
    };

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, [query]);

  return <div className="kinobox_player"></div>;
};

export default VideoPlayer;