import React from "react";
import HeaderEl from "../components/HeaderEl";
import styled from 'styled-components';

function Categories() {
  return (
    <div>
      <HeaderEl />
      <main className="all-padding">
        <CategoriesBox>
          <SideBar>
            <h2>Категории</h2>
            <hr />
            <p>Хоррор</p>
            <p>Фентези</p>
            <p>Детектив</p>
            <p>Романтика</p>
          </SideBar>
          <CategorieCardBox>
            <NavContainer>
              <CategorieNavigate>
                <i className="bi bi-grid fs-3 icon-box"></i>
                <i className="bi bi-list fs-3 icon-box"></i>
                <input type="text" />
              </CategorieNavigate>
            </NavContainer>
            <CardContainer>
              <CategorieCard></CategorieCard>
              <CategorieCard></CategorieCard>
              <CategorieCard></CategorieCard>
              <CategorieCard></CategorieCard>
              <CategorieCard></CategorieCard>
              <CategorieCard></CategorieCard>
              <CategorieCard></CategorieCard>
            </CardContainer>
          </CategorieCardBox>
        </CategoriesBox>
      </main>
    </div>
  );
}

export default Categories;

const CategoriesBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
`;

const CardContainer = styled.div`
  gap: 13px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
`;

const CategorieCard = styled.div`
  width: 200px;
  height: 300px;
  border-radius: 10px;
  background-color: #1b1d21;
`;

const CategorieCardBox = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  max-width: 1072px;
  margin-left: 20px;
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

const SideBar = styled.div`
background-color: #1b1d21;
  width: 240px;
  height: 400px;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 25px;
  border-radius: 10px;
  margin-top: 60px;
  gap: 10px;

  p{
    font-size: 20px;
  }
`;