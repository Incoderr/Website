import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const AnimeList = styled.div`
  padding: 16px;
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const AnimeCard = styled.div`
  background: /*#1c1d21*/ transparent;
  border: 1px solid #e2e8f042;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AnimeImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius:5px;
`;

const AnimeInfo = styled.div`
  position: relative;
  padding: 12px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  word-break: break-word;
`;

const AnimeTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #ffffff;
`;

const Container = styled.div`
  width: 100%;
  max-width: 768px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #e2e8f07b;
  background-color: #1c1d21;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`;

const DropdownButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #e2e8f07b;
  border-radius: 8px;
  background: #1c1d21;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: #2e3036;
  }
`;

const ChevronIcon = styled.span`
  border: solid #666;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: ${(props) =>
    props.$isOpen ? "rotate(-135deg)" : "rotate(45deg)"};
  transition: transform 0.2s ease;
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  margin-top: 12px;
  background-color: #1c1d21;
  border: 1px solid #e2e8f07b;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: ${(props) => (props.$type === "category" ? "200px" : "120px")};
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${(props) => (props.$isSelected ? "#2e3036" : "#1C1D21")};

  &:hover {
    background-color: #31333a;
  }
`;

const Checkbox = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckIcon = styled.span`
  width: 12px;
  height: 8px;
  border: solid #3b82f6;
  border-width: 0 0 2px 2px;
  transform: rotate(-45deg);
  display: ${(props) => (props.$isChecked ? "block" : "none")};
`;

const YearItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #31333a;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const SearchWithFilters = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [animeList, setAnimeList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  

  const categoryRef = useRef(null);
  const yearRef = useRef(null);
  const searchTimeout = useRef(null);

  // Загрузка жанров при монтировании компонента
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("https://shikimori.one/api/genres", {
          headers: {
            "User-Agent": "AnimeSearchApp",
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        // Фильтруем только аниме жанры (kind: 'anime')
        const animeGenres = data.filter((genre) => genre.kind === "anime");
        setGenres(animeGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Обработчик кликов вне дропдаунов
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем, был ли клик вне dropdown-container
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target)) {
        setIsYearOpen(false);
      }
    };

    // Добавляем слушатель на документ
    document.addEventListener("mousedown", handleClickOutside);

    // Удаляем слушатель при размонтировании
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryRef, yearRef]);

  const years = ["2025", "2024", "2023", "2022", "2021"];

  const searchAnime = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        limit: 12,
        search: searchValue,
        genre: selectedCategories.join(","), // Используем genre вместо kind
        ...(selectedYear && { season: `${selectedYear}` }),
      });

      const response = await fetch(
        `https://shikimori.one/api/animes?${params}`,
        {
          headers: {
            "User-Agent": "AnimeSearchApp",
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setAnimeList(data);
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Поиск при изменении фильтров
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchAnime();
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchValue, selectedCategories, selectedYear]);

  const toggleCategory = (genreId) => {
    setSelectedCategories((prev) =>
      prev.includes(genreId)
        ? prev.filter((c) => c !== genreId)
        : [...prev, genreId]
    );
  };

  const selectYear = (year) => {
    setSelectedYear(year);
    setIsYearOpen(false);
  };

  return (
    <>
      <Container>
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Поиск..."
          />
        </SearchContainer>

        <DropdownContainer ref={categoryRef}>
          <DropdownButton onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
            Категории
            <ChevronIcon $isOpen={isCategoryOpen} />
          </DropdownButton>

          {isCategoryOpen && (
            <DropdownContent $type="category">
              {genres.map(genre => (
                <CategoryItem
                  key={genre.id}
                  $isSelected={selectedCategories.includes(genre.id)}
                  onClick={() => toggleCategory(genre.id)}
                >
                  <Checkbox>
                    <CheckIcon $isChecked={selectedCategories.includes(genre.id)} />
                  </Checkbox>
                  {genre.russian || genre.name}
                </CategoryItem>
              ))}
            </DropdownContent>
          )}
        </DropdownContainer>

        <DropdownContainer ref={yearRef}>
          <DropdownButton onClick={() => setIsYearOpen(!isYearOpen)}>
            {selectedYear || "Год"}
            <ChevronIcon $isOpen={isYearOpen} />
          </DropdownButton>

          {isYearOpen && (
            <DropdownContent $type="year">
              {years.map((year) => (
                <YearItem key={year} onClick={() => selectYear(year)}>
                  {year}
                </YearItem>
              ))}
            </DropdownContent>
          )}
        </DropdownContainer>
      </Container>

      <AnimeList>
        {isLoading ? (
          <div>Загрузка...</div>
        ) : (
          animeList.map(anime => (
            <AnimeCard key={anime.id}>
              <AnimeImage 
                src={`https://shikimori.one${anime.image.preview}`} 
                alt={anime.name}
              />
              <AnimeInfo>
                <AnimeTitle>{anime.russian || anime.name}</AnimeTitle>
              </AnimeInfo>
            </AnimeCard>
          ))
        )}
      </AnimeList>
    </>
  );
};

export default SearchWithFilters;
