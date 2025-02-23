import { useState, useEffect } from "react";

const KinoboxPlayer = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://kinobox.tv/kinobox.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (query) {
      (window as any).kbox(".kinobox_player", { search: { query } });
    }
  }, [query]);

  return (
    <div className="flex flex-col items-center p-4">
      <input
        type="text"
        placeholder="Введите ID или название..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded-md mb-4 w-80"
      />
      <div className="kinobox_player w-[1280px] h-[720px]  bg-gray-900"></div>
    </div>
  );
};

export default KinoboxPlayer;
