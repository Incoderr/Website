import {useState, useEffect} from "react";
import "../css/style.scss";
import "../css/Home.scss";
import { Link } from "react-router-dom";
/*кампоненты*/
import HeaderEl from "../components/HeaderEl";
import FooterEl from "../components/FooterEl";
import HomeAnimeSlider from "../components/HomeAnimeSlider";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
    <div>
      <HeaderEl />
      <main>
        <QueryClientProvider client={queryClient}>
          <HomeAnimeSlider />
        </QueryClientProvider>
      </main>
    </div>
  );
}
export default Home;
