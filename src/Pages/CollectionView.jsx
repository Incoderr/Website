import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BsPlusCircleFill } from "react-icons/bs";
import { toast, Toaster } from "react-hot-toast"; // Импортируем react-hot-toast
import HeaderEl from "../components/HeaderEl";
import LoadingEl from "../components/ui/Loading";
import { API_URL } from "../assets/config";

function CollectionView() {
  const [collection, setCollection] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/collections/${collectionId}`
        );
        setCollection(response.data);

        const userResponse = await axios
          .get(`${API_URL}/profile/${response.data.userId.username}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => null);
        setCreator(
          userResponse?.data || { username: response.data.userId.username }
        );
      } catch (error) {
        console.error(
          "Ошибка при загрузке коллекции:",
          error.response?.data || error.message
        );
        setCollection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId, token]);

  const handleAddToSelf = async () => {
    if (!token) {
      toast.error("Войдите в аккаунт, чтобы добавить коллекцию к себе"); // Заменяем alert на toast
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/collections/copy`,
        { collectionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Коллекция успешно добавлена к вам!"); // Успешное уведомление
      navigate(`/profile`);
    } catch (error) {
      console.error(
        "Ошибка при копировании коллекции:",
        error.response?.data || error.message
      );
      toast.error(
        "Не удалось добавить коллекцию: " +
          (error.response?.data?.message || error.message)
      ); // Ошибка с текстом
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-5 text-white flex justify-center">
        <LoadingEl />
      </div>
    );
  if (!collection)
    return (
      <div className="p-5 text-white flex justify-center">
        Коллекция не найдена
      </div>
    );

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{`AniCor - Коллекция: ${collection.name}`}</title>
        </Helmet>
        <HeaderEl />
        <main className="pt-[56px]">
          <div className="p-5 text-white">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold mb-2">{collection.name}</h1>
              <p className="text-sm text-gray-400 mb-4">
                Создатель:
                {creator && creator.username ? (
                  <span
                    onClick={() => navigate(`/profile/${creator.username}`)}
                    className="cursor-pointer hover:underline ml-1"
                  >
                    {creator.username}
                  </span>
                ) : (
                  " Неизвестно"
                )}
              </p>

              <button
                onClick={handleAddToSelf}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2 mb-6"
              >
                <BsPlusCircleFill /> Добавить к себе
              </button>

              <div className="w-full max-w-4xl">
                {collection.anime.length > 0 ? (
                  <div className="flex gap-4 flex-wrap justify-center">
                    {collection.anime.map((anime) => (
                      <div
                        key={anime.imdbID}
                        onClick={() => navigate(`/player/${anime.imdbID}`)}
                        className="w-32 cursor-pointer"
                      >
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
                  <p className="text-center">Коллекция пуста</p>
                )}
              </div>
            </div>
          </div>
        </main>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            success: {
              style: {
                background: "#10B981",
                color: "#fff",
              },
            },
            error: {
              style: {
                background: "#EF4444",
                color: "#fff",
              },
            },
          }}
        />
      </div>
    </HelmetProvider>
  );
}

export default CollectionView;
