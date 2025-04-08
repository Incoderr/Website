import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../assets/config";
import { debounce } from "lodash";

interface Anime {
  _id: string;
  imdbID: string;
  Title: string;
  Poster: string;
  Genre: string[];
}

export const useAnimeSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const genreMapping = {
    "Экшен": "Action",
    "Приключения": "Adventure",
    "Комедия": "Comedy",
    "Драма": "Drama",
    "Этти": "Ecchi",
    "Фэнтези": "Fantasy",
    "Хоррор": "Horror",
    "Меха": "Mecha",
    "Музыка": "Music",
    "Детектив": "Mystery",
    "Психологическое": "Psychological",
    "Романтика": "Romance",
    "Научная фантастика": "Sci-Fi",
    "Повседневность": "Slice of Life",
    "Спорт": "Sports",
    "Сверхъестественное": "Supernatural",
    "Триллер": "Thriller",
  };

  const fetchAnime = async ({ queryKey }: { queryKey: [string, string | null, string] }) => {
    const [, genre, search] = queryKey;
    const response = await axios.get(`${API_URL}/anime`, {
      params: {
        genre: genre ? genreMapping[genre] || genre : "",
        search: search || "",
      },
    });
    return Array.from(new Map(response.data.map((item: Anime) => [item._id, item])).values()).map(
      (item: Anime) => ({
        ...item,
        Genre: Array.isArray(item.Genre)
          ? item.Genre.map((g) => {
              const russianGenre = Object.entries(genreMapping).find(
                ([_, eng]) => eng === g
              )?.[0];
              return russianGenre || g;
            })
          : [],
      })
    );
  };

  const { data: anime = [], isLoading, refetch } = useQuery<Anime[]>({
    queryKey: ["anime", selectedGenre, searchQuery],
    queryFn: fetchAnime,
    enabled: !!(selectedGenre || searchQuery), // Запрос выполняется только если есть жанр или поиск
  });

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      if (!query.trim()) setSelectedGenre(null);
      refetch();
    }, 1000),
    [refetch]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedGenre(null);
    debouncedSearch(query);
  };

  const filterByGenre = (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery("");
    refetch();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedGenre(null);
  };

  return {
    anime,
    searchQuery,
    selectedGenre,
    isLoading,
    handleSearch,
    filterByGenre,
    clearSearch,
  };
};