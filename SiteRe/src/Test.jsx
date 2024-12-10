import React from 'react';
import { Link } from 'react-router-dom';


const Test = () => {
  return (
    <div style={{justifyItems: 'center'}}>
      <h2>Страница не найдена</h2>
      <Link to="/">go to home</Link>
    </div>
  )
};

export default Test;
