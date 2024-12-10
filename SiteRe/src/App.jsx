import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from "./Pages/PlayerPage";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Categories from "./Pages/Categories";
import Profile from "./Pages/Profile";

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Player" element={<Player />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>
  )
};

export default App;
