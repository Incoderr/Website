import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/Profile";
import Auth from "./Pages/Auth";
import Search from "./Pages/Search";
import Player from './Pages/Player';

//Film
import Film from './Film/FilmHome';
//test
import SearchPage from "./Pages/SearchPage";
import PlayerPage from "./Pages/WatchPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/search" element={<Search />} />
        <Route path="/player/" element={<Player />} />
        <Route path="/film" element={<Film />} />
        <Route path="*" element={<NotFound />} />
        {/*test*/}
        <Route path="/se" element={<SearchPage />} />
        <Route path="/player/:id" element={<PlayerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
