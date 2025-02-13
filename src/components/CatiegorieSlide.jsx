import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function CategorieSlide() {
  const [categories, setCategories] = useState([]);
  const maxVisibleDesktop = 6; // Количество категорий на ПК
  const maxVisibleMobile = 15; // Количество категорий на телефоне

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://shikimori.one/api/genres");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {/* ПК-версия: просто список категорий */}
      <div className="hidden sm:flex gap-4 mb-7">
        {categories.slice(0, maxVisibleDesktop).map((category) => (
          <div
            key={category.id}
            className="select-none outline-1 text-white rounded-full px-4 py-2 text-[16px] cursor-pointer hover:scale-95 transition duration-200"
          >
            {category.russian || category.name}
          </div>
        ))}
        {categories.length > maxVisibleDesktop && (
          <Link
            to={"/search"}
            className="rounded-full bg-white text-black px-4 py-2 text-[16px] cursor-pointer hover:scale-95 transition duration-200"
          >
            Ещё
          </Link>
        )}
      </div>

      {/* Мобильная версия: горизонтальный свайпер */}
      <div className="sm:hidden pt-2 pb-2 flex gap-4 mb-7 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <div className="flex gap-4">
          {categories.slice(0, maxVisibleMobile).map((category) => (
            <div
              key={category.id}
              className="select-none flex justify-center items-center outline-1 text-white rounded-full pl-3 pr-3 text-[16px] cursor-pointer hover:scale-95 transition duration-200"
            >
              {category.russian || category.name}
            </div>
          ))}
        </div>
        {categories.length > maxVisibleMobile && (
          <Link
            to={"/search"}
            className="rounded-full bg-white text-black px-4 py-2 text-[16px] cursor-pointer hover:scale-95 transition duration-200"
          >
            Ещё
          </Link>
        )}
      </div>
    </div>
  );
}

export default CategorieSlide;
