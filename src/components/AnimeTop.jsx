import React from "react";
import "../css/top.css";


const CardExample = () => {
  // Массив с данными для 20 карточек
  const topData = [
    { id: 1, name: "Alexander Smith", score: 9.33 },
    { id: 2, name: "Emma Johnson", score: 9.28 },
    { id: 3, name: "Michael Brown", score: 9.21 },
    { id: 4, name: "Sophia Davis", score: 9.15 },
    { id: 5, name: "William Wilson", score: 9.12 },
    { id: 6, name: "Olivia Moore", score: 9.08 },
    { id: 7, name: "James Taylor", score: 9.01 },
    { id: 8, name: "Isabella Anderson", score: 8.95 },
    { id: 9, name: "Lucas Martin", score: 8.92 },
    { id: 10, name: "Mia Thompson", score: 8.88 },
  ];

  return (
    <div className="top-box">
      {topData.map((item) => (
        <div key={item.id} className="top-container">
          <h4>#{item.id}</h4>
          <div className="top-cardBox">
            <div className="top-card"></div>
            <div className="top-name">
              <h5>{item.name}</h5>
              <span className="top-score">
                <i className="bi bi-star"></i>
                <p>{item.score.toFixed(2)}</p>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardExample;