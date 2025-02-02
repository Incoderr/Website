import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "./Pages/SearchPage";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/Profile";
import Auth from "./Pages/Auth";
import Search from "./Pages/Search";
import SearchPage from './Pages/SearchPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<Player />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/search" element={<Search />} />
        <Route path="/searchp" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
