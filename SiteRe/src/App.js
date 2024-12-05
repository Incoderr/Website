import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import Player from "./PlayerPage";
import Home from "./Home";
import NotFound from "./NotFound";

function App() {
  return (
    <Routes>
      {/* Главная страница */}
      <Route path="/" element={<Home />} />
      
      {/* Страница плеера */}
      <Route path="/Player" element={<Player />} />

      {/* Страница на случай некорректного URL */}
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  );
}

export default App;
