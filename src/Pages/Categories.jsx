import React from "react";
import HeaderEl from "../components/HeaderEl";
import "../css/Categories.css";
import styled from 'styled-components';

function Categories() {
  return (
    <div>
      <HeaderEl />
      <main className="all-padding">
        <div className="CategoriesBox" >
          <div className="side-bar">
            <h2>Категории</h2>
            <hr />
            <p>Хоррор</p>
            <p>Фентези</p>
            <p>Детектив</p>
            <p>Романтика</p>
          </div>
          <div className="CategorieCardBox">
            <NavContainer>
              <CategorieNavigate>
                <i className="bi bi-grid fs-3 icon-box"></i>
                <i className="bi bi-list fs-3 icon-box"></i>
                <input type="text" />
              </CategorieNavigate>
            </NavContainer>
            <CardContainer>
              <div className="CategorieCard"></div>
              <div className="CategorieCard"></div>
              <div className="CategorieCard"></div>
              <div className="CategorieCard"></div>
              <div className="CategorieCard"></div>
              <div className="CategorieCard"></div>
              <div className="CategorieCard"></div>
            </CardContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Categories;



const CardContainer = styled.div`
  gap: 13px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
`;





const NavContainer = styled.div`
  margin-left: auto;
  margin-right: 9px;
  margin-bottom: 13px;
`;

const CategorieNavigate = styled.nav`
  display: flex;
  gap: 7px;

    input{
      width: 400px;
      background-color: #313337;
      border-color: #00000000;
      border-radius: 10px;
      color: white;
      padding-left: 10px;
    }

    .icon-box{
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #313337;
      border-radius: 5px;
      width: 35px;
      height: 35px;
    }
`;

