import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/Profile";
import Auth from "./Pages/Auth";
import Search from "./Pages/Search";

//Film
import Film from './Film/Pages/FilmHome';
//test
import PlayerPage from "./Pages/WatchPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/search" element={<Search />} />
        <Route path="/film" element={<Film />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/player/:ttid" element={<PlayerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
