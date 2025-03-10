import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile:/username" element={<Profile />} />
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

export default App;