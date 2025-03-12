import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/Profile";
import Auth from "./Pages/Auth";
import Search from "./Pages/Search";
import Admin from "./Pages/Admin.tsx";
import Film from './Film/Pages/FilmHome';
import Au from './Pages/Au';
import PlayerPage from "./Pages/WatchPage.tsx";

// Создаём экземпляр QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Данные свежие 5 минут
      cacheTime: 10 * 60 * 1000, // Кэш хранится 10 минут
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <TitleManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/search" element={<Search />} />
          <Route path="/film" element={<Film />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/player/:imdbID" element={<PlayerPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/au" element={<Au />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function TitleManager() {
  const { pathname } = useLocation();

  const getTitle = () => {
    switch (pathname) {
      case "/":
        return "AniCor | Главная";
      case "/auth":
        return "AniCor | Авторизация";
      case "/search":
        return "AniCor | Поиск";
      case "/admin":
        return "AniCor | Админ-панель";
      default:
        if (pathname.startsWith("/profile/")) {
          const username = pathname.replace("/profile/", "").replace("/", "") || "Мой";
          return `AniCor | Профиль ${username}`;
        }
        return "AniCor";
    }
  };

  return <Helmet><title>{getTitle()}</title></Helmet>;
}

export default App;