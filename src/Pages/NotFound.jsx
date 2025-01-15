import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css';
import HeaderEl from "../components/HeaderEl.jsx";

const NotFound = () => {
  return (
    <div className='NotFound' style={{justifyItems: 'center'}}>
      <h2>Страница не найдена</h2>
      <Link to="/">Домой</Link>
    </div>
  )
};

export default NotFound;
