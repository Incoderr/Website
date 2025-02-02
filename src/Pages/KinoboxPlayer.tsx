// src/KinoboxPlayer.tsx
import React, { useEffect, useRef } from "react";

interface KinoboxPlayerProps {
  searchQuery: string;
}

const KinoboxPlayer: React.FC<KinoboxPlayerProps> = ({ searchQuery }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Создаём скрипт для подключения плеера
    const script = document.createElement("script");
    script.src = "https://kinobox.tv/kinobox.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (containerRef.current && (window as any).kbox) {
        (window as any).kbox(containerRef.current, {
          search: {
            title: searchQuery, // Поиск по названию
          },
          // Пример отключения меню (по желанию можно настроить)
          menu: {
            enable: false,
          },
          // Если нужно передать параметры (например, постер) в iframe, можно использовать секцию params
           params: {
            all: {
             poster: "https://example.org/your-poster.jpg",
             },
           },
        });
      }
    };

    return () => {
      // Очистка: удаляем скрипт при размонтировании компонента
      document.body.removeChild(script);
    };
  }, [searchQuery]);

  return <div ref={containerRef} className="kinobox_player" style={{ minHeight: "400px" }} />;
};

export default KinoboxPlayer;
