import React from 'react';
import './index.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Player from "./Player-page";
import Home from "./Home"
import NotFound from './NotFound';
function App() {

return (
    <Router>
    <Routes>
      {/* Главная страница */}
      <Route path="/" element={<Home />} />
      
      {/* Страница плеера */}
      <Route path="/player" element={<Player />} />

     {/* Страница на случай некорректного URL */}
     <Route path="*" element={<NotFound />} /> 
    </Routes>
  </Router>
  );
};
export default App;
