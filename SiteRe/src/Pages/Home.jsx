import React from 'react';
import '../css/index.css'
import '../css/media.css'
import { Link } from "react-router-dom";
import HeaderEl from '../components/HeaderEl';
function Home() {

return (
  <div className='media'>
    <HeaderEl/>
    <main className='mainhome'>
        <h1>Welcome to Home Page</h1>
        <Link to={"/Player"}>Go to Player</Link>
    </main>
    <footer>
        <h1>hi</h1>
    </footer>
  </div>
  )
};
export default Home;
