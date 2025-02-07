import React, { useEffect, useRef } from "react";

interface KinoboxPlayerProps {
  kpId: number;
  searchTitle: string;
}

export function KinoboxPlayer({ kpId, searchTitle }: KinoboxPlayerProps) {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://kinobox.tv/kinobox.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (containerRef.current) {
        (window as any).kbox(containerRef.current, {
          search: {
            title: searchTitle
          },
          menu: {
            enabled: false,
          }
        });
      }
    };

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {}
    };
  }, [kpId, searchTitle]);

  return <div ref={containerRef} className="kinobox_player"></div>;
}

export default KinoboxPlayer;