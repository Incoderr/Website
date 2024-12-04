import React from 'react';
import './index.css';
import { Link } from "react-router-dom";
function Home() {

return (
  <div>
    <header>
        <div className="logo">
            <i className="bi bi-camera-reels-fill fs-2"></i>
            <h2>Label</h2>
        </div>
        <div className="search-box">
            <input type="text" name="Поиск" id="" placeholder="Поиск"/>
        </div>
        <div className="nav-bar">
            <nav className="nav-box">
                <ul>
                    <li>Главная</li>
                    <li>Категории</li>
                    <li>Профиль</li>
                </ul>
            </nav>
        </div>
    </header>
    <main className='mainhome'>
    <h1>Welcome to Home Page</h1>
      <Link to="/Player">
        <button className='linkbut'>Go to Player</button>
      </Link>
    </main>
    <footer>

    </footer>
  </div>
  );
};
export default Home;
