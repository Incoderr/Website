// SearchPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query) return;
    
    const response = await fetch(`https://shikimori.one/api/animes?search=${query}`);
    const data = await response.json();
    setResults(data);
  };

  const handleSelect = (id, title) => {
    navigate(`/player/${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Поиск аниме</h1>
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Введите название или ID"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 mt-2">
        Искать
      </button>
      <ul className="mt-4">
        {results.map((anime) => (
          <li key={anime.id} className="p-2 border-b cursor-pointer" onClick={() => handleSelect(anime.id, anime.russian || anime.name)}>
            {anime.russian || anime.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;