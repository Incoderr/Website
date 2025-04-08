import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { API_URL } from "../assets/config";

interface SettingsTabProps {
  userData: any;
  token: string;
  onUpdateUserData: (data: any) => void;
  onLogout: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ userData, token, onUpdateUserData, onLogout }) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер: 5 МБ.");
        return;
      }
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
        });
        setAvatarFile(compressedFile);
        setAvatarPreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Ошибка сжатия изображения:", error);
        alert("Не удалось обработать изображение");
      }
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("image", avatarFile);

    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!apiKey) throw new Error("API ключ imgBB не найден");

      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        }
      );
      const avatarUrl = imgbbResponse.data.data.url;

      const updateResponse = await axios.put(
        `${API_URL}/profile/avatar`,
        { avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdateUserData(updateResponse.data);
      setAvatarFile(null);
      setAvatarPreview(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Ошибка при загрузке аватара:", error);
      alert("Не удалось загрузить аватар: " + (error.response?.data?.error?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl mb-2">Смена аватара:</h2>
        <label className="inline-block mb-2">
          <span className="bg-blue-500 px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
            Выбрать аватар
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label>

        {avatarPreview && (
          <div className="mb-4">
            <h3 className="text-lg mb-2">Превью аватара:</h3>
            <div className="flex gap-4 items-center">
              <div>
                <p className="text-sm mb-1">В профиле (128x128):</p>
                <img
                  src={avatarPreview}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm mb-1">В хедере (32x32):</p>
                <img
                  src={avatarPreview}
                  alt="Header Preview"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {avatarPreview && (
          <div className="flex gap-2">
            <button
              onClick={handleAvatarUpload}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Сохранить"}
            </button>
            <button
              onClick={handleCancelAvatar}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              disabled={loading}
            >
              Отмена
            </button>
          </div>
        )}
      </div>
      <button
        onClick={onLogout}
        className="cursor-pointer bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Выйти
      </button>
    </div>
  );
};

export default SettingsTab;