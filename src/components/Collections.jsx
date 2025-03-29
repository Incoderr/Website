import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../assets/config";
import { BsPlusCircleFill, BsSearch, BsShareFill } from "react-icons/bs";

const Collections = ({ userId, isOwnProfile, token }) => {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, [userId]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/collections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollections(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке коллекций:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/collections`,
        { name: newCollectionName, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCollections([...collections, response.data]);
      setNewCollectionName("");
    } catch (error) {
      console.error("Ошибка при создании коллекции:", error.response?.data || error.message);
      alert("Не удалось создать коллекцию: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const searchAnime = async () => {
    if (!searchQuery.trim() || !selectedCollection) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/anime`, {
        params: { search: searchQuery },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Ошибка поиска аниме:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCollection = async (imdbID) => {
    if (!selectedCollection) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/collections/${selectedCollection._id}`,
        { imdbID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCollections(collections.map(col => 
        col._id === selectedCollection._id ? response.data : col
      ));
      setSearchResults([]);
      setSearchQuery("");
    } catch (error) {
      console.error("Ошибка при добавлении в коллекцию:", error.response?.data || error.message);
      alert("Не удалось добавить аниме: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const shareCollection = (collectionId) => {
    const shareUrl = `${window.location.origin}/collections/${collectionId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Ссылка на коллекцию скопирована в буфер обмена: " + shareUrl);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl mb-2">Коллекции</h2>

      {isOwnProfile && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Название новой коллекции"
            className="p-2 rounded bg-gray-800 text-white w-full"
          />
          <button
            onClick={createCollection}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <BsPlusCircleFill /> Создать
          </button>
        </div>
      )}

      {collections.length > 0 ? (
        <div className="space-y-4">
          {collections.map((collection) => (
            <div key={collection._id} className="bg-gray-900 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg">{collection.name}</h3>
                <button
                  onClick={() => shareCollection(collection._id)}
                  className="bg-gray-700 p-2 rounded hover:bg-gray-600 flex items-center gap-2"
                >
                  <BsShareFill /> Поделиться
                </button>
              </div>
              <div className="mt-2">
                {collection.anime.length > 0 ? (
                  <div className="flex gap-4 flex-wrap">
                    {collection.anime.map((anime) => (
                      <div key={anime.imdbID} className="w-32">
                        <img
                          src={anime.Poster}
                          alt={anime.Title}
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <p className="text-sm mt-1 truncate">{anime.Title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Коллекция пуста</p>
                )}
              </div>

              {isOwnProfile && (
                <div className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Поиск аниме"
                      className="p-2 rounded bg-gray-800 text-white w-full"
                      onFocus={() => setSelectedCollection(collection)}
                    />
                    <button
                      onClick={searchAnime}
                      className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                      <BsSearch /> Найти
                    </button>
                  </div>
                  {selectedCollection?._id === collection._id && searchResults.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto bg-gray-800 p-2 rounded">
                      {searchResults.map((anime) => (
                        <div
                          key={anime.imdbID}
                          className="flex items-center gap-2 p-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => addToCollection(anime.imdbID)}
                        >
                          <img
                            src={anime.Poster}
                            alt={anime.Title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <span>{anime.Title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>У вас пока нет коллекций</p>
      )}
    </div>
  );
};

export default Collections;