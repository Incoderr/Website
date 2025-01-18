import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "./Pages/PlayerPage";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Categories from "./Pages/Categories";
import Profile from "./Pages/Profile";
import Auth from "./Pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<Player />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
