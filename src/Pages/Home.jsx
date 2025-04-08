import { useState, useEffect } from "react";
import "../css/style.scss";
import "../css/Home.scss";
import { Helmet, HelmetProvider } from "react-helmet-async";
/*кампоненты*/
import HeaderEl from "../components/HeaderEl";
import HomeAnimeSlider from "../components/HomeAnimeSlider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
/*свайпер*/

const Home = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 12 * 60 * 60 * 1000, // 12 часов кеширования
        cacheTime: 12 * 60 * 60 * 1000, // Время хранения в кеше
        retry: 1, // Повтор запроса при ошибке
      },
    },
  });

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>AniCor - Главная</title>
        </Helmet>
        <HeaderEl />
        <main className="bg-[#0d0d0f]">
          <QueryClientProvider client={queryClient}>
            <HomeAnimeSlider />
          </QueryClientProvider>
        </main>
      </div>
    </HelmetProvider>
  );
};
export default Home;
