import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingEl from "./components/ui/Loading"; // Предполагаемый компонент загрузки

// Ленивая загрузка страниц
const Home = React.lazy(() => import("./Pages/Home"));
const NotFound = React.lazy(() => import("./Pages/NotFound"));
const Profile = React.lazy(() => import("./Pages/Profile.tsx"));
const Auth = React.lazy(() => import("./Pages/Auth"));
const Search = React.lazy(() => import("./Pages/Search.tsx"));
const Admin = React.lazy(() => import("./Pages/Admin.tsx"));
const Film = React.lazy(() => import("./Film/Pages/FilmHome"));
const CollectionView = React.lazy(() => import("./Pages/CollectionView"));
const Au = React.lazy(() => import("./Pages/Au"));
const PlayerPage = React.lazy(() => import("./Pages/WatchPage.tsx"));

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
        <Suspense fallback={<LoadingEl />}>
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
            <Route path="/collections/:collectionId" element={<CollectionView />} />
            <Route path="/au" element={<Au />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;