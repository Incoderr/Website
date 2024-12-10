import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
  return (
    <div className='NotFound' style={{justifyItems: 'center'}}>
      <h2>Страница не найдена</h2>
      <Link to="/">go to home</Link>
    </div>
  )
};

export default NotFound;
