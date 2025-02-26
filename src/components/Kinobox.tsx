import React, { useEffect, useRef } from "react";

interface KinoboxPlayerProps {
  ttid: string; // Используем TTID вместо kpId
}

function KinoboxPlayer({ ttid }: KinoboxPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "kinobox-script";
    let script: HTMLScriptElement | null = null;

    // Загружаем скрипт, если он ещё не добавлен
    if (!document.getElementById(scriptId)) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://kinobox.tv/kinobox.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const initializePlayer = () => {
      if ((window as any).kbox && containerRef.current) {
        (window as any).kbox(containerRef.current, {
          search: { query: ttid }, // Используем TTID как query
          menu: { enabled: false }, // Отключаем меню, если не нужно
        });
      }
    };

    // Если скрипт уже загружен, инициализируем сразу
    if (document.getElementById(scriptId) && (window as any).kbox) {
      initializePlayer();
    } else if (script) {
      script.onload = initializePlayer;
    }

    // Очистка при размонтировании
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''; // Очищаем содержимое плеера
      }
    };
  }, [ttid]);

  return (
    <div className="p-3">
      <div
        ref={containerRef}
        className="className=kinobox_player w-90 h-60 md:w-180 md:h-84  lg:w-320 lg:h-180 bg-gray-950 rounded-md"
      />
    </div>
    
  );
}

export default KinoboxPlayer;