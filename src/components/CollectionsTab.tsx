import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../assets/config";
import { BsPlusCircleFill, BsSearch, BsShareFill, BsTrashFill } from "react-icons/bs";
import { toast, Toaster } from "react-hot-toast";

const fetchCollections = async (token: string) => {
  const response = await axios.get(`${API_URL}/collections`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const CollectionsTab = ({ userId, isOwnProfile, token }: { userId: string; isOwnProfile: boolean; token: string }) => {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["collections", token],
    queryFn: () => fetchCollections(token),
    staleTime: 5 * 60 * 1000,
  });

  const createCollectionMutation = useMutation({
    mutationFn: (name: string) =>
      axios.post(`${API_URL}/collections`, { name, userId }, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: (response) => {
      queryClient.setQueryData(["collections", token], (old: any) => [...old, response.data]);
      setNewCollectionName("");
    },
    onError: (error: any) => {
      toast.error("Не удалось создать коллекцию: " + (error.response?.data?.message || error.message));
    },
  });

  const searchAnime = async () => {
    if (!searchQuery.trim() || !selectedCollection) return;
    const response = await axios.get(`${API_URL}/anime`, {
      params: { search: searchQuery },
      headers: { Authorization: `Bearer ${token}` },
    });
    setSearchResults(response.data);
  };

  const addToCollectionMutation = useMutation({
    mutationFn: ({ collectionId, imdbID }: { collectionId: string; imdbID: string }) =>
      axios.put(`${API_URL}/collections/${collectionId}`, { imdbID }, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: (response) => {
      queryClient.setQueryData(["collections", token], (old: any) =>
        old.map((col: any) => (col._id === selectedCollection._id ? response.data : col))
      );
      setSearchResults([]);
      setSearchQuery("");
    },
    onError: (error: any) => {
      toast.error("Не удалось добавить аниме: " + (error.response?.data?.message || error.message));
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: (collectionId: string) =>
      axios.delete(`${API_URL}/collections/${collectionId}`, { headers: { Authorization: `Bearer ${token}` } }),
    onSuccess: (_, collectionId) => {
      queryClient.setQueryData(["collections", token], (old: any) =>
        old.filter((col: any) => col._id !== collectionId)
      );
      toast.success("Коллекция успешно удалена!");
    },
    onError: (error: any) => {
      toast.error("Не удалось удалить коллекцию: " + (error.response?.data?.message || error.message));
    },
  });

  const shareCollection = (collectionId: string) => {
    const shareUrl = `${window.location.origin}/collections/${collectionId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Ссылка скопирована в буфер обмена!");
    }).catch(() => {
      toast.error("Не удалось скопировать ссылку");
    });
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="flex flex-col gap-4 w-200">
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
            onClick={() => createCollectionMutation.mutate(newCollectionName)}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <BsPlusCircleFill /> Создать
          </button>
        </div>
      )}
      {collections.length > 0 ? (
        <div className="space-y-4">
          {collections.map((collection: any) => (
            <div key={collection._id} className="bg-gray-900 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg mr-3">{collection.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => shareCollection(collection._id)}
                    className="bg-gray-700 p-2 rounded hover:bg-gray-600 flex items-center gap-2"
                  >
                    <BsShareFill /> Поделиться
                  </button>
                  {isOwnProfile && (
                    <button
                      onClick={() => deleteCollectionMutation.mutate(collection._id)}
                      className="bg-red-500 p-2 rounded hover:bg-red-600 flex items-center gap-2"
                    >
                      <BsTrashFill /> Удалить
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2">
                {collection.anime.length > 0 ? (
                  <div className="flex gap-4 flex-wrap">
                    {collection.anime.map((anime: any) => (
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
                          onClick={() => addToCollectionMutation.mutate({ collectionId: collection._id, imdbID: anime.imdbID })}
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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default CollectionsTab;