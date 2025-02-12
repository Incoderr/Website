import React, { useState } from "react";
import { Link } from "react-router-dom";

function CategorieSlide() {
  const animeCategories = [
    "Экшен", "Приключения", "Комедия", "Драма", "Фэнтези", "Магия", "Сверхъестественное",
    "Хоррор", "Психологическое", "Детектив", "Триллер", "Киберпанк", "Военное", "Историческое",
    "Меха", "Романтика", "Школа", "Спорт", "Музыка", "Повседневность", "Сёнэн", "Сёдзё",
    "Сёнэн-ай", "Сёдзё-ай", "Яой", "Юри", "Этти", "Гарем", "Обратный гарем", "Демоны",
    "Вампиры", "Боевые искусства", "Самураи", "Полиция", "Научная фантастика", "Космос",
    "Постапокалипсис", "Игры", "Путешествия во времени", "Дети", "Суперсила", "Школьная жизнь",
    "Пародия", "Юмор", "Трагедия", "Ангелы", "Зомби", "Животные", "Кулинария", "Мифология",
    "ЛГБТ", "Гендерная интрига", "Работа", "Шпионы", "Выживание", "Боевик", "Стимпанк",
    "Антиутопия", "Джосэй", "Сейнен", "Комедия повседневности", "Исэкай", "Ранобэ",
    "Фурри", "Темное фэнтези", "Криминал", "Гангстеры", "Мафия", "Дзёсэй", "Споккон",
    "Детское", "Философское", "Сверхспособности", "Юмор и пародия", "Психоделика"
  ];

  const ITEMS_PER_PAGE = 13; // Количество жанров на экране
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);


  return (
    <div className="flex gap-4 mb-7">
      <div className="flex gap-4">
        {animeCategories.slice(0, visibleCount).map((category, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-full outline-amber-50/70 outline-1 pl-3 pr-3 pt-2 pb-2 text-[20px] hover:scale-95 transition delay-15 ease-in-out"
          >
            {category}
          </div>
        ))}
      </div>
        <Link
            to={"/search"}
          className="rounded-full outline-amber-50/70 outline-1 pl-3 pr-3 pt-2 pb-2 text-[20px] cursor-pointer hover:scale-95 transition delay-15 ease-in-out"
        >
          Ещё
        </Link>
    </div>
  );
}

export default CategorieSlide;
